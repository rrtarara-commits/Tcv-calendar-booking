import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  /// Role a user holds within the app.
  public type UserRole = { #admin; #user };

  /// Lifecycle status of a user record.
  public type UserStatus = { #active; #invited };

  /// Persistent user record stored in the registry.
  public type User = {
    email     : Text;
    name      : Text;
    role      : UserRole;
    status    : UserStatus;
    /// Set on first login; null until the invite is accepted.
    principal : ?Principal;
    createdAt : Time.Time;
  };

  /// Shared (API-boundary) view of a user.
  public type UserView = {
    email     : Text;
    name      : Text;
    role      : UserRole;
    status    : UserStatus;
    principal : ?Text;   // Principal serialized as Text
    createdAt : Int;
  };

  /// Input for creating an invite.
  public type InviteInput = {
    email : Text;
    name  : Text;
    role  : UserRole;
  };
};
