import { Image } from "expo-image";
import { Platform, Pressable, View } from "react-native";
import type { AiAssistantPayload, Home, StaticImage } from "../../../lib/api/travel";
import { getExpoMapsPackage } from "../../../lib/client/native-capabilities";
import { AiSmartText, useAiTheme } from "../../components/ai-primitives";

export function InlineTripMap({
  imageSrc,
  onOpenDetail,
  payload,
}: {
  imageSrc: (image: StaticImage) => string;
  onExpandHomes: () => void;
  onOpenDetail?: (homeId: string) => void;
  payload: Extract<AiAssistantPayload, { kind: "trip-map" }>;
}) {
  const featured = payload.homes[0];

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View
        style={{
          aspectRatio: 1.3,
          borderCurve: "continuous",
          borderRadius: 22,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <MapCanvas homes={payload.homes} />

        {featured ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onOpenDetail?.(featured.id)}
            style={{ bottom: 16, left: 16, position: "absolute", right: 16 }}
          >
            <FeaturedHomePreview featured={featured} imageSrc={imageSrc} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function FeaturedHomePreview({
  featured,
  imageSrc,
}: {
  featured: Home;
  imageSrc: (image: StaticImage) => string;
}) {
  const theme = useAiTheme();
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: theme.cardBg,
        borderCurve: "continuous",
        borderRadius: 16,
        flexDirection: "row",
        gap: 12,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      }}
    >
      <View
        style={{
          borderCurve: "continuous",
          borderRadius: 12,
          height: 56,
          overflow: "hidden",
          width: 72,
        }}
      >
        <Image
          accessibilityIgnoresInvertColors
          cachePolicy="memory-disk"
          contentFit="cover"
          recyclingKey={featured.id}
          source={imageSrc(featured.image)}
          style={{ height: "100%", width: "100%" }}
          transition={150}
        />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AiSmartText numberOfLines={1} style={{ fontSize: 14, fontWeight: "600" }}>
          {featured.title}
        </AiSmartText>
        <AiSmartText muted numberOfLines={1} style={{ fontSize: 12 }}>
          {featured.neighborhood}, {featured.city}
        </AiSmartText>
        <AiSmartText style={{ fontSize: 13, fontWeight: "700" }}>
          ${featured.pricePerNight}
          <AiSmartText muted style={{ fontSize: 12, fontWeight: "400" }}>
            {" / night"}
          </AiSmartText>
        </AiSmartText>
      </View>
    </View>
  );
}

function MapCanvas({ homes }: { homes: Home[] }) {
  const theme = useAiTheme();
  const expoMaps = getExpoMapsPackage();
  const first = homes[0];

  if (!expoMaps || !first || (Platform.OS !== "ios" && Platform.OS !== "android")) {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: theme.chipBg,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <AiSmartText muted style={{ fontSize: 13 }}>
          Map preview unavailable
        </AiSmartText>
      </View>
    );
  }

  const cameraPosition = {
    coordinates: { latitude: first.lat, longitude: first.lng },
    zoom: 11,
  };

  if (Platform.OS === "ios") {
    return (
      <expoMaps.AppleMaps.View
        cameraPosition={cameraPosition}
        markers={homes.map((home) => ({
          coordinates: { latitude: home.lat, longitude: home.lng },
          id: `home:${home.id}`,
          systemImage: "house.fill",
          tintColor: "#FF385C",
          title: home.title,
        }))}
        properties={{
          mapType: expoMaps.AppleMaps.MapType.STANDARD,
          selectionEnabled: false,
        }}
        style={{ flex: 1 }}
        uiSettings={{
          compassEnabled: false,
          scaleBarEnabled: false,
        }}
      />
    );
  }

  return (
    <expoMaps.GoogleMaps.View
      cameraPosition={cameraPosition}
      markers={homes.map((home) => ({
        coordinates: { latitude: home.lat, longitude: home.lng },
        id: `home:${home.id}`,
        showCallout: false,
        title: home.title,
      }))}
      properties={{
        mapType: expoMaps.GoogleMaps.MapType.NORMAL,
        selectionEnabled: false,
      }}
      style={{ flex: 1 }}
      uiSettings={{
        compassEnabled: false,
        mapToolbarEnabled: false,
        myLocationButtonEnabled: false,
        zoomControlsEnabled: false,
      }}
    />
  );
}
