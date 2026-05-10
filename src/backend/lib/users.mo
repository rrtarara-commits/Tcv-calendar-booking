import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Types "../types/users";
import Runtime "mo:core/Runtime";

module {
  /// Mutable state for the users domain.
  public type State = {
    /// email -> User
    users : Map.Map<Text, Types.User>;
    /// invite token -> email  (one-time-use tokens)
    inviteTokens : Map.Map<Text, Text>;
    /// principal-text -> email  (set when invite is accepted)
    principalIndex : Map.Map<Text, Text>;
  };

  // ── Conversion ────────────────────────────────────────────────────────────

  /// Convert internal User to shared UserView.
  public func toView(user : Types.User) : Types.UserView {
    {
      email     = user.email;
      name      = user.name;
      role      = user.role;
      status    = user.status;
      principal = switch (user.principal) {
        case null null;
        case (?p) ?p.toText();
      };
      createdAt = user.createdAt;
    };
  };

  // ── Bootstrap ─────────────────────────────────────────────────────────────

  /// Ensure the hardcoded admin record exists (idempotent).
  /// Call once during actor init.
  public func ensureAdminSeed(state : State) {
    let adminEmail = "ray@tcv.studio";
    switch (state.users.get(adminEmail)) {
      case (?_) {}; // already seeded
      case null {
        let admin : Types.User = {
          email     = adminEmail;
          name      = "Ray";
          role      = #admin;
          status    = #active;
          principal = null;
          createdAt = Time.now();
        };
        state.users.add(adminEmail, admin);
      };
    };
  };

  // ── Invite management ─────────────────────────────────────────────────────

  /// Create a user record with status=#invited and store a one-time invite token.
  /// Returns the invite token to embed in the invite link.
  /// Traps if the email is already registered.
  public func createInvite(state : State, input : Types.InviteInput, token : Text) : Text {
    switch (state.users.get(input.email)) {
      case (?_) Runtime.trap("Email already registered");
      case null {};
    };
    let user : Types.User = {
      email     = input.email;
      name      = input.name;
      role      = input.role;
      status    = #invited;
      principal = null;
      createdAt = Time.now();
    };
    state.users.add(input.email, user);
    state.inviteTokens.add(token, input.email);
    token;
  };

  /// Accept an invite: links the Google principal to the user record,
  /// sets status=#active, and invalidates the token.
  /// Returns #ok with the UserView, or #err with a message.
  public func acceptInvite(
    state   : State,
    token   : Text,
    caller  : Principal,
  ) : { #ok : Types.UserView; #err : Text } {
    switch (state.inviteTokens.get(token)) {
      case null { #err("Invalid or expired invite token") };
      case (?email) {
        switch (state.users.get(email)) {
          case null { #err("User record not found") };
          case (?user) {
            let updated : Types.User = { user with
              status    = #active;
              principal = ?caller;
            };
            state.users.add(email, updated);
            state.inviteTokens.remove(token);
            state.principalIndex.add(caller.toText(), email);
            #ok(toView(updated));
          };
        };
      };
    };
  };

  // ── Queries ───────────────────────────────────────────────────────────────

  /// Get a user by their Internet Identity principal. Returns null if not found or not active.
  /// IMPORTANT: This is a pure read — use autoLinkAndGet for first-login auto-linking.
  public func getUserByPrincipal(state : State, p : Principal) : ?Types.UserView {
    switch (state.principalIndex.get(p.toText())) {
      case null null;
      case (?email) {
        switch (state.users.get(email)) {
          case null null;
          case (?user) {
            if (user.status == #active) ?toView(user) else null;
          };
        };
      };
    };
  };

  /// Look up caller by principal. If not found, check if there is exactly one
  /// active admin with a null principal and auto-link the caller to that admin
  /// (first Internet Identity login for the seeded admin account).
  /// Returns the UserView if found/linked, or null if the caller has no account.
  public func autoLinkAndGet(state : State, p : Principal) : ?Types.UserView {
    // Fast path: already in index
    switch (state.principalIndex.get(p.toText())) {
      case (?email) {
        switch (state.users.get(email)) {
          case null null;
          case (?user) {
            if (user.status == #active) ?toView(user) else null;
          };
        };
      };
      case null {
        // Scan for an active admin with no principal assigned yet
        let found = state.users.entries().find(
          func((_, u)) {
            u.role == #admin and u.status == #active and u.principal == null
          }
        );
        switch (found) {
          case null null; // no unlinked admin — caller has no account
          case (?(email, user)) {
            // Auto-link: bind this Internet Identity principal to the admin record
            let updated : Types.User = { user with principal = ?p };
            state.users.add(email, updated);
            state.principalIndex.add(p.toText(), email);
            ?toView(updated);
          };
        };
      };
    };
  };

  /// List all users (admin view).
  public func listUsers(state : State) : [Types.UserView] {
    state.users.values().map<Types.User, Types.UserView>(toView).toArray();
  };

  // ── Mutations (admin-only, guards done in mixin) ──────────────────────────

  /// Remove a user by email. Returns false if not found.
  public func removeUser(state : State, email : Text) : Bool {
    switch (state.users.get(email)) {
      case null false;
      case (?user) {
        state.users.remove(email);
        // Remove from principalIndex if principal is set
        switch (user.principal) {
          case null {};
          case (?p) state.principalIndex.remove(p.toText());
        };
        true;
      };
    };
  };

  /// Change a user's role. Returns false if not found.
  public func changeRole(state : State, email : Text, role : Types.UserRole) : Bool {
    switch (state.users.get(email)) {
      case null false;
      case (?user) {
        state.users.add(email, { user with role });
        true;
      };
    };
  };

  // ── Auth guard helpers ────────────────────────────────────────────────────

  /// Returns true if the principal belongs to an active user with #admin role.
  public func isAdmin(state : State, p : Principal) : Bool {
    // First check hardcoded admin email via principalIndex
    let emailOpt = switch (state.principalIndex.get(p.toText())) {
      case (?email) ?email;
      case null {
        // Fall back to scanning for principal match (covers admin seed with null principal initially)
        switch (state.users.entries().find(func((_, u)) { u.principal == ?p })) {
          case (?(email, _)) ?email;
          case null null;
        };
      };
    };
    switch (emailOpt) {
      case null false;
      case (?email) {
        switch (state.users.get(email)) {
          case null false;
          case (?user) user.role == #admin and user.status == #active;
        };
      };
    };
  };

  /// Returns true if the principal belongs to any active user (admin or user).
  public func isActiveUser(state : State, p : Principal) : Bool {
    let emailOpt = switch (state.principalIndex.get(p.toText())) {
      case (?email) ?email;
      case null {
        switch (state.users.entries().find(func((_, u)) { u.principal == ?p })) {
          case (?(email, _)) ?email;
          case null null;
        };
      };
    };
    switch (emailOpt) {
      case null false;
      case (?email) {
        switch (state.users.get(email)) {
          case null false;
          case (?user) user.status == #active;
        };
      };
    };
  };
};
