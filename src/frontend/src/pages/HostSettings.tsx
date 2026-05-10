import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ClipboardCopy,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createActor } from "../backend";
import { UserRole, UserStatus } from "../backend";
import type { UserView } from "../backend";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { useHasGoogleCalendarCredentials } from "../hooks/useAvailableSlots";
import {
  getGoogleClientId,
  initiateGoogleOAuth,
  setGoogleClientId,
  useAutoRefreshGoogleCalendar,
  useDisconnectGoogleCalendar,
  useGoogleCalendarCredentialStatus,
  useRefreshGoogleCalendarTokens,
} from "../hooks/useGoogleCalendar";
import {
  useInviteUser,
  useIsAdmin,
  useListUsers,
  useRemoveUser,
} from "../hooks/useUsers";
import { cn } from "../lib/utils";

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-5 mb-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

type Tab = "general" | "team";

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
        role === UserRole.admin
          ? "bg-primary/20 text-primary border border-primary/30"
          : "bg-muted/60 text-muted-foreground border border-border",
      )}
    >
      {role === UserRole.admin ? "Admin" : "User"}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
        status === UserStatus.active
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
          : "bg-amber-500/15 text-amber-400 border border-amber-500/25",
      )}
    >
      {status === UserStatus.active ? "Active" : "Invited"}
    </span>
  );
}

function InviteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    email: "",
    name: "",
    role: UserRole.user,
  });
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inviteUser = useInviteUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await inviteUser.mutateAsync({
        email: form.email,
        name: form.name,
        role: form.role,
      });
      setInviteToken(token);
    } catch (_err) {
      // error shown via inviteUser.error
    }
  };

  const inviteUrl = inviteToken
    ? `${window.location.origin}/accept-invite/${inviteToken}`
    : null;

  const handleCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setForm({ email: "", name: "", role: UserRole.user });
    setInviteToken(null);
    setCopied(false);
    inviteUser.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="team.invite_dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground font-display text-base">
            Invite Team Member
          </DialogTitle>
        </DialogHeader>

        {!inviteToken ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Full Name
              </Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Smith"
                className="text-sm bg-input border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                data-ocid="team.invite_name_input"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Email Address
              </Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@company.com"
                className="text-sm bg-input border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                data-ocid="team.invite_email_input"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Role
              </Label>
              <div className="flex gap-2" data-ocid="team.invite_role_select">
                {([UserRole.user, UserRole.admin] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={cn(
                      "flex-1 py-1.5 rounded-md text-sm font-medium border transition-colors",
                      form.role === r
                        ? "bg-primary/15 text-primary border-primary/40"
                        : "bg-muted/30 text-muted-foreground border-border hover:border-primary/30",
                    )}
                  >
                    {r === UserRole.admin ? "Admin" : "User"}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {form.role === UserRole.admin
                  ? "Full access including user management."
                  : "Can view bookings and manage booking links."}
              </p>
            </div>

            {inviteUser.error && (
              <p
                className="text-xs text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2"
                data-ocid="team.invite_error_state"
              >
                {inviteUser.error.message}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                disabled={inviteUser.isPending}
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                data-ocid="team.invite_submit_button"
              >
                {inviteUser.isPending && (
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                )}
                Send Invite
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="border-border text-muted-foreground hover:text-foreground"
                data-ocid="team.invite_cancel_button"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 size={16} />
              <p className="text-sm font-medium">Invite created!</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Share this invite link
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={inviteUrl ?? ""}
                  className="text-xs bg-muted/30 border-border text-foreground/80 font-mono"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopy}
                  className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="team.copy_invite_link_button"
                >
                  {copied ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <ClipboardCopy size={13} />
                  )}
                </Button>
              </div>
              {copied && (
                <p
                  className="text-[11px] text-primary mt-1"
                  data-ocid="team.invite_success_state"
                >
                  Copied to clipboard!
                </p>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleClose}
              variant="outline"
              className="w-full border-border text-muted-foreground hover:text-foreground"
              data-ocid="team.invite_close_button"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TeamSection() {
  const { data: users, isLoading } = useListUsers();
  const removeUser = useRemoveUser();
  const reinvite = useInviteUser();
  const [showInvite, setShowInvite] = useState(false);
  const [reinvitedEmail, setReinvitedEmail] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const handleResendInvite = async (user: UserView) => {
    try {
      await reinvite.mutateAsync({
        email: user.email,
        name: user.name,
        role: user.role,
      });
      setReinvitedEmail(user.email);
      setTimeout(() => setReinvitedEmail(null), 2500);
    } catch (_err) {
      // ignore
    }
  };

  const handleRemove = async (email: string) => {
    if (confirmRemove !== email) {
      setConfirmRemove(email);
      return;
    }
    await removeUser.mutateAsync(email);
    setConfirmRemove(null);
  };

  return (
    <div data-ocid="team.section">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
            <Users size={15} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Team Members
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage who can access BookSlot.
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setShowInvite(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
          data-ocid="team.invite_open_modal_button"
        >
          <UserPlus size={13} />
          Invite
        </Button>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-10"
          data-ocid="team.loading_state"
        >
          <Loader2 size={20} className="animate-spin text-primary" />
        </div>
      ) : !users || users.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 py-10 text-center"
          data-ocid="team.empty_state"
        >
          <Users size={28} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No team members yet.</p>
          <p className="text-xs text-muted-foreground/70">
            Invite someone to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user: UserView, idx: number) => (
            <div
              key={user.email}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
              data-ocid={`team.item.${idx + 1}`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {user.status === UserStatus.invited && (
                  <button
                    type="button"
                    title={
                      reinvitedEmail === user.email
                        ? "Invite resent!"
                        : "Resend invite"
                    }
                    onClick={() => handleResendInvite(user)}
                    disabled={reinvite.isPending}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                      reinvitedEmail === user.email
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                    )}
                    data-ocid={`team.resend_invite_button.${idx + 1}`}
                  >
                    {reinvitedEmail === user.email ? (
                      <CheckCircle2 size={12} className="text-primary" />
                    ) : (
                      <UserPlus size={12} />
                    )}
                    {reinvitedEmail === user.email ? "Sent" : "Resend"}
                  </button>
                )}
                <button
                  type="button"
                  title={
                    confirmRemove === user.email
                      ? "Confirm remove"
                      : "Remove user"
                  }
                  onClick={() => handleRemove(user.email)}
                  disabled={removeUser.isPending}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    confirmRemove === user.email
                      ? "text-destructive bg-destructive/15 hover:bg-destructive/25"
                      : "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                  )}
                  data-ocid={`team.delete_button.${idx + 1}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmRemove && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/25">
          <p className="text-xs text-destructive flex-1">
            Remove <strong>{confirmRemove}</strong>? This cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => setConfirmRemove(null)}
            className="text-xs text-muted-foreground hover:text-foreground px-2"
            data-ocid="team.remove_cancel_button"
          >
            Cancel
          </button>
        </div>
      )}

      <InviteModal open={showInvite} onClose={() => setShowInvite(false)} />
    </div>
  );
}

export default function HostSettings() {
  const { actor } = useActor(createActor);
  const { principal } = useAuth();
  const {
    data: hasCredentials,
    isLoading: credLoading,
    refetch,
  } = useHasGoogleCalendarCredentials();
  const { data: credStatus } = useGoogleCalendarCredentialStatus();
  const { data: isAdmin } = useIsAdmin();
  const { disconnect, isDisconnecting } = useDisconnectGoogleCalendar();
  const { refresh: manualRefresh, isRefreshing } =
    useRefreshGoogleCalendarTokens();

  // Activate auto-refresh while settings page is open
  useAutoRefreshGoogleCalendar();

  const [activeTab, setActiveTab] = useState<Tab>("general");

  // Google OAuth Client ID state (stored in localStorage)
  const [clientId, setClientIdState] = useState(() => getGoogleClientId());
  const [clientIdSaved, setClientIdSaved] = useState(false);
  const [showClientId, setShowClientId] = useState(false);
  const [initiating, setInitiating] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Success flash from callback redirect
  const [calConnectedFlash, setCalConnectedFlash] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cal") === "connected") {
      setCalConnectedFlash(true);
      refetch();
      // Clean up URL
      window.history.replaceState({}, "", "/host/settings");
      setTimeout(() => setCalConnectedFlash(false), 5000);
    }
  }, [refetch]);

  const handleSaveClientId = () => {
    setGoogleClientId(clientId.trim());
    setClientIdSaved(true);
    setTimeout(() => setClientIdSaved(false), 2500);
  };

  const handleConnect = async () => {
    const id = clientId.trim();
    if (!id) {
      setOauthError("Please enter and save your Google OAuth Client ID first.");
      return;
    }
    setInitiating(true);
    setOauthError(null);
    try {
      await initiateGoogleOAuth(id);
    } catch (err) {
      setOauthError(
        err instanceof Error ? err.message : "Failed to start OAuth flow.",
      );
      setInitiating(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    await refetch();
  };

  const handleManualRefresh = async () => {
    await manualRefresh();
    await refetch();
  };

  const [settingPrincipal, setSettingPrincipal] = useState(false);
  const [principalSaved, setPrincipalSaved] = useState(false);

  const handleSetPrincipal = async () => {
    if (!actor || !principal) return;
    setSettingPrincipal(true);
    try {
      await actor.setHostPrincipal(principal);
      setPrincipalSaved(true);
      setTimeout(() => setPrincipalSaved(false), 4000);
    } finally {
      setSettingPrincipal(false);
    }
  };

  // Compute human-readable expiry label
  const expiryLabel = (() => {
    if (!credStatus?.expiresAt) return null;
    const expiresAtMs = Number(credStatus.expiresAt / 1_000_000n);
    const diffMs = expiresAtMs - Date.now();
    if (diffMs <= 0) return "Expired";
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 60)
      return `Expires in ${diffMin} minute${diffMin !== 1 ? "s" : ""}`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24)
      return `Expires in ${diffHr} hour${diffHr !== 1 ? "s" : ""}`;
    const at = new Date(expiresAtMs);
    return `Expires ${at.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at ${at.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
  })();

  const isTokenExpired = credStatus?.isExpired ?? false;
  const canRefresh = !!(
    getGoogleClientId() && localStorage.getItem("bookslot_google_refresh_token")
  );

  const tabs: { id: Tab; label: string; adminOnly?: boolean }[] = [
    { id: "general", label: "General" },
    { id: "team", label: "Team", adminOnly: true },
  ];

  return (
    <div
      className="max-w-2xl mx-auto px-4 md:px-6 py-8"
      data-ocid="settings.page"
    >
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your host identity, calendar integration, and team.
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-0.5 p-1 bg-muted/30 border border-border rounded-lg mb-6"
        data-ocid="settings.tab"
      >
        {tabs
          .filter((t) => !t.adminOnly || isAdmin)
          .map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`settings.${tab.id}_tab`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {activeTab === "general" && (
        <>
          {/* Host Identity */}
          <SectionCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                <ShieldCheck size={15} className="text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Host Identity
                </h2>
                <p className="text-xs text-muted-foreground">
                  Register your Internet Identity principal as the host.
                </p>
              </div>
            </div>

            {principal && (
              <div className="bg-muted/30 border border-border rounded-lg px-3 py-2.5 mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  Your Principal
                </p>
                <p
                  className="text-xs font-mono text-foreground/90 break-all"
                  data-ocid="settings.principal_display"
                >
                  {principal.toText()}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handleSetPrincipal}
                disabled={settingPrincipal || !principal}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                data-ocid="settings.set_principal_button"
              >
                {settingPrincipal && (
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                )}
                Set as Host Principal
              </Button>
              {principalSaved && (
                <span
                  className="flex items-center gap-1 text-xs text-primary font-medium"
                  data-ocid="settings.principal_success_state"
                >
                  <CheckCircle2 size={13} />
                  Saved!
                </span>
              )}
            </div>
          </SectionCard>

          {/* Google Calendar */}
          <SectionCard>
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                  <Calendar size={15} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Google Calendar
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Connect your calendar so clients see your real availability.
                  </p>
                </div>
              </div>
              {!credLoading && (
                <span
                  className={cn(
                    "text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1.5",
                    hasCredentials
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : "bg-muted/50 text-muted-foreground border-border",
                  )}
                >
                  {hasCredentials ? (
                    <>
                      <Wifi size={10} /> Connected
                    </>
                  ) : (
                    <>
                      <WifiOff size={10} /> Not connected
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Expired token warning banner */}
            {!credLoading && isTokenExpired && (
              <div
                className="flex items-start gap-3 px-3 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4"
                data-ocid="settings.cal_expired_warning"
              >
                <AlertTriangle
                  size={14}
                  className="text-amber-400 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-400">
                    Google Calendar connection has expired
                  </p>
                  <p className="text-xs text-amber-400/80 mt-0.5">
                    Click Reconnect to restore availability syncing.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConnect}
                  disabled={initiating}
                  className="shrink-0 bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-40 text-xs"
                  data-ocid="settings.reconnect_expired_button"
                >
                  {initiating ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    "Reconnect"
                  )}
                </Button>
              </div>
            )}

            {/* Success flash */}
            {calConnectedFlash && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 mb-4"
                data-ocid="settings.cal_connected_success_state"
              >
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-400 font-medium">
                  Google Calendar connected successfully!
                </p>
              </div>
            )}

            {/* Connection status block */}
            {!credLoading && hasCredentials ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Calendar connected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {expiryLabel ??
                        "Your availability is synced with Google Calendar."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canRefresh && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 gap-1.5"
                      data-ocid="settings.refresh_connection_button"
                    >
                      <RefreshCw
                        size={12}
                        className={isRefreshing ? "animate-spin" : ""}
                      />
                      {isRefreshing ? "Refreshing…" : "Refresh connection"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 disabled:opacity-40"
                    data-ocid="settings.disconnect_calendar_button"
                  >
                    {isDisconnecting && (
                      <Loader2 size={12} className="animate-spin mr-1.5" />
                    )}
                    Disconnect Calendar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Client ID field */}
                <div>
                  <Label
                    htmlFor="google-client-id"
                    className="text-xs mb-1.5 block text-muted-foreground"
                  >
                    Google OAuth Client ID
                    <span className="ml-1 text-muted-foreground/50 font-normal">
                      (from Google Cloud Console)
                    </span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="google-client-id"
                        type={showClientId ? "text" : "password"}
                        value={clientId}
                        onChange={(e) => setClientIdState(e.target.value)}
                        placeholder="123456789-xxxx.apps.googleusercontent.com"
                        className="text-sm bg-input border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground pr-9"
                        data-ocid="settings.google_client_id_input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowClientId((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showClientId ? "Hide client ID" : "Show client ID"
                        }
                      >
                        {showClientId ? (
                          <EyeOff size={13} />
                        ) : (
                          <Eye size={13} />
                        )}
                      </button>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveClientId}
                      disabled={!clientId.trim()}
                      className="shrink-0 bg-muted/50 text-foreground hover:bg-muted/80 border border-border disabled:opacity-40"
                      data-ocid="settings.save_client_id_button"
                    >
                      {clientIdSaved ? (
                        <CheckCircle2 size={13} className="text-primary" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Link2 size={10} className="shrink-0" />
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Create OAuth 2.0 credentials
                    </a>{" "}
                    in Google Cloud Console. Set the redirect URI to:{" "}
                    <code className="text-foreground/70 font-mono text-[10px]">
                      {window.location.origin}/host/google-callback
                    </code>
                  </p>
                </div>

                {oauthError && (
                  <p
                    className="text-xs text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2.5"
                    data-ocid="settings.oauth_error_state"
                  >
                    {oauthError}
                  </p>
                )}

                <Button
                  type="button"
                  size="sm"
                  onClick={handleConnect}
                  disabled={initiating || !clientId.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 gap-1.5"
                  data-ocid="settings.connect_calendar_button"
                >
                  {initiating ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Calendar size={13} />
                  )}
                  Connect Google Calendar
                </Button>
              </div>
            )}
          </SectionCard>
        </>
      )}

      {activeTab === "team" &&
        (isAdmin ? (
          <SectionCard>
            <TeamSection />
          </SectionCard>
        ) : (
          <SectionCard>
            <div
              className="flex flex-col items-center gap-2 py-8 text-center"
              data-ocid="team.no_access_state"
            >
              <ShieldCheck size={28} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Only admins can manage team members.
              </p>
            </div>
          </SectionCard>
        ))}
    </div>
  );
}
