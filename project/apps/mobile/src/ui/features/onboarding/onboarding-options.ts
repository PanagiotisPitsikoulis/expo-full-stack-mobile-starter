/**
 * Static option lists for travel onboarding. Mirrors the enums in
 * @repo/airbnb-headless/preferences/schemas — keep the two in sync.
 */
import {
  amenityLabels,
  currencyLabels,
  interestLabels,
  languageLabels,
  stayTypeLabels,
  tripPaceLabels,
  tripStyleLabels,
  unitsLabels,
} from "@repo/airbnb-headless/preferences/labels";

export type OnboardingPickerOption = {
  description?: string;
  id: string;
  meta?: string;
  title: string;
};

function asPickerOptions<T extends { id: string; title: string; description?: string }>(
  list: T[],
): OnboardingPickerOption[] {
  return list.map((item) => ({ id: item.id, title: item.title, description: item.description }));
}

export const languageOptions = asPickerOptions(languageLabels);
export const currencyOptions = asPickerOptions(currencyLabels);
export const unitOptions = asPickerOptions(unitsLabels);
export const tripStyleOptions = asPickerOptions(tripStyleLabels);
export const tripPaceOptions = asPickerOptions(tripPaceLabels);
export const interestOptions = asPickerOptions(interestLabels);
export const stayTypeOptions = asPickerOptions(stayTypeLabels);
export const amenityOptions = asPickerOptions(amenityLabels);
