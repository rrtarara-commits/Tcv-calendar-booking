import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/bookings";
import LinkTypes "../types/booking-links";

module {
  public type State = {
    bookings : Map.Map<Text, Types.Booking>;
    /// token -> bookingId reverse index for fast management-token lookup
    tokenIndex : Map.Map<Text, Text>;
    var nextId : Nat;
  };

  /// Returns the slot duration in nanoseconds for a given Duration variant.
  public func durationToNanos(duration : LinkTypes.Duration) : Int {
    let minutes : Int = switch (duration) {
      case (#min15) 15;
      case (#min30) 30;
      case (#min45) 45;
      case (#min60) 60;
    };
    minutes * 60 * 1_000_000_000;
  };

  /// Generate a unique booking ID.
  public func generateId(state : State) : Text {
    state.nextId += 1;
    "booking-" # state.nextId.toText() # "-" # Time.now().toText();
  };

  /// Generate a management token from booking ID and current time.
  public func generateToken(bookingId : Text) : Text {
    let ts = Time.now();
    let absTs : Nat = if (ts >= 0) ts.toNat() else 0;
    bookingId # "-" # absTs.toText();
  };

  /// Create and store a new booking (immediately confirmed).
  /// Also indexes the management token for fast lookup.
  public func createBooking(state : State, input : Types.CreateBookingInput) : Types.Booking {
    let bookingId = generateId(state);
    let token = generateToken(bookingId);
    let booking : Types.Booking = {
      bookingId;
      linkId = input.linkId;
      clientName = input.clientName;
      clientEmail = input.clientEmail;
      purpose = input.purpose;
      timeSlotStart = input.timeSlotStart;
      timeSlotEnd = input.timeSlotEnd;
      fileUrls = input.fileUrls;
      createdAt = Time.now();
      isCancelled = false;
      managementToken = token;
    };
    state.bookings.add(bookingId, booking);
    state.tokenIndex.add(token, bookingId);
    booking;
  };

  /// Get a single booking by ID.
  public func getBooking(state : State, bookingId : Text) : ?Types.Booking {
    state.bookings.get(bookingId);
  };

  /// Look up a booking by management token.
  public func getBookingByToken(state : State, token : Text) : ?Types.Booking {
    switch (state.tokenIndex.get(token)) {
      case (null) null;
      case (?bookingId) state.bookings.get(bookingId);
    };
  };

  /// List all bookings for the host (all links, all clients).
  public func listAllBookings(state : State) : [Types.BookingView] {
    state.bookings.values().filter(func(b : Types.Booking) : Bool { not b.isCancelled })
      .map(func(b : Types.Booking) : Types.BookingView { toView(b) })
      .toArray();
  };

  /// List active bookings for a given linkId (used for slot conflict checks).
  public func listActiveBookingsForLink(state : State, linkId : Text) : [Types.Booking] {
    state.bookings.values().filter(func(b : Types.Booking) : Bool { b.linkId == linkId and not b.isCancelled })
      .toArray();
  };

  /// Cancel a booking by ID; returns false if not found.
  public func cancelBooking(state : State, bookingId : Text) : Bool {
    switch (state.bookings.get(bookingId)) {
      case (null) false;
      case (?booking) {
        let cancelled = { booking with isCancelled = true };
        state.bookings.add(bookingId, cancelled);
        true;
      };
    };
  };

  /// Cancel a booking by management token; returns the cancelled booking or null.
  public func cancelBookingByToken(state : State, token : Text) : ?Types.Booking {
    switch (state.tokenIndex.get(token)) {
      case (null) null;
      case (?bookingId) {
        switch (state.bookings.get(bookingId)) {
          case (null) null;
          case (?booking) {
            let cancelled = { booking with isCancelled = true };
            state.bookings.add(bookingId, cancelled);
            ?cancelled;
          };
        };
      };
    };
  };

  /// Reschedule a booking by management token to a new time slot.
  /// Validates the new slot is available before updating.
  public func rescheduleBookingByToken(
    state : State,
    token : Text,
    newTimeSlotStart : Int,
    newTimeSlotEnd : Int,
    busyIntervals : [Types.BusyInterval],
    overrides : [LinkTypes.BusyOverride],
  ) : { #ok : Types.Booking; #err : Text } {
    switch (state.tokenIndex.get(token)) {
      case (null) { #err("Booking not found") };
      case (?bookingId) {
        switch (state.bookings.get(bookingId)) {
          case (null) { #err("Booking not found") };
          case (?booking) {
            if (booking.isCancelled) { return #err("Booking is already cancelled") };
            if (not isSlotAvailable(state, booking.linkId, newTimeSlotStart, newTimeSlotEnd, busyIntervals, overrides)) {
              return #err("Requested time slot is not available");
            };
            let updated = { booking with timeSlotStart = newTimeSlotStart; timeSlotEnd = newTimeSlotEnd };
            state.bookings.add(bookingId, updated);
            #ok(updated);
          };
        };
      };
    };
  };

  /// Compute available slots given busy intervals, existing bookings, overrides, and slot duration.
  /// busyIntervals are passed in (parsed from Google Calendar JSON on the frontend/caller side).
  /// rangeStart/rangeEnd are in nanoseconds (Time.Time / Int).
  public func computeAvailableSlots(
    state : State,
    linkId : Text,
    duration : LinkTypes.Duration,
    rangeStart : Int,
    rangeEnd : Int,
    busyIntervals : [Types.BusyInterval],
    overrides : [LinkTypes.BusyOverride],
  ) : [Types.TimeSlot] {
    let slotNanos = durationToNanos(duration);

    let bookableOverrides = overrides.filter(func(o : LinkTypes.BusyOverride) : Bool {
      o.linkId == linkId and o.isBookable
    });

    let confirmedBookings = listActiveBookingsForLink(state, linkId);

    let slots = List.empty<Types.TimeSlot>();
    var t = rangeStart;
    while (t + slotNanos <= rangeEnd) {
      let slotStart = t;
      let slotEnd = t + slotNanos;

      let isBusy = busyIntervals.find(func(busy : Types.BusyInterval) : Bool {
        slotStart < busy.end and slotEnd > busy.start
      }) != null;

      let isOverridden = isBusy and bookableOverrides.find(func(o : LinkTypes.BusyOverride) : Bool {
        o.slotStart == slotStart
      }) != null;

      let isAlreadyBooked = confirmedBookings.find(func(b : Types.Booking) : Bool {
        slotStart < b.timeSlotEnd and slotEnd > b.timeSlotStart
      }) != null;

      if ((not isBusy or isOverridden) and not isAlreadyBooked) {
        slots.add({ start = slotStart; end = slotEnd });
      };

      t += slotNanos;
    };

    slots.toArray();
  };

  /// Check if a requested time slot is available.
  public func isSlotAvailable(
    state : State,
    linkId : Text,
    slotStart : Int,
    slotEnd : Int,
    busyIntervals : [Types.BusyInterval],
    overrides : [LinkTypes.BusyOverride],
  ) : Bool {
    let isBusy = busyIntervals.find(func(busy : Types.BusyInterval) : Bool {
      slotStart < busy.end and slotEnd > busy.start
    }) != null;

    let isOverridden = isBusy and overrides.find(func(o : LinkTypes.BusyOverride) : Bool {
      o.linkId == linkId and o.slotStart == slotStart and o.isBookable
    }) != null;

    let isAlreadyBooked = listActiveBookingsForLink(state, linkId).find(func(b : Types.Booking) : Bool {
      slotStart < b.timeSlotEnd and slotEnd > b.timeSlotStart
    }) != null;

    (not isBusy or isOverridden) and not isAlreadyBooked;
  };

  /// Convert internal Booking to shared BookingView.
  public func toView(booking : Types.Booking) : Types.BookingView {
    booking;
  };
};
