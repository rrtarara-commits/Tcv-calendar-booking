import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Types "../types/booking-links";
import BookingLinksLib "../lib/booking-links";
import UsersLib "../lib/users";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin (state : BookingLinksLib.State, usersState : UsersLib.State, transform : OutCall.Transform) {

  /// Create a new booking link. Only callable by the host.
  public shared ({ caller }) func createBookingLink(input : Types.BookingLinkInput) : async Types.BookingLinkView {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    let link = BookingLinksLib.createLink(state, input);
    BookingLinksLib.toView(link);
  };

  /// Get a single booking link by ID (public, for sharing).
  public query func getBookingLink(linkId : Text) : async ?Types.BookingLinkView {
    switch (BookingLinksLib.getLink(state, linkId)) {
      case null null;
      case (?link) ?BookingLinksLib.toView(link);
    };
  };

  /// List all booking links. Only callable by the host.
  public shared ({ caller }) func listBookingLinks() : async [Types.BookingLinkView] {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingLinksLib.listLinks(state);
  };

  /// Update a booking link's name, description, or duration. Only callable by the host.
  public shared ({ caller }) func updateBookingLink(linkId : Text, input : Types.BookingLinkInput) : async ?Types.BookingLinkView {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingLinksLib.updateLink(state, linkId, input);
  };

  /// Deactivate or reactivate a booking link. Only callable by the host.
  public shared ({ caller }) func setBookingLinkActive(linkId : Text, isActive : Bool) : async Bool {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingLinksLib.setLinkActive(state, linkId, isActive);
  };

  /// Permanently delete a booking link. Only callable by the host.
  public shared ({ caller }) func deleteBookingLink(linkId : Text) : async Bool {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingLinksLib.deleteLink(state, linkId);
  };

  /// Toggle a busy calendar slot as overridden/bookable for a given link.
  public shared ({ caller }) func toggleBusyOverride(linkId : Text, slotStart : Int, slotEnd : Int, isBookable : Bool) : async Bool {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingLinksLib.toggleBusyOverride(state, linkId, slotStart, slotEnd, isBookable);
  };

  /// Get all busy-time overrides for a booking link. Only callable by the host.
  public shared ({ caller }) func getOverridesForLink(linkId : Text) : async [Types.BusyOverride] {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingLinksLib.getOverridesForLink(state, linkId);
  };

  /// Store Google Calendar OAuth credentials in the backend. Only callable by the host.
  public shared ({ caller }) func setGoogleCalendarCredentials(accessToken : Text, refreshToken : Text, expiresAt : Int) : async () {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    let creds : Types.GoogleCredentials = { accessToken; refreshToken; expiresAt };
    BookingLinksLib.setGoogleCredentials(state, caller.toText(), creds);
  };

  /// Check whether Google Calendar credentials are set. Only callable by the host.
  public shared ({ caller }) func hasGoogleCalendarCredentials() : async Bool {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    switch (BookingLinksLib.getGoogleCredentials(state, caller.toText())) {
      case null false;
      case (?_) true;
    };
  };

  /// Return Google Calendar credential status for the caller (hasCredentials, isExpired, expiresAt).
  public shared ({ caller }) func getGoogleCalendarCredentialStatus() : async Types.GoogleCredentialStatus {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    BookingLinksLib.getCredentialStatus(state, caller.toText());
  };

  /// Allow an active user to claim or transfer the host principal.
  public shared ({ caller }) func setHostPrincipal(p : Principal) : async () {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    state.hostPrincipal := p;
  };

  /// Set the Google OAuth client_id used for token refresh. Only callable by active users.
  public shared ({ caller }) func setGoogleOAuthClientId(clientId : Text) : async () {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    state.googleOAuthClientId := clientId;
  };

  /// Get the currently stored Google OAuth client_id. Only callable by active users.
  public shared ({ caller }) func getGoogleOAuthClientId() : async Text {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    state.googleOAuthClientId;
  };

  /// Refresh Google Calendar credentials on-demand for the caller.
  /// Useful when the frontend detects stale credentials.
  public shared ({ caller }) func refreshGoogleCalendarCredentials() : async { #ok : Bool; #err : Text } {
    if (not UsersLib.isActiveUser(usersState, caller)) Runtime.trap("Unauthorized");
    switch (await BookingLinksLib.refreshGoogleToken(state, caller.toText(), transform)) {
      case (#ok(_)) #ok(true);
      case (#err(msg)) #err(msg);
    };
  };
};
