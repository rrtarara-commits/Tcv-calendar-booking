import { useActor } from "@caffeineai/core-infrastructure";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import { Button } from "../components/ui/button";
import {
  exchangeCodeForTokens,
  getGoogleClientId,
  storeRefreshToken,
} from "../hooks/useGoogleCalendar";

type State = "loading" | "success" | "error";

export default function GoogleCallbackPage() {
  const { actor, isFetching } = useActor(createActor);
  const [state, setState] = useState<State>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const processed = useRef(false);

  useEffect(() => {
    // Wait until actor is ready before attempting to process
    if (isFetching) return;
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error || !code) {
      setState("error");
      setErrorMsg(
        error === "access_denied"
          ? "You denied access to Google Calendar."
          : "No authorization code received from Google.",
      );
      return;
    }

    const clientId = getGoogleClientId();
    if (!clientId) {
      setState("error");
      setErrorMsg(
        "Google OAuth Client ID not found. Please set it in Settings before connecting.",
      );
      return;
    }

    (async () => {
      try {
        const tokens = await exchangeCodeForTokens(code, clientId);

        if (!actor) {
          setState("error");
          setErrorMsg("Not authenticated. Please sign in first.");
          return;
        }

        const expiresAt =
          BigInt(Date.now() + tokens.expires_in * 1000) * 1_000_000n;
        await actor.setGoogleCalendarCredentials(
          tokens.access_token,
          tokens.refresh_token ?? "",
          expiresAt,
        );
        // Persist refresh token locally so auto-refresh works across sessions
        if (tokens.refresh_token) storeRefreshToken(tokens.refresh_token);
        setState("success");
        // Redirect to settings with success after a moment
        setTimeout(() => {
          window.location.href = "/host/settings?cal=connected";
        }, 1800);
      } catch (err) {
        setState("error");
        setErrorMsg(
          err instanceof Error ? err.message : "An unexpected error occurred.",
        );
      }
    })();
  }, [actor, isFetching]);

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center px-4"
      data-ocid="google_callback.page"
    >
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        {state === "loading" && (
          <>
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4 ring-1 ring-primary/25">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
            <h1 className="font-display text-lg font-bold text-foreground mb-2">
              Connecting Google Calendar
            </h1>
            <p className="text-sm text-muted-foreground">
              Exchanging tokens — this takes just a moment…
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4 ring-1 ring-emerald-500/25">
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
            <h1 className="font-display text-lg font-bold text-foreground mb-2">
              Google Calendar Connected!
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              Your calendar is now linked. Redirecting to settings…
            </p>
            <div className="w-full bg-muted/30 rounded-full h-1 overflow-hidden">
              <div className="bg-primary h-1 rounded-full animate-pulse w-3/4" />
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-4 ring-1 ring-destructive/25">
              <XCircle size={24} className="text-destructive" />
            </div>
            <h1 className="font-display text-lg font-bold text-foreground mb-2">
              Connection Failed
            </h1>
            <p className="text-sm text-muted-foreground mb-5 break-words">
              {errorMsg}
            </p>
            <Button
              type="button"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                window.location.href = "/host/settings";
              }}
              data-ocid="google_callback.back_button"
            >
              Back to Settings
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
