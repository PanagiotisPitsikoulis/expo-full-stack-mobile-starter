import { useRealDataSync } from "@repo/airbnb-core/hooks";

export function createRealDataHook({ apiBaseUrl }: { apiBaseUrl: string }) {
  return function useRealData() {
    return useRealDataSync({ baseUrl: apiBaseUrl });
  };
}
