import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Show, Showtime } from "../../../lib/api/travel";
import type { SeatWithAvailability } from "../../../lib/client/features/theatres/api";
import { AdaptiveGlassView } from "../../components/adaptive-glass-view";
import { Screen } from "../../components/screen";

type SeatVisual = "available" | "selected" | "unavailable";

const SEAT_SIZE = 30;
const SEAT_RADIUS = 9;
const SEAT_GAP = 6;
const AISLE_GAP = 18;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatShowtime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function SeatGlyph({ size = SEAT_SIZE, variant }: { size?: number; variant: SeatVisual }) {
  const baseStyle = {
    alignItems: "center" as const,
    borderCurve: "continuous" as const,
    borderRadius: SEAT_RADIUS,
    height: size,
    justifyContent: "center" as const,
    overflow: "hidden" as const,
    width: size,
  };
  if (variant === "available") {
    return <View className="bg-accent" style={baseStyle} />;
  }
  if (variant === "selected") {
    return <View className="border-2 border-accent bg-accent/10" style={baseStyle} />;
  }
  return (
    <View className="border border-border bg-surface" style={baseStyle}>
      <Text className="text-[12px] font-semibold text-muted">×</Text>
    </View>
  );
}

export function ReserveScreen({
  confirmLabel = "Reserve",
  editableReservedSeatIds = [],
  error,
  isLoading,
  onConfirm,
  onToggleSeat,
  pending,
  seats,
  selectedSeatIds,
  show,
  showtime,
  totalCents,
}: {
  confirmLabel?: string;
  editableReservedSeatIds?: string[];
  error: string | null;
  isLoading: boolean;
  onConfirm: () => void;
  onToggleSeat: (seatId: string) => void;
  pending: boolean;
  seats: SeatWithAvailability[];
  selectedSeatIds: string[];
  show: Show | undefined;
  showtime: Showtime | undefined;
  totalCents: number;
}) {
  const insets = useSafeAreaInsets();

  if (isLoading || !showtime || !show) {
    return (
      <Screen>
        <View className="flex-1" />
      </Screen>
    );
  }

  const rowMap = seats.reduce<Record<string, SeatWithAvailability[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});
  const rowKeys = Object.keys(rowMap).sort();
  const perRow = rowMap[rowKeys[0]]?.length ?? 10;
  const aisleAt = Math.floor(perRow / 2);

  const selectedCount = selectedSeatIds.length;
  const ctaTitle =
    selectedCount === 0
      ? "Select your seats"
      : `${selectedCount} ${selectedCount === 1 ? "seat" : "seats"} selected`;
  const ctaSubtitle =
    selectedCount === 0 ? `${show.title} · ${showtime.hall}` : `${formatPrice(totalCents)} total`;

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        contentContainerClassName="gap-6 px-4 pt-3"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Text className="px-1 text-[13px] text-muted">
          {show.title} · {formatShowtime(showtime.startsAt)} · {showtime.hall}
        </Text>

        <View className="items-center py-3" style={{ paddingHorizontal: 12 }}>
          <View style={{ gap: SEAT_GAP }}>
            {rowKeys.map((rowKey) => {
              const rowSeats = rowMap[rowKey];
              const left = rowSeats.slice(0, aisleAt);
              const right = rowSeats.slice(aisleAt);
              return (
                <View className="flex-row items-center" key={rowKey} style={{ gap: SEAT_GAP }}>
                  <Text className="w-5 text-center text-[12px] font-semibold text-muted">
                    {rowKey}
                  </Text>
                  {left.map((seat) => {
                    const selected = selectedSeatIds.includes(seat.id);
                    const unavailable = seat.reserved && !editableReservedSeatIds.includes(seat.id);
                    const variant: SeatVisual = selected
                      ? "selected"
                      : unavailable
                        ? "unavailable"
                        : "available";
                    return (
                      <Pressable
                        accessibilityLabel={`Seat ${seat.row}${seat.number}`}
                        accessibilityRole="button"
                        accessibilityState={{ disabled: unavailable, selected }}
                        disabled={unavailable}
                        key={seat.id}
                        onPress={() => onToggleSeat(seat.id)}
                      >
                        <SeatGlyph variant={variant} />
                      </Pressable>
                    );
                  })}
                  <View style={{ width: AISLE_GAP }} />
                  {right.map((seat) => {
                    const selected = selectedSeatIds.includes(seat.id);
                    const unavailable = seat.reserved && !editableReservedSeatIds.includes(seat.id);
                    const variant: SeatVisual = selected
                      ? "selected"
                      : unavailable
                        ? "unavailable"
                        : "available";
                    return (
                      <Pressable
                        accessibilityLabel={`Seat ${seat.row}${seat.number}`}
                        accessibilityRole="button"
                        accessibilityState={{ disabled: unavailable, selected }}
                        disabled={unavailable}
                        key={seat.id}
                        onPress={() => onToggleSeat(seat.id)}
                      >
                        <SeatGlyph variant={variant} />
                      </Pressable>
                    );
                  })}
                  <Text className="w-5 text-center text-[12px] font-semibold text-muted">
                    {rowKey}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="flex-row flex-wrap gap-x-5 gap-y-3 px-1">
          {(
            [
              { label: "Available seat", variant: "available" },
              { label: "Unavailable seat", variant: "unavailable" },
              { label: "Selected seat", variant: "selected" },
            ] as const
          ).map(({ label, variant }) => (
            <View className="flex-row items-center gap-2.5" key={variant}>
              <SeatGlyph size={24} variant={variant} />
              <Text className="text-[14px] text-foreground">{label}</Text>
            </View>
          ))}
        </View>

        {error ? <Text className="text-[14px] font-semibold text-accent">{error}</Text> : null}
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
              {ctaTitle}
            </Text>
            <Text className="text-[13px] text-muted" numberOfLines={1}>
              {ctaSubtitle}
            </Text>
          </View>
          <Button
            className="rounded-full px-7"
            isDisabled={selectedCount === 0 || pending}
            onPress={onConfirm}
          >
            <Button.Label>{pending ? "Saving…" : confirmLabel}</Button.Label>
          </Button>
        </AdaptiveGlassView>
      </View>
    </Screen>
  );
}
