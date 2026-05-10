import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    user,
    isUserLoading,
    hasUserFetchFailed,
  } = useAuth();
  const navigate = useNavigate();
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start a 10-second timeout whenever we're in the user-loading state
  useEffect(() => {
    if (isAuthenticated && isUserLoading) {
      timerRef.current = setTimeout(() => setLoadingTimedOut(true), 10_000);
    } else {
      setLoadingTimedOut(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, isUserLoading]);

  useEffect(() => {
    if (!isInitializing && !isLoggingIn && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isInitializing, isLoggingIn, isAuthenticated, navigate]);

  if (isInitializing || isLoggingIn) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        data-ocid="auth.loading_state"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 size={28} className="animate-spin text-primary" />
          <p className="text-sm">Loading your session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        data-ocid="auth.loading_state"
      >
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  // Loading timed out or fetch failed — show actionable error
  if (loadingTimedOut || hasUserFetchFailed) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center px-4"
        data-ocid="auth.error_state"
      >
        <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-5">
            <ShieldOff size={24} className="text-destructive" />
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            Verification failed
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Unable to verify your account. Please try signing out and signing
            back in. If the issue persists, contact your administrator.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="px-5 py-2.5 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/70 transition-colors"
            data-ocid="auth.back_button"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isUserLoading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        data-ocid="auth.loading_state"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 size={28} className="animate-spin text-primary" />
          <p className="text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }

  // Authenticated but user record not found in the system
  if (!user) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center px-4"
        data-ocid="auth.access_denied"
      >
        <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-5">
            <ShieldOff size={24} className="text-destructive" />
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            Account not found
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your account was not found in BookSlot. If you received an invite
            link, please use that link to complete sign-up. Otherwise, contact
            your administrator.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="px-5 py-2.5 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/70 transition-colors"
            data-ocid="auth.back_button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // User found but not active (pending invite, suspended, etc.)
  if (user.status !== "active") {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center px-4"
        data-ocid="auth.access_denied"
      >
        <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-5">
            <ShieldOff size={24} className="text-destructive" />
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your invitation is pending. You'll receive access once an
            administrator activates your account.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="px-5 py-2.5 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/70 transition-colors"
            data-ocid="auth.back_button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
