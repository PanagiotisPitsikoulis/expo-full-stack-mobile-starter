/**
 * User-preferences provider. Fetches the row from /api/users/me/preferences on
 * mount, hands the parsed object back through context, and exposes a single
 * update() action that PATCHes the API and writes through to the cache so all
 * settings rows reflect the change immediately.
 *
 * Host wires the platform-specific authedFetch (web: same-origin; native:
 * bearer header to the web API base URL).
 */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";
import type { AuthedFetch } from "../adapters";
import {
  DEFAULT_USER_PREFERENCES,
  type UserPreferences,
  type UserPreferencesPatch,
  userPreferencesResponseSchema,
} from "./schemas";

const PREFERENCES_QUERY_KEY = ["airbnb", "user-preferences"] as const;
const PREFERENCES_PATH = "/api/users/me/preferences";

export type UserPreferencesValue = {
  preferences: UserPreferences;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  update: (patch: UserPreferencesPatch) => Promise<UserPreferences>;
  isUpdating: boolean;
};

const UserPreferencesContext = createContext<UserPreferencesValue | null>(null);

export type CreateUserPreferencesProviderInput = {
  apiBaseUrl: string;
  authedFetch: AuthedFetch;
  useSession: () => { data: { user: { id?: string } | null | undefined } | null };
};

export function createUserPreferencesProvider(input: CreateUserPreferencesProviderInput) {
  const { apiBaseUrl, authedFetch, useSession } = input;
  const endpoint = `${apiBaseUrl}${PREFERENCES_PATH}`;

  function UserPreferencesProvider({ children }: { children: ReactNode }) {
    const session = useSession();
    const userId = session?.data?.user?.id ?? null;
    const isAuthenticated = Boolean(userId);
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => [...PREFERENCES_QUERY_KEY, userId] as const, [userId]);

    const query = useQuery({
      queryKey,
      enabled: isAuthenticated,
      staleTime: 60_000,
      queryFn: async (): Promise<UserPreferences> => {
        const response = await authedFetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to load preferences (${response.status})`);
        }
        const payload = await response.json();
        const parsed = userPreferencesResponseSchema.safeParse(payload);
        if (!parsed.success) {
          throw new Error("Preferences payload did not match schema.");
        }
        return parsed.data;
      },
    });

    const mutation = useMutation({
      mutationFn: async (patch: UserPreferencesPatch): Promise<UserPreferences> => {
        const response = await authedFetch(endpoint, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `Failed to update preferences (${response.status})`);
        }
        const payload = await response.json();
        const parsed = userPreferencesResponseSchema.safeParse(payload);
        if (!parsed.success) {
          throw new Error("Updated preferences did not match schema.");
        }
        return parsed.data;
      },
      onMutate: async (patch) => {
        await queryClient.cancelQueries({ queryKey });
        const previous = queryClient.getQueryData<UserPreferences>(queryKey);
        const optimistic = { ...(previous ?? DEFAULT_USER_PREFERENCES), ...patch };
        queryClient.setQueryData(queryKey, optimistic);
        return { previous };
      },
      onError: (_error, _patch, context) => {
        if (context?.previous) {
          queryClient.setQueryData(queryKey, context.previous);
        }
      },
      onSuccess: (updated) => {
        queryClient.setQueryData(queryKey, updated);
      },
    });

    const update = useCallback(
      (patch: UserPreferencesPatch) => mutation.mutateAsync(patch),
      [mutation],
    );

    const value = useMemo<UserPreferencesValue>(
      () => ({
        preferences: query.data ?? DEFAULT_USER_PREFERENCES,
        isLoading: isAuthenticated && query.isLoading,
        isAuthenticated,
        error: (query.error as Error | null) ?? null,
        update,
        isUpdating: mutation.isPending,
      }),
      [isAuthenticated, query.data, query.error, query.isLoading, mutation.isPending, update],
    );

    return (
      <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
    );
  }

  function useUserPreferences(): UserPreferencesValue {
    const value = useContext(UserPreferencesContext);
    if (!value) {
      throw new Error("useUserPreferences must be used within UserPreferencesProvider");
    }
    return value;
  }

  return { UserPreferencesProvider, useUserPreferences };
}
