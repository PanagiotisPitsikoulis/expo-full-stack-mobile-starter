/**
 * Shared user-preferences schema. Persisted in the `user_preferences` table
 * on the web app and consumed by web + native through the same API contract.
 */
import { z } from "zod";

export const languageCodes = ["auto", "en", "el", "es", "fr", "de", "it", "ja"] as const;
export const currencyCodes = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"] as const;
export const unitsOptions = ["metric", "imperial"] as const;
export const themeOptions = ["system", "light", "dark"] as const;
export const tripStyleOptions = ["budget", "balanced", "premium", "design", "adventure"] as const;
export const tripPaceOptions = ["relaxed", "balanced", "packed"] as const;
export const searchRegionOptions = [
  "worldwide",
  "europe",
  "north_america",
  "asia",
  "south_america",
  "africa",
  "oceania",
] as const;
export const locationSharingOptions = ["never", "planning", "always"] as const;
export const aiMemoryOptions = ["off", "trip_preferences", "full_history"] as const;

export const interestOptions = [
  "beach",
  "city",
  "mountain",
  "countryside",
  "design",
  "food",
  "nightlife",
  "history",
  "nature",
  "wellness",
  "shopping",
  "family",
] as const;

export const stayTypeOptions = [
  "apartment",
  "house",
  "villa",
  "cabin",
  "loft",
  "treehouse",
  "boat",
  "tiny_home",
] as const;

export const amenityOptions = [
  "wifi",
  "kitchen",
  "parking",
  "pool",
  "ac",
  "washer",
  "workspace",
  "ev_charger",
  "hot_tub",
  "gym",
  "pets_allowed",
] as const;

export type LanguageCode = (typeof languageCodes)[number];
export type CurrencyCode = (typeof currencyCodes)[number];
export type UnitsOption = (typeof unitsOptions)[number];
export type ThemeOption = (typeof themeOptions)[number];
export type TripStyleOption = (typeof tripStyleOptions)[number];
export type TripPaceOption = (typeof tripPaceOptions)[number];
export type SearchRegionOption = (typeof searchRegionOptions)[number];
export type LocationSharingOption = (typeof locationSharingOptions)[number];
export type AiMemoryOption = (typeof aiMemoryOptions)[number];
export type InterestOption = (typeof interestOptions)[number];
export type StayTypeOption = (typeof stayTypeOptions)[number];
export type AmenityOption = (typeof amenityOptions)[number];

export const userPreferencesSchema = z.object({
  language: z.enum(languageCodes),
  currency: z.enum(currencyCodes),
  units: z.enum(unitsOptions),
  theme: z.enum(themeOptions),
  tripStyle: z.enum(tripStyleOptions),
  tripPace: z.enum(tripPaceOptions),
  budgetPerNight: z.number().int().min(20).max(5000),
  searchRegion: z.enum(searchRegionOptions),
  notifTripAlerts: z.boolean(),
  notifPriceDrops: z.boolean(),
  notifNearby: z.boolean(),
  notifMessages: z.boolean(),
  twoFactor: z.boolean(),
  locationSharing: z.enum(locationSharingOptions),
  aiMemory: z.enum(aiMemoryOptions),
  mapRecommendations: z.boolean(),
  interests: z.array(z.enum(interestOptions)).max(interestOptions.length),
  stayTypes: z.array(z.enum(stayTypeOptions)).max(stayTypeOptions.length),
  amenities: z.array(z.enum(amenityOptions)).max(amenityOptions.length),
  onboardingDone: z.boolean(),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const userPreferencesResponseSchema = z
  .union([userPreferencesSchema, z.object({ data: userPreferencesSchema })])
  .transform((payload) => ("data" in payload ? payload.data : payload));

export const userPreferencesPatchSchema = userPreferencesSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

export type UserPreferencesPatch = z.infer<typeof userPreferencesPatchSchema>;

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: "auto",
  currency: "USD",
  units: "metric",
  theme: "system",
  tripStyle: "balanced",
  tripPace: "relaxed",
  budgetPerNight: 180,
  searchRegion: "worldwide",
  notifTripAlerts: true,
  notifPriceDrops: true,
  notifNearby: false,
  notifMessages: true,
  twoFactor: false,
  locationSharing: "planning",
  aiMemory: "trip_preferences",
  mapRecommendations: true,
  interests: [],
  stayTypes: [],
  amenities: [],
  onboardingDone: false,
};
