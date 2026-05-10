import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Random "mo:core/Random";
import InviteLinks "mo:caffeineai-invite-links/invite-links-module";
import EmailClient "mo:caffeineai-email/emailClient";
import UsersLib "../lib/users";
import Types "../types/users";

mixin (usersState : UsersLib.State) {

  var _appBaseUrl : Text = "";

  public shared ({ caller }) func setUsersAppBaseUrl(url : Text) : async () {
    if (not UsersLib.isAdmin(usersState, caller)) Runtime.trap("Unauthorized");
    _appBaseUrl := url;
  };

  func getJoinLink(token : Text) : Text {
    _appBaseUrl # "/#/accept-invite/" # token;
  };

  func generateToken() : async Text {
    let blob = await Random.blob();
    InviteLinks.generateUUID(blob);
  };

  // ── Admin: invite a new user ───────────────────────────────────────────────

  /// Create an invite for an email address. Admin-only.
  /// Returns the invite token to be embedded in the invite URL.
  public shared ({ caller }) func inviteUser(input : Types.InviteInput) : async Text {
    if (not UsersLib.isAdmin(usersState, caller)) Runtime.trap("Unauthorized");
    let token = await generateToken();
    let _ = UsersLib.createInvite(usersState, input, token);
    let joinLink = getJoinLink(token);
    let htmlBody = "<p>You have been invited to BookSlot.</p><p><a href='" # joinLink # "'>Click here to accept your invitation</a></p><p>Or copy this link: " # joinLink # "</p>";
    let _ = await EmailClient.sendServiceEmail(
      "bookslot",
      [input.email],
      "You have been invited to BookSlot",
      htmlBody,
    );
    token;
  };

  // ── Admin: list users ─────────────────────────────────────────────────────

  /// List all registered users. Admin-only.
  public shared ({ caller }) func listUsers() : async [Types.UserView] {
    if (not UsersLib.isAdmin(usersState, caller)) Runtime.trap("Unauthorized");
    UsersLib.listUsers(usersState);
  };

  // ── Admin: remove user ────────────────────────────────────────────────────

  /// Remove a user by email. Admin-only.
  public shared ({ caller }) func removeUser(email : Text) : async Bool {
    if (not UsersLib.isAdmin(usersState, caller)) Runtime.trap("Unauthorized");
    UsersLib.removeUser(usersState, email);
  };

  // ── Admin: change role ────────────────────────────────────────────────────

  /// Change a user's role (admin <-> user). Admin-only.
  public shared ({ caller }) func changeUserRole(email : Text, role : Types.UserRole) : async Bool {
    if (not UsersLib.isAdmin(usersState, caller)) Runtime.trap("Unauthorized");
    UsersLib.changeRole(usersState, email, role);
  };

  // ── Public: accept an invite ──────────────────────────────────────────────

  /// Called by the invited user on first login to claim the invite.
  /// Links the caller's Internet Identity principal to the user record.
  public shared ({ caller }) func acceptInvite(token : Text) : async { #ok : Types.UserView; #err : Text } {
    UsersLib.acceptInvite(usersState, token, caller);
  };

  // ── Public: current user info ─────────────────────────────────────────────

  /// Return the calling user's info, auto-linking the seeded admin on first login.
  /// Uses an update call (not query) so it can write the principal link on first access.
  public shared ({ caller }) func getMyUserInfo() : async ?Types.UserView {
    UsersLib.autoLinkAndGet(usersState, caller);
  };
};
