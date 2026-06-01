import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Show, Showtime, Theatre } from "../../../lib/api/travel";
import { hasExpoMaps } from "../../../lib/client/native-capabilities";
import { AdaptiveGlassView } from "../../components/adaptive-glass-view";
import { LocationMap } from "../../components/location-map";
import { Screen } from "../../components/screen";

export function TheatreDetail({
  isLoading,
  onReserveNext,
  onToggleSave,
  saved,
  showtimes,
  shows,
  theatre,
}: {
  isLoading: boolean;
  onReserveNext: () => void;
  onToggleSave: () => void;
  saved: boolean;
  showtimes: Showtime[];
  shows: Show[];
  theatre: Theatre | undefined;
}) {
  const insets = useSafeAreaInsets();

  // Only fall back to a blank shell if we have nothing at all to render. When
  // the theatre is in cache (placeholderData from the list) we show the page
  // immediately and let shows/showtimes fill in as their queries resolve.
  if (!theatre) {
    return (
      <Screen>
        <View className="flex-1" />
      </Screen>
    );
  }

  const hasMap = hasExpoMaps;
  const now = new Date().toISOString();
  const upcomingShowtimes = [...showtimes]
    .filter((st) => st.startsAt > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const upcomingShowtimeCount = upcomingShowtimes.length;
  const reserveBusy = isLoading && shows.length === 0;
  const showById = Object.fromEntries(shows.map((show) => [show.id, show]));

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "",
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
        contentContainerClassName="pb-40"
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
              recyclingKey={theatre.id}
              source={theatre.image}
              style={{ height: "100%", width: "100%" }}
              transition={150}
            />
          </View>
        </View>

        <View className="gap-6 px-4 pt-6">
          <View>
            <Text className="text-[26px] font-semibold tracking-tight text-foreground">
              {theatre.name}
            </Text>
            <Text className="mt-3 text-[17px] leading-7 text-foreground">{theatre.location}</Text>
            <Text className="mt-4 text-[15px] text-muted">Theatre · {theatre.capacity} seats</Text>
          </View>

          <View className="gap-3 border-b border-border pb-6">
            <Text className="text-[20px] font-semibold text-foreground">About this venue</Text>
            <Text className="text-[16px] leading-6 text-muted">{theatre.description}</Text>
          </View>

          <View className="border-b border-border pb-6">
            <Text className="text-[20px] font-semibold text-foreground">Currently showing</Text>
            {shows.length === 0 ? (
              <Text className="mt-3 text-[15px] text-muted">No shows announced yet.</Text>
            ) : (
              <View className="mt-3 border-t border-border">
                {shows.map((show, index) => (
                  <View
                    className={`${index === shows.length - 1 ? "" : "border-b border-border"} py-4`}
                    key={show.id}
                  >
                    <View className="gap-1">
                      <Text className="text-[17px] font-semibold text-foreground">
                        {show.title}
                      </Text>
                      <Text className="text-[13px] text-muted">
                        {show.genre} · {show.durationMinutes} min · {show.ageRating}
                      </Text>
                      <Text className="pt-1 text-[15px] leading-6 text-muted">
                        {show.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View className="border-b border-border pb-6">
            <Text className="text-[20px] font-semibold text-foreground">Available showtimes</Text>
            {upcomingShowtimes.length === 0 ? (
              <Text className="mt-3 text-[15px] text-muted">Showtimes are loading.</Text>
            ) : (
              <View className="mt-3 border-t border-border">
                {upcomingShowtimes.slice(0, 8).map((showtime, index) => {
                  const show = showById[showtime.showId];
                  return (
                    <View
                      className={`${index === Math.min(upcomingShowtimes.length, 8) - 1 ? "" : "border-b border-border"} py-4`}
                      key={showtime.id}
                    >
                      <Text className="text-[16px] font-semibold text-foreground">
                        {show?.title ?? "Showtime"}
                      </Text>
                      <Text className="mt-1 text-[13px] text-muted">
                        {new Date(showtime.startsAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}{" "}
                        · {showtime.hall}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {hasMap ? (
            <View className="gap-3">
              <Text className="text-[20px] font-semibold text-foreground">Where you'll be</Text>
              <View
                className="overflow-hidden rounded-2xl"
                style={{ borderCurve: "continuous", height: 220 }}
              >
                <LocationMap lat={theatre.lat} lng={theatre.lng} title={theatre.name} />
              </View>
              <Text className="text-[14px] text-muted">{theatre.location}</Text>
            </View>
          ) : null}
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
          <View className="min-w-0 flex-1 gap-1.5">
            <Text className="text-[18px] font-semibold text-foreground" numberOfLines={1}>
              Select showtime
            </Text>
            <Text className="text-[13px] text-muted" numberOfLines={1}>
              {upcomingShowtimeCount > 0
                ? `${upcomingShowtimeCount} showtimes available`
                : "Showtimes are loading"}
            </Text>
          </View>
          <Button className="rounded-full px-7" isDisabled={reserveBusy} onPress={onReserveNext}>
            <Button.Label>Reserve</Button.Label>
          </Button>
        </AdaptiveGlassView>
      </View>
    </Screen>
  );
}
