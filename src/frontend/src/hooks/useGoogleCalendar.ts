import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { GoogleCredentialStatus } from "../backend";

const GOOGLE_OAUTH_CONFIG_KEY = "bookslot_google_oauth_client_id";
const GOOGLE_PKCE_VERIFIER_KEY = "bookslot_pkce_verifier";
const GOOGLE_REFRESH_TOKEN_KEY = "bookslot_google_refresh_token";
const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
].join(" ");

/** Persist/read Google OAuth client ID from localStorage */
export function getGoogleClientId(): string {
  return localStorage.getItem(GOOGLE_OAUTH_CONFIG_KEY) ?? "";
}
export function setGoogleClientId(id: string) {
  localStorage.setItem(GOOGLE_OAUTH_CONFIG_KEY, id);
}

/** Persist/read refresh token from localStorage (internal tool only) */
export function getStoredRefreshToken(): string {
  return localStorage.getItem(GOOGLE_REFRESH_TOKEN_KEY) ?? "";
}
export function storeRefreshToken(token: string) {
  if (token) localStorage.setItem(GOOGLE_REFRESH_TOKEN_KEY, token);
}
export function clearStoredRefreshToken() {
  localStorage.removeItem(GOOGLE_REFRESH_TOKEN_KEY);
}

/** Generate a cryptographically random string for PKCE */
function generateRandomString(length = 64): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => chars[b % chars.length])
    .join("");
}

/** SHA-256 hash → base64url (for PKCE code_challenge) */
async function sha256Base64Url(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/** Build Google OAuth URL and redirect */
export async function initiateGoogleOAuth(clientId: string) {
  const verifier = generateRandomString();
  const challenge = await sha256Base64Url(verifier);
  sessionStorage.setItem(GOOGLE_PKCE_VERIFIER_KEY, verifier);

  const redirectUri = `${window.location.origin}/host/google-callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_OAUTH_SCOPES,
    access_type: "offline",
    prompt: "consent",
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/** Exchange auth code for tokens using PKCE (no client secret needed) */
export async function exchangeCodeForTokens(
  code: string,
  clientId: string,
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const verifier = sessionStorage.getItem(GOOGLE_PKCE_VERIFIER_KEY);
  if (!verifier)
    throw new Error("PKCE verifier missing — please try connecting again.");

  const redirectUri = `${window.location.origin}/host/google-callback`;
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code_verifier: verifier,
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  sessionStorage.removeItem(GOOGLE_PKCE_VERIFIER_KEY);
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }>;
}

/** Use a stored refresh token to get a new access token from Google */
export async function refreshAccessToken(
  clientId: string,
  refreshToken: string,
): Promise<{ access_token: string; expires_in: number }> {
  const body = new URLSearchParams({
    client_id: clientId,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed: ${text}`);
  }

  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

/** Query credential status (expiresAt, isExpired, hasCredentials) */
export function useGoogleCalendarCredentialStatus() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<GoogleCredentialStatus>({
    queryKey: ["calendarCredentialStatus"],
    queryFn: async () => {
      if (!actor)
        return {
          hasCredentials: false,
          isExpired: false,
          expiresAt: undefined,
        };
      return actor.getGoogleCalendarCredentialStatus();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}

/**
 * Hook: refresh the Google Calendar access token using the locally stored
 * refresh token and persist the new credentials to the backend.
 */
export function useRefreshGoogleCalendarTokens() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async (): Promise<boolean> => {
    const clientId = getGoogleClientId();
    const refreshToken = getStoredRefreshToken();
    if (!clientId || !refreshToken || !actor) return false;

    setIsRefreshing(true);
    try {
      const tokens = await refreshAccessToken(clientId, refreshToken);
      const expiresAt =
        BigInt(Date.now() + tokens.expires_in * 1000) * 1_000_000n;
      await actor.setGoogleCalendarCredentials(
        tokens.access_token,
        refreshToken,
        expiresAt,
      );
      await queryClient.invalidateQueries({
        queryKey: ["calendarCredentialStatus"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["hasCalendarCredentials"],
      });
      return true;
    } catch (_err) {
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [actor, queryClient]);

  return { refresh, isRefreshing };
}

/** 5 minutes before expiry in milliseconds */
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

function showReconnectToast() {
  toast.warning("Google Calendar needs reconnection", {
    id: "gcal-reconnect",
    description:
      "Your Google Calendar token has expired. Reconnect to keep availability in sync.",
    duration: Number.POSITIVE_INFINITY,
    action: {
      label: "Reconnect",
      onClick: () => {
        window.location.href = "/host/settings";
      },
    },
  });
}

/**
 * App-level hook that monitors token expiry and auto-refreshes ~5 min
 * before the token expires. Shows a persistent toast if refresh fails.
 * Call once in Layout (authenticated) so tokens refresh across all pages.
 */
export function useAutoRefreshGoogleCalendar() {
  const { data: status, refetch } = useGoogleCalendarCredentialStatus();
  const { refresh } = useRefreshGoogleCalendarTokens();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clientId = getGoogleClientId();
  const refreshToken = getStoredRefreshToken();
  const canAutoRefresh = !!(clientId && refreshToken);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback(
    (expiresAtMs: number) => {
      clearTimer();
      const msUntilRefresh =
        expiresAtMs - Date.now() - REFRESH_BEFORE_EXPIRY_MS;

      if (msUntilRefresh <= 0) {
        refresh().then((ok) => {
          if (ok) refetch();
          else showReconnectToast();
        });
        return;
      }

      timerRef.current = setTimeout(async () => {
        const ok = await refresh();
        if (ok) refetch();
        else showReconnectToast();
      }, msUntilRefresh);
    },
    [clearTimer, refresh, refetch],
  );

  useEffect(() => {
    if (!status?.hasCredentials) {
      clearTimer();
      return;
    }

    if (status.isExpired) {
      if (canAutoRefresh) {
        refresh().then((ok) => {
          if (ok) refetch();
          else showReconnectToast();
        });
      } else {
        showReconnectToast();
      }
      return;
    }

    if (status.expiresAt && canAutoRefresh) {
      const expiresAtMs = Number(status.expiresAt / 1_000_000n);
      scheduleRefresh(expiresAtMs);
    }

    return clearTimer;
  }, [status, canAutoRefresh, scheduleRefresh, clearTimer, refresh, refetch]);

  // Clean up on unmount
  useEffect(() => clearTimer, [clearTimer]);
}

/** Hook to disconnect Google Calendar */
export function useDisconnectGoogleCalendar() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const disconnect = useCallback(async () => {
    if (!actor) return;
    setIsDisconnecting(true);
    try {
      await actor.setGoogleCalendarCredentials("", "", 0n);
      clearStoredRefreshToken();
      await queryClient.invalidateQueries({
        queryKey: ["hasCalendarCredentials"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["calendarCredentialStatus"],
      });
    } finally {
      setIsDisconnecting(false);
    }
  }, [actor, queryClient]);

  return { disconnect, isDisconnecting };
}
