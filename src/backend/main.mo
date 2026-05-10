import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import LinkTypes "types/booking-links";
import BookingTypes "types/bookings";
import BookingLinksLib "lib/booking-links";
import BookingsLib "lib/bookings";
import BookingLinksApi "mixins/booking-links-api";
import BookingsApi "mixins/bookings-api";
import UserTypes "types/users";
import UsersLib "lib/users";
import UsersApi "mixins/users-api";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Runtime "mo:core/Runtime";
import Migration "migration";


(with migration = Migration.run)
actor {
  // ── App base URL (set by host after deployment) ───────────────────────────
  var appBaseUrl : Text = "";

  /// Set the base URL used in management links sent to clients.
  public shared ({ caller }) func setAppBaseUrl(url : Text) : async () {
    if (not UsersLib.isAdmin(usersState, caller) and not caller.isController()) {
      Runtime.trap("Unauthorized");
    };
    appBaseUrl := url;
  };

  /// Get the current app base URL (for debugging).
  public query func getAppBaseUrl() : async Text { appBaseUrl };
  // ── Authorization state ──────────────────────────────────────────────────
  let accessControlState : AccessControl.AccessControlState = AccessControl.initState();

  // ── Users domain state ──────────────────────────────────────────────────────
  let usersState : UsersLib.State = {
    users = Map.empty<Text, UserTypes.User>();
    inviteTokens = Map.empty<Text, Text>();
    principalIndex = Map.empty<Text, Text>();
  };

  // ── Booking-links domain state ────────────────────────────────────────────
  // hostPrincipal lives inside this state so all mixins always read the live value.
  let bookingLinksState : BookingLinksLib.State = {
    links = Map.empty<Text, LinkTypes.BookingLink>();
    overrides = Map.empty<Text, Set.Set<Int>>();
    overrideDetails = Map.empty<Text, LinkTypes.BusyOverride>();
    googleCreds = Map.empty<Text, LinkTypes.GoogleCredentials>();
    var nextId = 0;
    var hostPrincipal = Principal.anonymous();
    var googleOAuthClientId = "";
  };

  // ── Bookings domain state ─────────────────────────────────────────────────
  let bookingsState : BookingsLib.State = {
    bookings = Map.empty<Text, BookingTypes.Booking>();
    tokenIndex = Map.empty<Text, Text>();
    var nextId = 0;
  };

  // ── HTTP outcalls transform (required by caffeineai-http-outcalls) ─────────
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Authorization infrastructure ──────────────────────────────────────────
  include MixinAuthorization(accessControlState);
  // ── Object storage infrastructure ─────────────────────────────────────────
  include MixinObjectStorage();
  // ── Users API ─────────────────────────────────────────────────────────────
  include UsersApi(usersState);

  // ── Seed admin on first deploy ────────────────────────────────────────────
  UsersLib.ensureAdminSeed(usersState);
  // ── Booking links API ─────────────────────────────────────────────────────
  include BookingLinksApi(bookingLinksState, usersState, transform);

  // ── Bookings API ──────────────────────────────────────────────────────────
  include BookingsApi(bookingsState, bookingLinksState, usersState, transform);
};
