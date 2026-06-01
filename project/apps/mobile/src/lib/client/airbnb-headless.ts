/**
 * Native instantiation of the headless airbnb providers.
 *
 * Wires the platform adapters (AsyncStorage, bearer-fetch auth, expo-location)
 * into the factories from @repo/airbnb-headless and exports the resulting
 * provider/hook pairs for the rest of the native app to consume.
 */
import { createUserPreferencesProvider } from "@repo/airbnb-headless/preferences";
import {
  createAiFeatureProvider,
  createAppDataProvider,
  createCustomerTripProvider,
  createHomeFeatureProvider,
  useTravel,
} from "@repo/airbnb-headless/providers";
import { API_BASE_URL } from "../api/client";
import { galleryImages, imageSrc } from "../api/travel/native-overlay";
import { authedFetch, getAuthHeaders, useSession } from "./auth-client";
import { resolveCurrentCountry } from "./features/customer-trip/location";
import { nativeStorage } from "./global/sync/keys";

const env = {
  apiBaseUrl: API_BASE_URL,
  authedFetch,
  storage: nativeStorage,
  useSession,
};

const overlay = {
  galleryImages,
  imageSrc,
};

export const { AppDataProvider, useAppData } = createAppDataProvider(env, overlay);

export const { CustomerTripProvider, useCustomerTrip } = createCustomerTripProvider({
  resolveCurrentCountry,
  useAppData,
  useTravel,
});

export const { HomeFeatureProvider, useHomeFeature } = createHomeFeatureProvider({
  useAppData,
  useCustomerTrip,
});

export const { UserPreferencesProvider, useUserPreferences } = createUserPreferencesProvider({
  apiBaseUrl: API_BASE_URL,
  authedFetch,
  useSession,
});

export const { AiFeatureProvider, useAiFeature } = createAiFeatureProvider({
  apiBaseUrl: API_BASE_URL,
  authHeaders: getAuthHeaders,
  storage: nativeStorage,
  useAppData,
  useCustomerTrip,
  useUserPreferences,
  // The AI tab can be opened from any screen, but HomeFeatureProvider is only
  // mounted inside the home/activities feature shells. Guard the lookup so the
  // AI provider doesn't crash with
  // "useHomeFeature must be used within HomeFeatureProvider" — when the home
  // feature isn't in scope, `change_category` is just a no-op (the user can
  // still set categories from the home tab itself).
  useSetActiveCategory: () => {
    try {
      // biome-ignore lint/correctness/useHookAtTopLevel: This optional bridge intentionally no-ops when HomeFeatureProvider is not mounted.
      const setActiveCategory = useHomeFeature().actions.setActiveCategory;
      return (id: string) => setActiveCategory(id as Parameters<typeof setActiveCategory>[0]);
    } catch {
      return () => undefined;
    }
  },
});
