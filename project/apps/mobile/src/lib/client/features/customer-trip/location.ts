import * as Location from "expo-location";

/**
 * Asks for foreground location permission, gets the device coordinates, and
 * reverse-geocodes them to a country name. Returns the matching entry from
 * `supported` (case-insensitive) or null if anything fails. Never throws —
 * permission denial, GPS timeout, and offline reverse-geocode all return null.
 */
export async function resolveCurrentCountry(supported: readonly string[]): Promise<string | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    const places = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    const country = places[0]?.country;
    if (!country) return null;

    const normalized = country.toLowerCase();
    return supported.find((c) => c.toLowerCase() === normalized) ?? null;
  } catch {
    return null;
  }
}
