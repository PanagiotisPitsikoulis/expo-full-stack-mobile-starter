import { useServerSync } from "@repo/airbnb-core/hooks";
import type { AuthedFetch, SessionHook } from "../adapters";

export function createServerSyncHook({
  apiBaseUrl,
  authedFetch,
  useSession,
}: {
  apiBaseUrl: string;
  authedFetch: AuthedFetch;
  useSession: SessionHook;
}) {
  return function useAppDataServerSync() {
    const { data } = useSession();
    return useServerSync({ baseUrl: apiBaseUrl, fetchImpl: authedFetch, user: data?.user });
  };
}
