import { Platform } from "react-native";
import { getExpoMapsPackage } from "../../lib/client/native-capabilities";

/**
 * Embedded single-pin map for a listing location. Apple Maps on iOS, Google
 * Maps on Android. `expo-maps` is a dev-build-only native module (not in Expo
 * Go), and importing it crashes when the native module is missing, so we resolve
 * it lazily. When maps are not configured, callers should omit the map section.
 */

export function LocationMap({ lat, lng, title }: { lat: number; lng: number; title?: string }) {
  const expoMaps = getExpoMapsPackage();
  const cameraPosition = {
    coordinates: { latitude: lat, longitude: lng },
    zoom: 13,
  };

  if (expoMaps && Platform.OS === "ios") {
    return (
      <expoMaps.AppleMaps.View
        cameraPosition={cameraPosition}
        colorScheme={expoMaps.AppleMaps.MapColorScheme.AUTOMATIC}
        markers={[
          {
            coordinates: { latitude: lat, longitude: lng },
            id: "listing-location",
            systemImage: "house.fill",
            tintColor: "#FF385C",
            title,
          },
        ]}
        properties={{
          mapType: expoMaps.AppleMaps.MapType.STANDARD,
          selectionEnabled: false,
        }}
        style={{ flex: 1 }}
        uiSettings={{
          compassEnabled: true,
          scaleBarEnabled: true,
        }}
      />
    );
  }

  if (expoMaps && Platform.OS === "android") {
    return (
      <expoMaps.GoogleMaps.View
        cameraPosition={cameraPosition}
        colorScheme={expoMaps.GoogleMaps.MapColorScheme.FOLLOW_SYSTEM}
        markers={[
          {
            coordinates: { latitude: lat, longitude: lng },
            id: "listing-location",
            showCallout: true,
            title,
          },
        ]}
        properties={{
          mapType: expoMaps.GoogleMaps.MapType.NORMAL,
          selectionEnabled: false,
        }}
        style={{ flex: 1 }}
        uiSettings={{
          compassEnabled: true,
          mapToolbarEnabled: false,
          myLocationButtonEnabled: false,
          zoomControlsEnabled: false,
        }}
      />
    );
  }

  return null;
}
