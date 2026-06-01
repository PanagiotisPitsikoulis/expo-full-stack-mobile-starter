import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Show, Showtime } from "../../../lib/api/travel";
import { AdaptiveGlassView } from "../../components/adaptive-glass-view";
import { Screen } from "../../components/screen";

function formatShowtime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ShowtimeScreen({
  isLoading,
  onContinue,
  onSelectShowtime,
  selectedShowtimeId,
  shows,
  showtimes,
}: {
  isLoading: boolean;
  onContinue: () => void;
  onSelectShowtime: (showtimeId: string) => void;
  selectedShowtimeId: string | undefined;
  shows: Show[];
  showtimes: Showtime[];
}) {
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <Screen>
        <View className="flex-1" />
      </Screen>
    );
  }

  const showById = shows.reduce<Record<string, Show>>((acc, current) => {
    acc[current.id] = current;
    return acc;
  }, {});
  const selectedShowtime = showtimes.find((showtime) => showtime.id === selectedShowtimeId);
  const selectedShow = selectedShowtime ? showById[selectedShowtime.showId] : undefined;

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pt-3"
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="border-y border-border">
          {showtimes.length === 0 ? (
            <Text className="py-5 text-[15px] text-muted">No upcoming showtimes.</Text>
          ) : (
            showtimes.map((option) => {
              const selected = option.id === selectedShowtimeId;
              const show = showById[option.showId];
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className="flex-row items-center justify-between gap-4 border-b border-border py-4"
                  key={option.id}
                  onPress={() => onSelectShowtime(option.id)}
                >
                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="text-[16px] font-semibold text-foreground" numberOfLines={1}>
                      {show?.title ?? "Showtime"}
                    </Text>
                    <Text className="text-[13px] text-muted" numberOfLines={1}>
                      {formatShowtime(option.startsAt)} · {option.hall}
                    </Text>
                  </View>
                  <View
                    className={
                      selected
                        ? "size-5 rounded-full border-[6px] border-accent"
                        : "size-5 rounded-full border border-border"
                    }
                  />
                </Pressable>
              );
            })
          )}
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
              {selectedShowtime ? "Showtime selected" : "Select a showtime"}
            </Text>
            <Text className="text-[13px] text-muted" numberOfLines={1}>
              {selectedShowtime
                ? `${selectedShow?.title ?? "Show"} · ${selectedShowtime.hall}`
                : "Seats come next"}
            </Text>
          </View>
          <Button
            className="rounded-full px-7"
            isDisabled={!selectedShowtimeId}
            onPress={onContinue}
          >
            <Button.Label>Seats</Button.Label>
          </Button>
        </AdaptiveGlassView>
      </View>
    </Screen>
  );
}
