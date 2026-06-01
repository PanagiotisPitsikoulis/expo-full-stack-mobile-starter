import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Button } from "@pitsi-ui/native/button";
import { Spinner } from "@pitsi-ui/native/components/spinner";
import { Text } from "@pitsi-ui/native/text";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { FavoriteMapItem, StaticImage } from "../../../lib/api/travel";
import { hasExpoMaps } from "../../../lib/client/native-capabilities";
import { AdaptiveGlassView } from "../../components/adaptive-glass-view";
import { LocationMap } from "../../components/location-map";
import { Screen } from "../../components/screen";
import { AIRBNB_ACCENT } from "../../theme/airbnb-colors";

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date();
  date.setFullYear(year ?? date.getFullYear(), (month ?? 1) - 1, day ?? date.getDate());
  date.setHours(12, 0, 0, 0);
  return date;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function EventScreen({
  image,
  imageSrc,
  item,
  lat,
  lng,
  onReserve,
  onReservationDateChange,
  onToggleSave,
  presentedInSheet = false,
  reservationDate,
  reserveError,
  reservePending,
  reservable = true,
  saved,
}: {
  image?: StaticImage;
  imageSrc: (image: StaticImage) => string;
  item: FavoriteMapItem;
  lat?: number;
  lng?: number;
  onReserve: () => Promise<unknown>;
  onReservationDateChange: (value: string) => void;
  onToggleSave: () => void;
  presentedInSheet?: boolean;
  reservationDate: string;
  reserveError?: string;
  reservePending?: boolean;
  reservable?: boolean;
  saved: boolean;
}) {
  const insets = useSafeAreaInsets();
  const isEvent = item.type === "favorite event";
  const imageUrl = image ? imageSrc(image) : "";
  const hasMap = hasExpoMaps && typeof lat === "number" && typeof lng === "number";

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
                  {item.title}
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
            {imageUrl ? (
              <Image
                accessibilityIgnoresInvertColors
                cachePolicy="memory-disk"
                contentFit="cover"
                priority="high"
                recyclingKey={item.id}
                source={imageUrl}
                style={{ height: "100%", width: "100%" }}
                transition={150}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text style={{ fontSize: 64 }}>{item.emoji}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="gap-6 px-4 pt-6">
          <View>
            <Text className="text-[26px] font-semibold tracking-tight text-foreground">
              {item.title}
            </Text>
            <Text className="mt-3 text-[17px] leading-7 text-foreground">{item.subtitle}</Text>
            <Text className="mt-4 text-[15px] text-muted">
              {isEvent ? "Event" : "Recommended plan"} · {item.meta}
            </Text>
          </View>

          <View className="gap-3 border-b border-border pb-6">
            <Text className="text-[20px] font-semibold text-foreground">Good to know</Text>
            <Text className="text-[16px] leading-6 text-muted">
              {isEvent ? "This event takes place" : "This plan is scheduled"} on {item.meta} at{" "}
              {item.subtitle}, and is currently {isEvent ? "bookable" : "an AI pick"}.
            </Text>
          </View>

          <View className="gap-3 border-b border-border pb-6">
            <Text className="text-[20px] font-semibold text-foreground">Reservation date</Text>
            <View className="items-start">
              <DateTimePicker
                accentColor={AIRBNB_ACCENT}
                display="compact"
                minimumDate={new Date()}
                mode="date"
                onValueChange={(_event, date) => onReservationDateChange(formatDate(date))}
                presentation="inline"
                value={parseDate(reservationDate)}
              />
            </View>
          </View>

          <View className="gap-2 border-b border-border pb-6">
            <Text className="text-[20px] font-semibold text-foreground">Why it fits your trip</Text>
            <Text className="text-[16px] leading-6 text-muted">
              This is close to the places you saved on the map and matches your activity
              preferences. Ainnb keeps it grouped with your stays so you can plan the day in one
              place.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-[20px] font-semibold text-foreground">Where you'll be</Text>
            {hasMap ? (
              <View
                className="h-60 overflow-hidden rounded-2xl bg-surface-tertiary"
                style={{ borderCurve: "continuous" }}
              >
                <LocationMap lat={lat} lng={lng} title={item.title} />
              </View>
            ) : null}
            <Text className="text-[15px] font-semibold text-foreground">{item.subtitle}</Text>
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
            <Text className="text-[18px] font-semibold text-foreground" numberOfLines={1}>
              {reservationDate}
            </Text>
            <Text className="text-[13px] text-muted" numberOfLines={1}>
              {item.subtitle}
            </Text>
            {reserveError ? (
              <Text className="mt-1 text-[12px] font-semibold text-accent">{reserveError}</Text>
            ) : null}
          </View>
          <Button
            className="rounded-full px-7"
            isDisabled={reservePending || !reservable}
            onPress={onReserve}
          >
            {reservePending ? <Spinner color="#ffffff" size="sm" /> : null}
            <Button.Label>{reservePending ? "Reserving…" : "Reserve"}</Button.Label>
          </Button>
        </AdaptiveGlassView>
      </View>
    </Screen>
  );
}
