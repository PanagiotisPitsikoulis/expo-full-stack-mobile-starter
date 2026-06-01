import { Ionicons } from "@expo/vector-icons";
import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Show, Showtime, Theatre, TheatreReservation } from "../../../lib/api/travel";
import { AdaptiveGlassView } from "../../components/adaptive-glass-view";
import { Screen } from "../../components/screen";

function formatPrice(cents: number, currency: string): string {
  const sign = currency === "USD" ? "$" : `${currency} `;
  return `${sign}${(cents / 100).toFixed(2)}`;
}

function formatShowtime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export function ConfirmationScreen({
  isLoading,
  onBackToTheatres,
  onCancel,
  pending,
  reservation,
  seatLabels,
  show,
  showtime,
  theatre,
}: {
  isLoading: boolean;
  onBackToTheatres: () => void;
  onCancel: () => void;
  pending: boolean;
  reservation: TheatreReservation | undefined;
  seatLabels: string[];
  show: Show | undefined;
  showtime: Showtime | undefined;
  theatre: Theatre | undefined;
}) {
  const insets = useSafeAreaInsets();

  if (isLoading || !reservation) {
    return (
      <Screen>
        <View className="flex-1" />
      </Screen>
    );
  }

  const cancelled = reservation.status === "cancelled";

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
        contentContainerClassName="gap-6 px-4 pt-6"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-3 pt-4">
          <View
            className="size-16 items-center justify-center rounded-full bg-accent"
            style={{ borderCurve: "continuous" }}
          >
            <Ionicons color="#ffffff" name={cancelled ? "close" : "checkmark"} size={32} />
          </View>
          <Text className="text-center text-[22px] font-semibold text-foreground">
            {cancelled ? "Reservation cancelled" : "You're booked"}
          </Text>
          <Text className="text-center text-[14px] text-muted">
            {cancelled
              ? "This reservation has been cancelled."
              : "We've confirmed your seats. Show this screen at the door."}
          </Text>
        </View>

        <View
          className="gap-3 rounded-3xl border border-border bg-surface p-5"
          style={{ borderCurve: "continuous" }}
        >
          <View className="gap-1">
            <Text className="text-[12px] uppercase tracking-wider text-muted">Show</Text>
            <Text className="text-[18px] font-semibold text-foreground">
              {show?.title ?? "Show"}
            </Text>
            {theatre ? (
              <Text className="text-[13px] text-muted">
                {theatre.name} · {theatre.city}
              </Text>
            ) : null}
          </View>

          {showtime ? (
            <View className="gap-1">
              <Text className="text-[12px] uppercase tracking-wider text-muted">When</Text>
              <Text className="text-[15px] font-medium text-foreground">
                {formatShowtime(showtime.startsAt)}
              </Text>
              <Text className="text-[13px] text-muted">{showtime.hall}</Text>
            </View>
          ) : null}

          <View className="gap-1">
            <Text className="text-[12px] uppercase tracking-wider text-muted">Seats</Text>
            <Text className="text-[15px] font-medium text-foreground">
              {seatLabels.join(" · ")}
            </Text>
          </View>

          <View className="flex-row items-center justify-between border-t border-border pt-3">
            <Text className="text-[13px] text-muted">Total paid</Text>
            <Text className="text-[18px] font-semibold text-foreground">
              {formatPrice(reservation.totalCents, reservation.currency)}
            </Text>
          </View>

          <Text className="text-[11px] text-muted">Reservation #{reservation.id.slice(-8)}</Text>
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
            gap: 12,
            justifyContent: "space-between",
            overflow: "hidden",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {cancelled ? null : (
            <Button
              className="flex-1 rounded-full"
              isDisabled={pending}
              onPress={onCancel}
              size="md"
              variant="secondary"
            >
              <Button.Label className="text-[14px] font-semibold">
                {pending ? "Cancelling..." : "Cancel"}
              </Button.Label>
            </Button>
          )}
          <Button className="flex-1 rounded-full" onPress={onBackToTheatres} size="md">
            <Button.Label className="text-[14px] font-semibold text-accent-foreground">
              Back to theatres
            </Button.Label>
          </Button>
        </AdaptiveGlassView>
      </View>
    </Screen>
  );
}
