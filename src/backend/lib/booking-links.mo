import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/booking-links";

module {
  public type State = {
    links : Map.Map<Text, Types.BookingLink>;
    overrides : Map.Map<Text, Set.Set<Int>>;        // linkId -> set of overridden slot starts
    overrideDetails : Map.Map<Text, Types.BusyOverride>; // compositeKey -> override
    googleCreds : Map.Map<Text, Types.GoogleCredentials>; // hostPrincipal -> creds
    var nextId : Nat;
    var hostPrincipal : Principal;
    var googleOAuthClientId : Text; // Google OAuth client_id for token refresh
  };

  /// Build a composite key for an override entry: "<linkId>:<slotStart>"
  func overrideKey(linkId : Text, slotStart : Int) : Text {
    linkId # ":" # slotStart.toText();
  };

  /// Generate a unique booking link ID using the current counter.
  public func generateId(state : State) : Text {
    let id = state.nextId;
    state.nextId += 1;
    "link-" # id.toText();
  };

  /// Create a new booking link and store it.
  public func createLink(state : State, input : Types.BookingLinkInput) : Types.BookingLink {
    let id = generateId(state);
    let now = Time.now();
    let link : Types.BookingLink = {
      id;
      name = input.name;
      description = input.description;
      duration = input.duration;
      isActive = true;
      createdAt = now;
      updatedAt = now;
    };
    state.links.add(id, link);
    link;
  };

  /// Retrieve a booking link by ID.
  public func getLink(state : State, linkId : Text) : ?Types.BookingLink {
    state.links.get(linkId);
  };

  /// List all booking links as shared views.
  public func listLinks(state : State) : [Types.BookingLinkView] {
    let views = List.empty<Types.BookingLinkView>();
    state.links.forEach(func(_k, link) {
      views.add(toView(link));
    });
    views.toArray();
  };

  /// Update a booking link's name, description, or duration.
  public func updateLink(state : State, linkId : Text, input : Types.BookingLinkInput) : ?Types.BookingLinkView {
    switch (state.links.get(linkId)) {
      case null null;
      case (?existing) {
        let updated : Types.BookingLink = {
          existing with
          name = input.name;
          description = input.description;
          duration = input.duration;
          updatedAt = Time.now();
        };
        state.links.add(linkId, updated);
        ?toView(updated);
      };
    };
  };

  /// Set a booking link's active status. Returns false if the link is not found.
  public func setLinkActive(state : State, linkId : Text, isActive : Bool) : Bool {
    switch (state.links.get(linkId)) {
      case null false;
      case (?existing) {
        let updated : Types.BookingLink = {
          existing with
          isActive;
          updatedAt = Time.now();
        };
        state.links.add(linkId, updated);
        true;
      };
    };
  };

  /// Delete a booking link and its overrides by ID. Returns false if not found.
  public func deleteLink(state : State, linkId : Text) : Bool {
    if (state.links.get(linkId) == null) {
      return false;
    };
    state.links.remove(linkId);
    // Clean up overrides for this link
    switch (state.overrides.get(linkId)) {
      case null {};
      case (?slotSet) {
        slotSet.forEach(func(slotStart) {
          state.overrideDetails.remove(overrideKey(linkId, slotStart));
        });
      };
    };
    state.overrides.remove(linkId);
    true;
  };

  /// Toggle a busy calendar slot as overridden/bookable for a given link.
  /// Returns false if the booking link doesn't exist.
  public func toggleBusyOverride(state : State, linkId : Text, slotStart : Int, slotEnd : Int, isBookable : Bool) : Bool {
    if (state.links.get(linkId) == null) {
      return false;
    };
    let key = overrideKey(linkId, slotStart);
    let override : Types.BusyOverride = { linkId; slotStart; slotEnd; isBookable };
    state.overrideDetails.add(key, override);
    // Track the slot start in the per-link set
    switch (state.overrides.get(linkId)) {
      case null {
        let slotSet = Set.empty<Int>();
        slotSet.add(slotStart);
        state.overrides.add(linkId, slotSet);
      };
      case (?slotSet) {
        slotSet.add(slotStart);
      };
    };
    true;
  };

  /// Get all busy-time overrides for a given booking link.
  public func getOverridesForLink(state : State, linkId : Text) : [Types.BusyOverride] {
    switch (state.overrides.get(linkId)) {
      case null [];
      case (?slotSet) {
        let results = List.empty<Types.BusyOverride>();
        slotSet.forEach(func(slotStart) {
          let key = overrideKey(linkId, slotStart);
          switch (state.overrideDetails.get(key)) {
            case null {};
            case (?ov) { results.add(ov) };
          };
        });
        results.toArray();
      };
    };
  };

  /// Store or update Google Calendar OAuth credentials for the host.
  public func setGoogleCredentials(state : State, hostKey : Text, creds : Types.GoogleCredentials) : () {
    state.googleCreds.add(hostKey, creds);
  };

  /// Retrieve stored Google Calendar OAuth credentials.
  public func getGoogleCredentials(state : State, hostKey : Text) : ?Types.GoogleCredentials {
    state.googleCreds.get(hostKey);
  };

  /// Refresh Google Calendar access token using the stored refresh_token.
  /// Makes an HTTP outcall to Google's token endpoint, updates stored credentials,
  /// and returns the new access_token or an error message.
  public func refreshGoogleToken(state : State, hostKey : Text, transform : OutCall.Transform) : async { #ok : Text; #err : Text } {
    if (state.googleOAuthClientId == "") {
      return #err("Google OAuth client_id not configured");
    };
    let creds = switch (state.googleCreds.get(hostKey)) {
      case null { return #err("No Google credentials found — please reconnect Google Calendar") };
      case (?c) c;
    };
    if (creds.refreshToken == "") {
      return #err("No refresh token stored — please reconnect Google Calendar");
    };

    let url = "https://oauth2.googleapis.com/token";
    let body = "client_id=" # state.googleOAuthClientId
      # "&refresh_token=" # creds.refreshToken
      # "&grant_type=refresh_token";
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
    ];

    let responseJson = try {
      await OutCall.httpPostRequest(url, headers, body, transform);
    } catch (_) {
      return #err("Token refresh HTTP call failed");
    };

    // Extract access_token from JSON response
    // Expected: {"access_token":"...","expires_in":3600,...}
    let accessToken = switch (extractJsonString(responseJson, "access_token")) {
      case null { return #err("Token refresh failed: " # responseJson) };
      case (?t) t;
    };

    // Extract expires_in (seconds) and compute new expiresAt in nanoseconds
    let expiresInSec : Int = switch (extractJsonInt(responseJson, "expires_in")) {
      case null 3600; // default 1 hour if not present
      case (?n) n;
    };
    let newExpiresAt : Int = Time.now() + expiresInSec * 1_000_000_000;

    // Update stored credentials, preserving the refresh_token
    let updatedCreds : Types.GoogleCredentials = {
      accessToken;
      refreshToken = creds.refreshToken;
      expiresAt = newExpiresAt;
    };
    state.googleCreds.add(hostKey, updatedCreds);
    #ok(accessToken);
  };

  /// Simple JSON string field extractor — finds "key":"value" in JSON text.
  func extractJsonString(json : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\":\"";
    switch (findSubstring(json, needle)) {
      case null null;
      case (?startIdx) {
        let afterQuote = startIdx + needle.size();
        let rest = textDrop(json, afterQuote);
        switch (findSubstring(rest, "\"")) {
          case null null;
          case (?endIdx) ?
            textSlice(rest, 0, endIdx);
        };
      };
    };
  };

  /// Simple JSON integer field extractor — finds "key":number in JSON text.
  func extractJsonInt(json : Text, key : Text) : ?Int {
    let needle = "\"" # key # "\":";
    switch (findSubstring(json, needle)) {
      case null null;
      case (?startIdx) {
        let afterColon = startIdx + needle.size();
        let rest = textDrop(json, afterColon);
        // read digits until non-digit
        var i = 0;
        var digits = "";
        let chars = rest.chars();
        label digits_loop for (c in chars) {
          if (c >= '0' and c <= '9') {
            digits := digits # (c.toText());
            i += 1;
          } else {
            break digits_loop;
          };
        };
        if (digits == "") null
        else ?(textToIntUnsafe(digits));
      };
    };
  };

  /// Returns the index of the first occurrence of needle in haystack, or null.
  func findSubstring(haystack : Text, needle : Text) : ?Nat {
    let hLen = haystack.size();
    let nLen = needle.size();
    if (nLen == 0) { return ?0 };
    if (nLen > hLen) { return null };
    var i = 0;
    while (i + nLen <= hLen) {
      if (textSlice(haystack, i, i + nLen) == needle) {
        return ?i;
      };
      i += 1;
    };
    null;
  };

  /// Drop the first n characters of t.
  func textDrop(t : Text, n : Nat) : Text {
    textSlice(t, n, t.size());
  };

  /// Extract a substring from position start (inclusive) to end (exclusive).
  func textSlice(t : Text, start : Nat, end_ : Nat) : Text {
    var result = "";
    var i = 0;
    for (c in t.chars()) {
      if (i >= start and i < end_) {
        result := result # (c.toText());
      };
      i += 1;
    };
    result;
  };

  /// Parse a non-negative integer from a digit-only string (no bounds check).
  func textToIntUnsafe(s : Text) : Int {
    var n : Int = 0;
    for (c in s.chars()) {
      let digit : Int = switch (c) {
        case '0' 0; case '1' 1; case '2' 2; case '3' 3; case '4' 4;
        case '5' 5; case '6' 6; case '7' 7; case '8' 8; case '9' 9;
        case _ 0;
      };
      n := n * 10 + digit;
    };
    n;
  };

  /// Return the credential status for a host: whether creds exist and whether they are expired.
  public func getCredentialStatus(state : State, hostKey : Text) : Types.GoogleCredentialStatus {
    switch (state.googleCreds.get(hostKey)) {
      case null { { hasCredentials = false; isExpired = false; expiresAt = null } };
      case (?creds) {
        let now = Time.now();
        { hasCredentials = true; isExpired = creds.expiresAt < now; expiresAt = ?creds.expiresAt };
      };
    };
  };

  /// Convert internal BookingLink to shared BookingLinkView.
  public func toView(link : Types.BookingLink) : Types.BookingLinkView {
    {
      id = link.id;
      name = link.name;
      description = link.description;
      duration = link.duration;
      isActive = link.isActive;
      createdAt = link.createdAt;
      updatedAt = link.updatedAt;
    };
  };
};
