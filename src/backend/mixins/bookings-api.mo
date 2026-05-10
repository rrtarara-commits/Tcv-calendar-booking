import Runtime "mo:core/Runtime";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import EmailClient "mo:caffeineai-email/emailClient";
import Types "../types/bookings";
import LinkTypes "../types/booking-links";
import BookingsLib "../lib/bookings";
import BookingLinksLib "../lib/booking-links";
import Nat64 "mo:core/Nat64";
import UsersLib "../lib/users";
import UserTypes "../types/users";
import Time "mo:core/Time";

mixin (
  bookingsState : BookingsLib.State,
  linksState : BookingLinksLib.State,
  usersState : UsersLib.State,
  transform : OutCall.Transform,
) {

  // ── Public: Google Calendar proxy (raw JSON tunnelled to frontend) ────────

  /// Fetch Google Calendar freeBusy JSON.
  /// timeMin and timeMax are RFC3339 strings formatted by the caller (e.g. "2026-04-27T00:00:00Z").
  /// Returns raw JSON string — the frontend parses busy intervals from it.
  /// Requires Google Calendar credentials to be stored by the host.
  /// Automatically refreshes the access token if it is expired or within 5 minutes of expiring.
  public shared ({ caller }) func fetchGoogleCalendarFreeBusy(calendarId : Text, timeMin : Text, timeMax : Text) : async Text {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    let credsKey = caller.toText();
    let creds = switch (BookingLinksLib.getGoogleCredentials(linksState, credsKey)) {
      case (null) Runtime.trap("Google Calendar credentials not set");
      case (?c) c;
    };

    // Refresh if expired or within 5 minutes of expiry (5 * 60 * 1_000_000_000 ns)
    let fiveMinNs : Int = 5 * 60 * 1_000_000_000;
    let accessToken : Text = if (creds.expiresAt - Time.now() < fiveMinNs) {
      switch (await BookingLinksLib.refreshGoogleToken(linksState, credsKey, transform)) {
        case (#ok(newToken)) newToken;
        case (#err(msg)) Runtime.trap("Token refresh failed: " # msg # " — please reconnect Google Calendar");
      };
    } else {
      creds.accessToken;
    };

    let url = "https://www.googleapis.com/calendar/v3/freeBusy";
    let body = "{\"timeMin\":\"" # timeMin # "\",\"timeMax\":\"" # timeMax # "\",\"items\":[{\"id\":\"" # calendarId # "\"}]}";

    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # accessToken },
      { name = "Content-Type"; value = "application/json" },
    ];

    await OutCall.httpPostRequest(url, headers, body, transform);
  };

  // ── Public: Available slots query ─────────────────────────────────────────

  /// Compute available slots for a booking link given pre-parsed busy intervals.
  public query func getAvailableSlots(
    linkId : Text,
    rangeStart : Int,
    rangeEnd : Int,
    busyIntervals : [Types.BusyInterval],
  ) : async [Types.TimeSlot] {
    let link = switch (BookingLinksLib.getLink(linksState, linkId)) {
      case (null) Runtime.trap("Booking link not found");
      case (?l) l;
    };
    if (not link.isActive) Runtime.trap("Booking link is not active");

    let overrides = BookingLinksLib.getOverridesForLink(linksState, linkId);
    BookingsLib.computeAvailableSlots(
      bookingsState,
      linkId,
      link.duration,
      rangeStart,
      rangeEnd,
      busyIntervals,
      overrides,
    );
  };

  // ── Public: Create booking ─────────────────────────────────────────────────

  /// Create a booking for a given link. Immediately confirmed. No auth required (public endpoint).
  /// busyIntervals must be supplied by the caller (parsed from fetchGoogleCalendarFreeBusy).
  /// Sends a calendar invite to the client email including a management link.
  public shared func createBooking(
    input : Types.CreateBookingInput,
    busyIntervals : [Types.BusyInterval],
    appBaseUrl : Text,
  ) : async Types.BookingView {
    let link = switch (BookingLinksLib.getLink(linksState, input.linkId)) {
      case (null) Runtime.trap("Booking link not found");
      case (?l) l;
    };
    if (not link.isActive) Runtime.trap("Booking link is not active");

    let overrides = BookingLinksLib.getOverridesForLink(linksState, input.linkId);
    if (not BookingsLib.isSlotAvailable(bookingsState, input.linkId, input.timeSlotStart, input.timeSlotEnd, busyIntervals, overrides)) {
      Runtime.trap("Requested time slot is not available");
    };

    let booking = BookingsLib.createBooking(bookingsState, input);
    let managementLink = appBaseUrl # "/manage/" # booking.managementToken;

    let startNs : Nat = if (booking.timeSlotStart >= 0) booking.timeSlotStart.toNat() else 0;
    let endNs : Nat = if (booking.timeSlotEnd >= 0) booking.timeSlotEnd.toNat() else 0;

    let event : EmailClient.CalendarEvent = {
      uid = booking.bookingId;
      sequence = 0;
      method = #request;
      summary = "Meeting: " # booking.purpose;
      description = "Your meeting has been confirmed.\n\nManage your booking (reschedule or cancel):\n" # managementLink;
      location = "";
      startTime = Nat64.fromNat(startNs / 1_000);
      endTime = Nat64.fromNat(endNs / 1_000);
      organizer = { email = "bookslot@caffeine.ai"; name = ?"BookSlot" };
      attendees = [{
        who = { email = booking.clientEmail; name = ?booking.clientName };
        role = #required;
      }];
    };

    ignore await EmailClient.sendCalendarEvent("bookslot", event);
    BookingsLib.toView(booking);
  };

  // ── Public: Management by token (no auth, token is the secret) ───────────

  /// Retrieve a booking by management token. Returns null if not found.
  public query func getBookingByToken(token : Text) : async ?Types.BookingView {
    switch (BookingsLib.getBookingByToken(bookingsState, token)) {
      case (null) null;
      case (?b) ?BookingsLib.toView(b);
    };
  };

  /// Reschedule a booking using its management token.
  /// Validates the new slot is available, updates the booking, sends updated calendar invite.
  public shared func rescheduleBookingByToken(
    token : Text,
    newTimeSlotStart : Int,
    newTimeSlotEnd : Int,
    busyIntervals : [Types.BusyInterval],
    appBaseUrl : Text,
  ) : async { #ok : Types.BookingView; #err : Text } {
    let booking = switch (BookingsLib.getBookingByToken(bookingsState, token)) {
      case (null) { return #err("Booking not found") };
      case (?b) b;
    };

    let overrides = BookingLinksLib.getOverridesForLink(linksState, booking.linkId);
    switch (BookingsLib.rescheduleBookingByToken(bookingsState, token, newTimeSlotStart, newTimeSlotEnd, busyIntervals, overrides)) {
      case (#err(msg)) { #err(msg) };
      case (#ok(updated)) {
        // Cancel old invite
        let oldStartNs : Nat = if (booking.timeSlotStart >= 0) booking.timeSlotStart.toNat() else 0;
        let oldEndNs : Nat = if (booking.timeSlotEnd >= 0) booking.timeSlotEnd.toNat() else 0;
        let cancelEvent : EmailClient.CalendarEvent = {
          uid = updated.bookingId;
          sequence = 1;
          method = #cancel;
          summary = "Meeting: " # updated.purpose;
          description = "Your previous meeting booking has been cancelled as part of a reschedule.";
          location = "";
          startTime = Nat64.fromNat(oldStartNs / 1_000);
          endTime = Nat64.fromNat(oldEndNs / 1_000);
          organizer = { email = "bookslot@caffeine.ai"; name = ?"BookSlot" };
          attendees = [{
            who = { email = updated.clientEmail; name = ?updated.clientName };
            role = #required;
          }];
        };
        ignore await EmailClient.sendCalendarEvent("bookslot", cancelEvent);

        // Send new invite
        let newStartNs : Nat = if (newTimeSlotStart >= 0) newTimeSlotStart.toNat() else 0;
        let newEndNs : Nat = if (newTimeSlotEnd >= 0) newTimeSlotEnd.toNat() else 0;
        let managementLink = appBaseUrl # "/manage/" # updated.managementToken;
        let newEvent : EmailClient.CalendarEvent = {
          uid = updated.bookingId;
          sequence = 2;
          method = #request;
          summary = "Meeting: " # updated.purpose;
          description = "Your meeting has been rescheduled.\n\nTo reschedule or cancel your appointment, use this link: " # managementLink;
          location = "";
          startTime = Nat64.fromNat(newStartNs / 1_000);
          endTime = Nat64.fromNat(newEndNs / 1_000);
          organizer = { email = "bookslot@caffeine.ai"; name = ?"BookSlot" };
          attendees = [{
            who = { email = updated.clientEmail; name = ?updated.clientName };
            role = #required;
          }];
        };
        ignore await EmailClient.sendCalendarEvent("bookslot", newEvent);
        #ok(BookingsLib.toView(updated));
      };
    };
  };

  /// Cancel a booking using its management token.
  /// Marks booking as cancelled and sends a cancellation calendar notice.
  public shared func cancelBookingByToken(token : Text) : async { #ok : Bool; #err : Text } {
    switch (BookingsLib.cancelBookingByToken(bookingsState, token)) {
      case (null) { #err("Booking not found") };
      case (?booking) {
        let startNs : Nat = if (booking.timeSlotStart >= 0) booking.timeSlotStart.toNat() else 0;
        let endNs : Nat = if (booking.timeSlotEnd >= 0) booking.timeSlotEnd.toNat() else 0;
        let cancelEvent : EmailClient.CalendarEvent = {
          uid = booking.bookingId;
          sequence = 1;
          method = #cancel;
          summary = "Meeting: " # booking.purpose;
          description = "Your meeting booking has been cancelled.";
          location = "";
          startTime = Nat64.fromNat(startNs / 1_000);
          endTime = Nat64.fromNat(endNs / 1_000);
          organizer = { email = "bookslot@caffeine.ai"; name = ?"BookSlot" };
          attendees = [{
            who = { email = booking.clientEmail; name = ?booking.clientName };
            role = #required;
          }];
        };
        ignore await EmailClient.sendCalendarEvent("bookslot", cancelEvent);
        #ok(true);
      };
    };
  };

  // ── Host: View and manage bookings ────────────────────────────────────────

  /// List all confirmed bookings. Only callable by active users.
  public shared ({ caller }) func listBookings() : async [Types.BookingView] {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingsLib.listAllBookings(bookingsState);
  };

  /// Cancel a booking by ID. Only callable by active users.
  public shared ({ caller }) func cancelBooking(bookingId : Text) : async Bool {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingsLib.cancelBooking(bookingsState, bookingId);
  };
};
