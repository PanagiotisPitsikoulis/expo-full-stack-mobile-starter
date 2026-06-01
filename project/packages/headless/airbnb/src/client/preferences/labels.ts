/**
 * Human-readable labels for preference enums. Pure data — safe for any runtime.
 * Keep titles short (1-3 words) so they fit settings rows on small screens.
 */
import type {
  AiMemoryOption,
  AmenityOption,
  CurrencyCode,
  InterestOption,
  LanguageCode,
  LocationSharingOption,
  SearchRegionOption,
  StayTypeOption,
  ThemeOption,
  TripPaceOption,
  TripStyleOption,
  UnitsOption,
} from "./schemas";

export type EnumLabel<T extends string> = { id: T; title: string; description?: string };

export const languageLabels: EnumLabel<LanguageCode>[] = [
  { id: "auto", title: "Auto", description: "Match device language when possible" },
  { id: "en", title: "English" },
  { id: "el", title: "Greek" },
  { id: "es", title: "Spanish" },
  { id: "fr", title: "French" },
  { id: "de", title: "German" },
  { id: "it", title: "Italian" },
  { id: "ja", title: "Japanese" },
];

export const currencyLabels: EnumLabel<CurrencyCode>[] = [
  { id: "USD", title: "USD", description: "US Dollar" },
  { id: "EUR", title: "EUR", description: "Euro" },
  { id: "GBP", title: "GBP", description: "British Pound" },
  { id: "JPY", title: "JPY", description: "Japanese Yen" },
  { id: "AUD", title: "AUD", description: "Australian Dollar" },
  { id: "CAD", title: "CAD", description: "Canadian Dollar" },
];

export const unitsLabels: EnumLabel<UnitsOption>[] = [
  { id: "metric", title: "Metric", description: "Kilometers, kilograms, celsius" },
  { id: "imperial", title: "Imperial", description: "Miles, pounds, fahrenheit" },
];

export const themeLabels: EnumLabel<ThemeOption>[] = [
  { id: "system", title: "System", description: "Follow the device" },
  { id: "light", title: "Light" },
  { id: "dark", title: "Dark" },
];

export const tripStyleLabels: EnumLabel<TripStyleOption>[] = [
  { id: "budget", title: "Budget", description: "Lean spend on stays and activities" },
  { id: "balanced", title: "Balanced", description: "Mix of comfort and value" },
  { id: "premium", title: "Premium", description: "Polished stays and curated picks" },
  { id: "design", title: "Design", description: "Standout architecture and interiors" },
  { id: "adventure", title: "Adventure", description: "Outdoors, nature, and activity-led" },
];

export const tripPaceLabels: EnumLabel<TripPaceOption>[] = [
  { id: "relaxed", title: "Relaxed", description: "1 plan per day, plenty of downtime" },
  { id: "balanced", title: "Balanced", description: "2 plans per day with breaks" },
  { id: "packed", title: "Packed", description: "3+ activities, full schedule" },
];

export const searchRegionLabels: EnumLabel<SearchRegionOption>[] = [
  { id: "worldwide", title: "Worldwide" },
  { id: "europe", title: "Europe" },
  { id: "north_america", title: "North America" },
  { id: "asia", title: "Asia" },
  { id: "south_america", title: "South America" },
  { id: "africa", title: "Africa" },
  { id: "oceania", title: "Oceania" },
];

export const locationSharingLabels: EnumLabel<LocationSharingOption>[] = [
  { id: "never", title: "Never", description: "Keep your location private" },
  { id: "planning", title: "Only while planning", description: "Share to power local picks" },
  { id: "always", title: "Always", description: "Background recommendations as you travel" },
];

export const aiMemoryLabels: EnumLabel<AiMemoryOption>[] = [
  { id: "off", title: "Off", description: "Forget every conversation" },
  { id: "trip_preferences", title: "Trip preferences", description: "Remember style and budget" },
  { id: "full_history", title: "Full history", description: "Remember entire chat history" },
];

export const interestLabels: EnumLabel<InterestOption>[] = [
  { id: "beach", title: "Beach" },
  { id: "city", title: "City" },
  { id: "mountain", title: "Mountain" },
  { id: "countryside", title: "Countryside" },
  { id: "design", title: "Design" },
  { id: "food", title: "Food" },
  { id: "nightlife", title: "Nightlife" },
  { id: "history", title: "History" },
  { id: "nature", title: "Nature" },
  { id: "wellness", title: "Wellness" },
  { id: "shopping", title: "Shopping" },
  { id: "family", title: "Family" },
];

export const stayTypeLabels: EnumLabel<StayTypeOption>[] = [
  { id: "apartment", title: "Apartment" },
  { id: "house", title: "House" },
  { id: "villa", title: "Villa" },
  { id: "cabin", title: "Cabin" },
  { id: "loft", title: "Loft" },
  { id: "treehouse", title: "Treehouse" },
  { id: "boat", title: "Boat" },
  { id: "tiny_home", title: "Tiny home" },
];

export const amenityLabels: EnumLabel<AmenityOption>[] = [
  { id: "wifi", title: "Wifi" },
  { id: "kitchen", title: "Kitchen" },
  { id: "parking", title: "Free parking" },
  { id: "pool", title: "Pool" },
  { id: "ac", title: "Air conditioning" },
  { id: "washer", title: "Washer" },
  { id: "workspace", title: "Workspace" },
  { id: "ev_charger", title: "EV charger" },
  { id: "hot_tub", title: "Hot tub" },
  { id: "gym", title: "Gym" },
  { id: "pets_allowed", title: "Pet friendly" },
];

export function labelFor<T extends string>(options: EnumLabel<T>[], value: T | undefined): string {
  return options.find((option) => option.id === value)?.title ?? "";
}

export function labelsFor<T extends string>(options: EnumLabel<T>[], values: T[]): string[] {
  return values
    .map((value) => options.find((option) => option.id === value)?.title)
    .filter((label): label is string => Boolean(label));
}
