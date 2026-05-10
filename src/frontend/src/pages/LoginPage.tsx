import { useNavigate, useSearch } from "@tanstack/react-router";
import { Calendar, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated, isLoading, login, isLoggingIn, user } = useAuth();
  const navigate = useNavigate();
  // Check if user was bounced back from a protected route
  const search = useSearch({ strict: false }) as { bounced?: string };
  const wasBounced = search?.bounced === "1";

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate({ to: "/host" });
    }
  }, [isAuthenticated, user, navigate]);

  // Signed in but no user record yet — still loading or needs invite
  const showInviteHint = isAuthenticated && !isLoading && !user;

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden"
      data-ocid="login.page"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.195 0.02 248 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.195 0.02 248 / 0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, oklch(0.76 0.165 65 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a
            href="/"
            className="flex items-center gap-2.5 font-display font-semibold text-foreground hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Calendar size={17} className="text-primary-foreground" />
            </div>
            <span className="text-lg tracking-tight">BookSlot</span>
          </a>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your BookSlot dashboard
            </p>
          </div>

          {/* Bounced-back hint */}
          {wasBounced && (
            <div
              className="mb-5 p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary"
              data-ocid="login.bounced_hint"
            >
              You need to be signed in to access that page. Please sign in
              below. If you don't have an account, ask your administrator for an
              invite link.
            </div>
          )}

          {/* Invite hint after auth but no user record */}
          {showInviteHint && (
            <div
              className="mb-5 p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary"
              data-ocid="login.invite_hint"
            >
              You're signed in but your account isn't set up yet. If you
              received an invite link, please open that link to complete
              sign-up. Otherwise, contact your administrator.
            </div>
          )}

          {isLoading ? (
            <div
              className="flex justify-center py-4"
              data-ocid="login.loading_state"
            >
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            !showInviteHint && (
              <button
                type="button"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
                data-ocid="login.signin_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <SignInIcon />
                    Sign in with Internet Identity
                  </>
                )}
              </button>
            )
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Only invited users can access this dashboard.{" "}
            <br className="hidden sm:block" />
            Contact your administrator for access.
          </p>
        </div>

        <p className="text-center mt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BookSlot. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function SignInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
    </svg>
  );
}
