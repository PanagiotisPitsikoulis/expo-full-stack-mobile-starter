import { Redirect, useRouter, useSegments } from "expo-router";
import { type ReactNode, useCallback } from "react";
import { useSession } from "./auth-client";

/**
 * Mirror of the web app's proxy.ts session gate. Wrap any layout or screen that
 * requires an authenticated user; if no session is present, navigation is
 * redirected to /(auth)/login with a `redirect` param pointing back to the
 * current path so login can return the user to where they came from.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const session = useSession();
  const segments = useSegments();

  if (session.isPending) return null;
  if (session.data) return <>{children}</>;

  const path = `/${segments.join("/")}`;
  return <Redirect href={{ params: { redirect: path }, pathname: "/(auth)/login" }} />;
}

/**
 * Action-level auth gate. Wraps a handler so that calling the wrapped version
 * runs the action when signed in, or pushes /(auth)/login with `redirect` set
 * to the current route when not. Use this for protected actions that fire from
 * a screen the user is allowed to *view* — sending an AI message, saving to
 * wishlist, reserving a stay — so anonymous users hit the login flow on tap
 * rather than seeing an opaque server error.
 *
 * Hydration races: while the session is still loading we treat the user as
 * "not yet authed" and redirect; in practice the session hydrates in the same
 * tick as mount, so this only matters on a hard reload mid-tap.
 */
export function useRequireAuth() {
  const session = useSession();
  const router = useRouter();
  const segments = useSegments();

  return useCallback(
    <Args extends unknown[], R>(action: (...args: Args) => R) =>
      (...args: Args): R | undefined => {
        if (session.data) return action(...args);
        const path = `/${segments.join("/")}`;
        router.push({ params: { redirect: path }, pathname: "/(auth)/login" });
        return undefined;
      },
    [session.data, router, segments],
  );
}
