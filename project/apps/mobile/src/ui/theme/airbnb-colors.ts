import { Color } from "expo-router";
import { Platform } from "react-native";

const useMaterialYou = Platform.OS === "android";

function materialColor(value: unknown, fallback: string): string {
  return useMaterialYou && typeof value === "string" && value.length > 0 ? value : fallback;
}

export function getAirbnbAccent() {
  return materialColor(Color.android.dynamic.primary, "#FF385C");
}

export function getAirbnbAccentRipple() {
  return materialColor(Color.android.dynamic.primaryContainer, "rgba(255, 56, 92, 0.14)");
}

export function getAirbnbAccentIndicator() {
  return materialColor(Color.android.dynamic.primaryContainer, "rgba(255, 56, 92, 0.16)");
}

export const AIRBNB_ACCENT = getAirbnbAccent();
export const AIRBNB_ACCENT_RIPPLE = getAirbnbAccentRipple();
export const AIRBNB_ACCENT_INDICATOR = getAirbnbAccentIndicator();
