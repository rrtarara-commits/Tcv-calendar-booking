import Storage "mo:caffeineai-object-storage/Storage";

module {
  /// A confirmed booking created by a client.
  public type Booking = {
    bookingId : Text;
    linkId : Text;
    clientName : Text;
    clientEmail : Text;
    purpose : Text;
    timeSlotStart : Int;
    timeSlotEnd : Int;
    fileUrls : [Storage.ExternalBlob];
    createdAt : Int;
    isCancelled : Bool;
    managementToken : Text;
  };

  /// Public-facing shared type for API boundary.
  public type BookingView = {
    bookingId : Text;
    linkId : Text;
    clientName : Text;
    clientEmail : Text;
    purpose : Text;
    timeSlotStart : Int;
    timeSlotEnd : Int;
    fileUrls : [Storage.ExternalBlob];
    createdAt : Int;
    isCancelled : Bool;
    managementToken : Text;
  };

  /// Input provided by the client when creating a booking.
  public type CreateBookingInput = {
    linkId : Text;
    clientName : Text;
    clientEmail : Text;
    purpose : Text;
    timeSlotStart : Int;
    timeSlotEnd : Int;
    fileUrls : [Storage.ExternalBlob];
  };

  /// A computed available time slot returned to clients.
  public type TimeSlot = {
    start : Int;
    end : Int;
  };

  /// A busy interval passed from the frontend after parsing Google Calendar JSON.
  public type BusyInterval = {
    start : Int;
    end : Int;
  };
};
