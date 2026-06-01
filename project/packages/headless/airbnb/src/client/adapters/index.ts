/**
 * Platform adapters consumed by the headless providers.
 *
 * Mobile is the canonical shape (async storage, bearer fetch, expo-location).
 * Web supplies sync wrappers (localStorage, same-origin fetch, geo-IP shim).
 */

export type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export type SessionUser = { id?: string; email?: string; name?: string } | null | undefined;

export type SessionHook = () => { data: { user: SessionUser } | null; isPending?: boolean };

export type AuthedFetch = (input: string, init?: RequestInit) => Promise<Response>;

export type LocationResolver = (supported: readonly string[]) => Promise<string | null>;

/** Bundle of everything the headless providers need from the host app. */
export type HeadlessEnv = {
  apiBaseUrl: string;
  authedFetch: AuthedFetch;
  storage: StorageAdapter;
  useSession: SessionHook;
};
