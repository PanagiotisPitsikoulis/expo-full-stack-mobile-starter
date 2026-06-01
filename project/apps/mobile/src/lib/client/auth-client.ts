/**
 * Native auth client. Talks to the web app's Better Auth HTTP endpoints over
 * the absolute base URL and persists the session so the user does not have to
 * log in every launch.
 *
 * Storage split (best practice):
 *   - bearer token  -> expo-secure-store (iOS Keychain / Android Keystore).
 *     Treat the token like a password: never plaintext on disk.
 *   - user identity -> AsyncStorage. Non-sensitive (id/email/name) and survives
 *     across SDK changes; lets the UI render the signed-in shell before the
 *     token round-trips.
 *
 * Session lifecycle:
 *   - On first useSession(), hydrate from storage (token + user).
 *   - authedFetch attaches `Authorization: Bearer <token>` automatically.
 *   - On any 401 from authedFetch, we clear the local session so AuthGuard
 *     bounces the user to /(auth)/login (matches the web proxy behavior).
 *   - signOut() clears both stores.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/client";

export type AirbnbUser = { id?: string; email?: string; name?: string };

// AsyncStorage holds the user identity; SecureStore holds the credential.
const USER_KEY = "ainnb-session-user";
const TOKEN_SECURE_KEY = "ainnb_session_token";
const AUTH_ORIGIN = new URL(API_BASE_URL).origin;

let currentUser: AirbnbUser | null = null;
let currentToken: string | null = null;
let hydrated = false;
let hydratingPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

async function writeToken(token: string | null) {
  // expo-secure-store has a value-size cap (~2KB iOS, ~512B Android), well
  // above any sane bearer token; no chunking needed.
  try {
    if (token) await SecureStore.setItemAsync(TOKEN_SECURE_KEY, token);
    else await SecureStore.deleteItemAsync(TOKEN_SECURE_KEY);
  } catch {
    // SecureStore can throw on simulators with no keychain; fail open so the
    // session still works in-memory for this run.
  }
}

async function readToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_SECURE_KEY);
  } catch {
    return null;
  }
}

async function persist(user: AirbnbUser | null, token: string | null) {
  currentUser = user;
  currentToken = token;
  await Promise.all([
    user ? AsyncStorage.setItem(USER_KEY, JSON.stringify(user)) : AsyncStorage.removeItem(USER_KEY),
    writeToken(token),
  ]);
  emit();
}

function hydrate(): Promise<void> {
  if (hydrated) return Promise.resolve();
  if (hydratingPromise) return hydratingPromise;
  hydratingPromise = (async () => {
    try {
      const [user, token] = await Promise.all([AsyncStorage.getItem(USER_KEY), readToken()]);
      currentUser = user ? (JSON.parse(user) as AirbnbUser) : null;
      currentToken = token;
    } catch {
      // Corrupt storage: treat as signed out.
      currentUser = null;
      currentToken = null;
    } finally {
      // Only flip the flag AFTER state is loaded so consumers don't briefly
      // observe `isPending: false, data: null` while we're still reading.
      hydrated = true;
      emit();
    }
  })();
  return hydratingPromise;
}

type AuthResult = { error?: { message?: string } };

async function authRequest(path: string, body: Record<string, unknown>): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        origin: AUTH_ORIGIN,
        referer: `${AUTH_ORIGIN}/`,
      },
      method: "POST",
    });
    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      token?: string;
      user?: AirbnbUser;
    };
    if (!response.ok) {
      return { error: { message: data.message ?? "Authentication failed." } };
    }
    const token = data.token ?? response.headers.get("set-auth-token");
    await persist(data.user ?? { email: String(body.email ?? "") }, token);
    return {};
  } catch {
    return { error: { message: "Could not reach the server. Check your connection." } };
  }
}

export function signInEmail(email: string, password: string) {
  return authRequest("sign-in/email", { email, password });
}

export function signUpEmail(email: string, name: string, password: string) {
  return authRequest("sign-up/email", { email, name, password });
}

export async function signOut() {
  // Optional courtesy ping: ask the server to invalidate this token. Best
  // effort — local state wins regardless so the UI never gets stuck "signing
  // out".
  if (currentToken) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: AUTH_ORIGIN,
          authorization: `Bearer ${currentToken}`,
        },
      });
    } catch {
      // ignore network errors on sign-out
    }
  }
  await persist(null, null);
}

/**
 * Drop the local session without hitting the server. Used when the server
 * tells us the token is no longer valid (401) — we don't want to round-trip
 * back to it.
 */
async function forceSignOutLocal() {
  await persist(null, null);
}

/**
 * Fetch that attaches the stored bearer token. If the server returns 401, we
 * treat the session as dead, clear local storage, and let AuthGuard bounce the
 * user to login on the next render.
 */
export async function authedFetch(input: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (currentToken) headers.set("Authorization", `Bearer ${currentToken}`);
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401 && currentToken) {
    await forceSignOutLocal();
  }
  return response;
}

/** Bearer header for transports that take headers directly (e.g. AI streaming). */
export function getAuthHeaders(): Record<string, string> {
  return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
}

export function useSession(): {
  data: { user: AirbnbUser } | null;
  isPending: boolean;
} {
  const [, force] = useState(0);
  useEffect(() => {
    void hydrate();
    const listener = () => force((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return {
    data: currentUser ? { user: currentUser } : null,
    isPending: !hydrated,
  };
}
