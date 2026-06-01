/**
 * Travel onboarding model. Each step writes into a draft that maps 1:1 onto the
 * user_preferences API contract; the final step PATCHes the draft via the
 * preferences provider so onboarding answers persist as real settings.
 */
import type {
  AmenityOption,
  CurrencyCode,
  InterestOption,
  LanguageCode,
  StayTypeOption,
  TripPaceOption,
  TripStyleOption,
  UnitsOption,
  UserPreferencesPatch,
} from "@repo/airbnb-headless/preferences/schemas";

export type OnboardingDraft = {
  name: string;
  language: LanguageCode;
  currency: CurrencyCode;
  units: UnitsOption;
  tripStyle: TripStyleOption;
  tripPace: TripPaceOption;
  budgetPerNight: number;
  interests: InterestOption[];
  stayTypes: StayTypeOption[];
  amenities: AmenityOption[];
  notifTripAlerts: boolean;
  notifPriceDrops: boolean;
  notifNearby: boolean;
};

export const DEFAULT_DRAFT: OnboardingDraft = {
  name: "",
  language: "auto",
  currency: "USD",
  units: "metric",
  tripStyle: "balanced",
  tripPace: "balanced",
  budgetPerNight: 180,
  interests: [],
  stayTypes: [],
  amenities: [],
  notifTripAlerts: true,
  notifPriceDrops: true,
  notifNearby: false,
};

export function toPreferencesPatch(
  draft: OnboardingDraft,
  options: { name?: string },
): UserPreferencesPatch {
  return {
    language: draft.language,
    currency: draft.currency,
    units: draft.units,
    tripStyle: draft.tripStyle,
    tripPace: draft.tripPace,
    budgetPerNight: draft.budgetPerNight,
    interests: draft.interests,
    stayTypes: draft.stayTypes,
    amenities: draft.amenities,
    notifTripAlerts: draft.notifTripAlerts,
    notifPriceDrops: draft.notifPriceDrops,
    notifNearby: draft.notifNearby,
    onboardingDone: true,
    ...(options.name ? {} : {}),
  };
}

export function toggleArrayValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
