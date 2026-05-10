import Time "mo:core/Time";

module {
  /// Duration options in minutes for a booking link.
  public type Duration = { #min15; #min30; #min45; #min60 };

  /// A booking link created by the host.
  public type BookingLink = {
    id : Text;
    name : Text;
    description : Text;
    duration : Duration;
    isActive : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  /// Public-facing shared type for API boundary.
  public type BookingLinkView = {
    id : Text;
    name : Text;
    description : Text;
    duration : Duration;
    isActive : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Represents a calendar slot that the host has overridden to allow booking
  /// even though it appears busy in Google Calendar.
  public type BusyOverride = {
    linkId : Text;
    slotStart : Int;   // Unix nanoseconds (matches Time.Time / Int)
    slotEnd : Int;
    isBookable : Bool;
  };

  /// Google Calendar OAuth credentials stored by the host.
  public type GoogleCredentials = {
    accessToken : Text;
    refreshToken : Text;
    expiresAt : Int;
  };

  /// Status of stored Google Calendar OAuth credentials.
  public type GoogleCredentialStatus = {
    hasCredentials : Bool;
    isExpired : Bool;
    expiresAt : ?Int;
  };

  /// Input type for creating or updating a booking link.
  public type BookingLinkInput = {
    name : Text;
    description : Text;
    duration : Duration;
  };
};
