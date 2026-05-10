import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Types "./types/booking-links";
import BookingTypes "./types/bookings";
import UserTypes "./types/users";

module {
  // ── Old bookingLinksState shape (previous deploy, inline) ───────────────
  // bookingsState and usersState are type-compatible with current types
  // (no structural change there), so we reuse the live imported types.

  type OldBookingLinksState = {
    links : Map.Map<Text, Types.BookingLink>;
    overrides : Map.Map<Text, Set.Set<Int>>;
    overrideDetails : Map.Map<Text, Types.BusyOverride>;
    googleCreds : Map.Map<Text, Types.GoogleCredentials>;
    var nextId : Nat;
    var hostPrincipal : Principal;
    // googleOAuthClientId is the NEW field being added
  };

  type OldBookingsState = {
    bookings : Map.Map<Text, BookingTypes.Booking>;
    tokenIndex : Map.Map<Text, Text>;
    var nextId : Nat;
  };

  type OldUsersState = {
    users : Map.Map<Text, UserTypes.User>;
    inviteTokens : Map.Map<Text, Text>;
    principalIndex : Map.Map<Text, Text>;
  };

  type OldActor = {
    var appBaseUrl : Text;
    bookingLinksState : OldBookingLinksState;
    bookingsState : OldBookingsState;
    usersState : OldUsersState;
  };

  // ── New bookingLinksState shape ──────────────────────────────────────

  type NewBookingLinksState = {
    links : Map.Map<Text, Types.BookingLink>;
    overrides : Map.Map<Text, Set.Set<Int>>;
    overrideDetails : Map.Map<Text, Types.BusyOverride>;
    googleCreds : Map.Map<Text, Types.GoogleCredentials>;
    var nextId : Nat;
    var hostPrincipal : Principal;
    var googleOAuthClientId : Text;
  };

  type NewActor = {
    var appBaseUrl : Text;
    bookingLinksState : NewBookingLinksState;
    bookingsState : OldBookingsState;
    usersState : OldUsersState;
  };

  // ── Migration: add googleOAuthClientId with empty default ──────────────

  public func run(old : OldActor) : NewActor {
    let newBookingLinksState : NewBookingLinksState = {
      links = old.bookingLinksState.links;
      overrides = old.bookingLinksState.overrides;
      overrideDetails = old.bookingLinksState.overrideDetails;
      googleCreds = old.bookingLinksState.googleCreds;
      var nextId = old.bookingLinksState.nextId;
      var hostPrincipal = old.bookingLinksState.hostPrincipal;
      var googleOAuthClientId = "";
    };
    {
      var appBaseUrl = old.appBaseUrl;
      bookingLinksState = newBookingLinksState;
      bookingsState = old.bookingsState;
      usersState = old.usersState;
    };
  };
};
