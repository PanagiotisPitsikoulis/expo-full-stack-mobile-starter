import { Button } from "@pitsi-ui/native/button";
import { Card } from "@pitsi-ui/native/card";
import { Avatar } from "@pitsi-ui/native/components/avatar";
import { Text } from "@pitsi-ui/native/text";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Home, StaticImage } from "../../../lib/api/travel";
import { hasExpoMaps } from "../../../lib/client/native-capabilities";
import { AdaptiveGlassView } from "../../components/adaptive-glass-view";
import { LocationMap } from "../../components/location-map";
import { Screen } from "../../components/screen";

export function DetailScreen({
  buttonLabel,
  copyBadge,
  galleryImages,
  home,
  hostImage = "stay-3",
  imageSrc,
  onCheckout,
  onToggleSave,
  presentedInSheet = false,
  saved,
}: {
  buttonLabel: string;
  copyBadge: string;
  galleryImages: StaticImage[];
  home: Home;
  hostImage?: StaticImage;
  imageSrc: (image: StaticImage) => string;
  onCheckout: () => void;
  onToggleSave: () => void;
  presentedInSheet?: boolean;
  saved: boolean;
}) {
  const insets = useSafeAreaInsets();
  const nights = 2;
  const total = home.pricePerNight * nights;
  const hero = galleryImages[0] ?? home.image;
  const rest = galleryImages.slice(1);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: presentedInSheet
            ? () => (
                <Text
                  className="text-[17px] font-semibold text-foreground"
                  numberOfLines={1}
                  style={{ maxWidth: 200 }}
                >
                  {home.title}
                </Text>
              )
            : "",
          headerRight: () => (
            <Pressable
              accessibilityLabel={saved ? "Saved" : "Save"}
              accessibilityRole="button"
              hitSlop={8}
              onPress={onToggleSave}
            >
              <Text className={saved ? "text-2xl text-danger" : "text-2xl text-foreground"}>
                {saved ? "♥" : "♡"}
              </Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName={presentedInSheet ? "pb-40 pt-20" : "pb-40"}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View className="overflow-hidden bg-surface-tertiary" style={{ aspectRatio: 1.2 }}>
            <Image
              accessibilityIgnoresInvertColors
              cachePolicy="memory-disk"
              contentFit="cover"
              priority="high"
              recyclingKey={home.id}
              source={imageSrc(hero)}
              style={{ height: "100%", width: "100%" }}
              transition={150}
            />
          </View>
          {rest.length > 0 ? (
            <View className="px-4">
              <ScrollView
                className="mt-3"
                contentContainerClassName="gap-2"
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {rest.map((image, index) => (
                  <View
                    className="overflow-hidden rounded-xl bg-surface-tertiary"
                    key={`${imageSrc(image)}-${index}`}
                    style={{ borderCurve: "continuous", height: 96, width: 130 }}
                  >
                    <Image
                      accessibilityIgnoresInvertColors
                      cachePolicy="memory-disk"
                      contentFit="cover"
                      recyclingKey={`${home.id}-${index}`}
                      source={imageSrc(image)}
                      style={{ height: "100%", width: "100%" }}
                      transition={150}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>

        <View className="gap-6 px-4 pt-6">
          <View>
            <Text className="text-[26px] font-semibold tracking-tight text-foreground">
              {home.title}
            </Text>
            <Text className="mt-3 text-[17px] leading-7 text-foreground">
              {home.type} in {home.neighborhood}, {home.city}
            </Text>
            <Text className="mt-4 text-[15px] text-muted">
              {home.guests} guests · {home.beds} bedrooms · {home.beds} beds · {home.baths} baths
            </Text>
          </View>

          <Card className="flex-row items-center gap-4 p-5">
            <Card.Body className="flex-1">
              <Card.Title className="text-[16px] font-semibold text-foreground">
                {copyBadge}
              </Card.Title>
              <Card.Description className="mt-1 text-[14px] text-muted">
                One of the most loved stays, according to guests
              </Card.Description>
            </Card.Body>
            <View className="items-center border-l border-border pl-4">
              <Text className="text-[20px] font-semibold text-foreground">
                {home.rating.toFixed(2)}
              </Text>
              <Text className="text-[12px] text-foreground">★★★★★</Text>
            </View>
            <View className="items-center border-l border-border pl-4">
              <Text className="text-[20px] font-semibold text-foreground">{home.reviews}</Text>
              <Text className="text-[12px] text-muted">Reviews</Text>
            </View>
          </Card>

          <View className="flex-row items-center gap-4 border-b border-border pb-6">
            <Avatar alt={`Hosted by ${home.host}`} className="size-14" size="lg">
              <Avatar.Image source={{ uri: imageSrc(hostImage) }} />
            </Avatar>
            <View>
              <Text className="text-[18px] font-semibold text-foreground">
                Hosted by {home.host}
              </Text>
              <Text className="mt-0.5 text-[14px] text-muted">Superhost · 7 years hosting</Text>
            </View>
          </View>

          <View className="gap-4 border-b border-border pb-6">
            <Text className="text-[20px] font-semibold text-foreground">
              What this place offers
            </Text>
            <View className="gap-3">
              {home.amenities.map((amenity) => (
                <View className="flex-row items-center gap-3" key={amenity}>
                  <Text className="text-[16px] text-foreground">✓</Text>
                  <Text className="text-[16px] text-foreground">{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-[20px] font-semibold text-foreground">Where you'll be</Text>
            {hasExpoMaps ? (
              <View
                className="h-60 overflow-hidden rounded-2xl bg-surface-tertiary"
                style={{ borderCurve: "continuous" }}
              >
                <LocationMap lat={home.lat} lng={home.lng} title={home.title} />
              </View>
            ) : null}
            <View>
              <Text className="text-[15px] font-semibold text-foreground">
                {home.neighborhood}, {home.city}
              </Text>
              <Text className="mt-1 text-[13px] text-muted">
                Exact location provided after booking.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute inset-x-0 px-4" style={{ bottom: insets.bottom + 26 }}>
        <AdaptiveGlassView
          glassEffectStyle="regular"
          style={{
            alignItems: "center",
            borderCurve: "continuous",
            borderRadius: 999,
            flexDirection: "row",
            gap: 16,
            justifyContent: "space-between",
            overflow: "hidden",
            paddingHorizontal: 24,
            paddingVertical: 14,
          }}
        >
          <View className="min-w-0 flex-1">
            <Text className="text-[18px] text-foreground" numberOfLines={1}>
              <Text className="font-semibold">${home.pricePerNight}</Text> night
            </Text>
            <Text className="text-[13px] text-muted" numberOfLines={1}>
              ${total} before fees · {nights} nights
            </Text>
          </View>
          <Button className="rounded-full px-7" onPress={onCheckout}>
            {buttonLabel}
          </Button>
        </AdaptiveGlassView>
      </View>
    </Screen>
  );
}
