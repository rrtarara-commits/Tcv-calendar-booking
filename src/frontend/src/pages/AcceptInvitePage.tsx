import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Calendar, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import { useAuth } from "../hooks/useAuth";

export default function AcceptInvitePage() {
  const { token } = useParams({ from: "/accept-invite/$token" });
  const { isAuthenticated, isLoading, login, isLoggingIn } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "idle" | "accepting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const hasAccepted = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || isFetching || !actor || hasAccepted.current) return;
    hasAccepted.current = true;
    setStatus("accepting");
    actor
      .acceptInvite(token)
      .then((result) => {
        if (result.__kind__ === "ok") {
          setStatus("success");
          // Redirect after brief success display
          setTimeout(() => navigate({ to: "/host" }), 1800);
        } else if (result.__kind__ === "err") {
          setStatus("error");
          setErrorMessage(result.err || "Invalid or expired invite link.");
        }
      })
      .catch((err: unknown) => {
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Failed to accept invite. Please try again or contact your administrator.",
        );
      });
  }, [isAuthenticated, isFetching, actor, token, navigate]);

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden"
      data-ocid="accept-invite.page"
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

        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          {/* Not logged in: show login prompt */}
          {!isAuthenticated && !isLoading && (
            <div className="text-center" data-ocid="accept-invite.login_prompt">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <Calendar size={24} className="text-primary" />
              </div>
              <h1 className="font-display text-xl font-semibold text-foreground mb-2">
                Accept your invitation
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                You've been invited to BookSlot. Sign in to activate your
                account and get started.
              </p>
              <button
                type="button"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                data-ocid="accept-invite.signin_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in to accept invite"
                )}
              </button>
            </div>
          )}

          {/* Loading / initializing */}
          {(isLoading || status === "accepting") && (
            <div
              className="text-center py-4"
              data-ocid="accept-invite.loading_state"
            >
              <Loader2
                size={28}
                className="animate-spin text-primary mx-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Loading your session…"
                  : "Activating your account…"}
              </p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div
              className="text-center"
              data-ocid="accept-invite.success_state"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={28} className="text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Welcome to BookSlot!
              </h2>
              <p className="text-sm text-muted-foreground">
                Your account is active. Redirecting to your dashboard…
              </p>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="text-center" data-ocid="accept-invite.error_state">
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
                <XCircle size={28} className="text-destructive" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Invite not accepted
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {errorMessage}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    hasAccepted.current = false;
                    setStatus("idle");
                    setErrorMessage("");
                  }}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                  data-ocid="accept-invite.retry_button"
                >
                  Try again
                </button>
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/70 transition-colors"
                >
                  Back to home
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
