import { Text } from "@pitsi-ui/native/text";
import { useMemo } from "react";
import { Platform, View } from "react-native";
import type { Home } from "../../../lib/api/travel";
import { getExpoMapsPackage } from "../../../lib/client/native-capabilities";
import { Screen } from "../../components/screen";

export type MapEvent = {
  id: string;
  title: string;
  image?: string;
  lat: number;
  lng: number;
};

type Pin = { id: string; kind: "home" | "event"; lat: number; lng: number; title: string };

export function MapScreen({
  events,
  homes,
  onOpenEvent,
  onOpenHome,
}: {
  events: MapEvent[];
  homes: Home[];
  onOpenEvent: (eventId: string) => void;
  onOpenHome: (homeId: string) => void;
}) {
  const pins = useMemo<Pin[]>(
    () => [
      ...homes.map((home) => ({
        id: `home:${home.id}`,
        kind: "home" as const,
        lat: home.lat,
        lng: home.lng,
        title: home.title,
      })),
      ...events.map((event) => ({
        id: `event:${event.id}`,
        kind: "event" as const,
        lat: event.lat,
        lng: event.lng,
        title: event.title,
      })),
    ],
    [homes, events],
  );

  const first = pins[0];
  const cameraPosition = {
    coordinates: { latitude: first?.lat ?? 0, longitude: first?.lng ?? 0 },
    zoom: 17,
  };

  const openPinId = (rawId?: string) => {
    if (!rawId) return;
    const [kind, ...rest] = rawId.split(":");
    const id = rest.join(":");
    if (!id) return;
    if (kind === "home") onOpenHome(id);
    else if (kind === "event") onOpenEvent(id);
  };

  const expoMaps = getExpoMapsPackage();
  if (!expoMaps) {
    return <Screen>{null}</Screen>;
  }

  if (Platform.OS === "ios") {
    const markers = pins.map((pin) => ({
      coordinates: { latitude: pin.lat, longitude: pin.lng },
      id: pin.id,
      systemImage: pin.kind === "home" ? "house.fill" : "star.fill",
      tintColor: pin.kind === "home" ? "#FF385C" : "#1D4ED8",
      title: pin.title,
    }));

    return (
      <expoMaps.AppleMaps.View
        cameraPosition={cameraPosition}
        markers={markers}
        onMarkerClick={(marker) => openPinId(marker.id)}
        style={{ flex: 1 }}
      />
    );
  }

  if (Platform.OS === "android") {
    const markers = pins.map((pin) => ({
      coordinates: { latitude: pin.lat, longitude: pin.lng },
      id: pin.id,
      showCallout: true,
      title: pin.title,
    }));

    return (
      <expoMaps.GoogleMaps.View
        cameraPosition={cameraPosition}
        markers={markers}
        onMarkerClick={(marker) => openPinId(marker.id)}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-[15px] text-muted">
          The map is available on iOS and Android.
        </Text>
      </View>
    </Screen>
  );
}
