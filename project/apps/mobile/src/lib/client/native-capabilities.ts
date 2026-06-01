import { requireOptionalNativeModule } from "expo";

type ExpoMapsPackage = typeof import("expo-maps");

const androidGoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
export const hasAndroidGoogleMapsApiKey =
  process.env.EXPO_OS !== "android" || Boolean(androidGoogleMapsApiKey);

const expoMapsNativeModule = requireOptionalNativeModule("ExpoMaps");
let expoMapsPackage: ExpoMapsPackage | null | undefined;

export function getExpoMapsPackage(): ExpoMapsPackage | null {
  if (!hasAndroidGoogleMapsApiKey) return null;
  if (!expoMapsNativeModule) return null;
  if (expoMapsPackage !== undefined) return expoMapsPackage;

  try {
    expoMapsPackage = require("expo-maps") as ExpoMapsPackage;
  } catch {
    expoMapsPackage = null;
  }

  return expoMapsPackage;
}

export const hasExpoMaps = getExpoMapsPackage() !== null;
