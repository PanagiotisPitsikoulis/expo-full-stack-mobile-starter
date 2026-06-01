import { Spinner } from "@pitsi-ui/native/components/spinner";
import { Separator } from "@pitsi-ui/native/separator";
import { Surface } from "@pitsi-ui/native/surface";
import { Text } from "@pitsi-ui/native/text";
import { Image } from "expo-image";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Home, StaticImage } from "../../../lib/api/travel";
import { AdaptiveGlassView } from "../../components/adaptive-glass-view";
import { Screen } from "../../components/screen";

type CheckoutDraft = { guests: number };
type CheckoutQuote = {
  nights: number;
  serviceFee: number;
  subtotal: number;
  taxes: number;
  total: number;
};

function PriceRow({ bold, label, value }: { bold?: boolean; label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text
        className={
          bold ? "text-[16px] font-semibold text-foreground" : "text-[15px] text-foreground"
        }
      >
        {label}
      </Text>
      <Text
        className={
          bold ? "text-[16px] font-semibold text-foreground" : "text-[15px] text-foreground"
        }
      >
        {value}
      </Text>
    </View>
  );
}

export function CheckoutScreen({
  badge,
  draft,
  error,
  imageSrc,
  onBack,
  onComplete,
  onConfirm,
  pending,
  quote,
  rareFind,
  selectedHome,
  tripDates,
}: {
  badge: string;
  draft: CheckoutDraft;
  error: string | null;
  imageSrc: (image: StaticImage) => string;
  onBack: () => void;
  onComplete: () => void;
  onConfirm: () => Promise<unknown>;
  pending?: boolean;
  quote: CheckoutQuote;
  rareFind: string;
  selectedHome: Home;
  tripDates: string;
}) {
  const insets = useSafeAreaInsets();
  const confirmBooking = async () => {
    try {
      await onConfirm();
      onComplete();
    } catch {
      // The route-level mutation exposes errors through the existing error slot
      // once the server sync layer refetches; keep this button handler quiet.
    }
  };

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pt-3"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Surface
          className="flex-row gap-4 rounded-2xl border border-border p-4"
          variant="transparent"
        >
          <View
            className="overflow-hidden"
            style={{ borderCurve: "continuous", borderRadius: 12, height: 96, width: 96 }}
          >
            <Image
              accessibilityIgnoresInvertColors
              cachePolicy="memory-disk"
              contentFit="cover"
              recyclingKey={selectedHome.id}
              source={imageSrc(selectedHome.image)}
              style={{ height: "100%", width: "100%" }}
              transition={150}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[18px] font-semibold text-foreground" numberOfLines={2}>
              {selectedHome.title}
            </Text>
            <Text className="mt-1 text-[14px] text-foreground">
              ★ {selectedHome.rating.toFixed(2)} ({selectedHome.reviews})
            </Text>
            <Text className="mt-1 text-[13px] font-semibold text-foreground">{badge}</Text>
          </View>
        </Surface>

        <Surface className="gap-3 rounded-2xl border border-border p-5" variant="transparent">
          <Text className="text-[18px] font-semibold text-foreground">Trip details</Text>
          <Text className="text-[15px] text-foreground">{tripDates}</Text>
          <Text className="text-[15px] text-foreground">{draft.guests} adult</Text>
        </Surface>

        <Surface className="gap-4 rounded-2xl border border-border p-5" variant="transparent">
          <Text className="text-[18px] font-semibold text-foreground">Price details</Text>
          <PriceRow
            label={`$${selectedHome.pricePerNight} x ${quote.nights} nights`}
            value={`$${quote.subtotal}`}
          />
          <PriceRow label="Service fee" value={`$${quote.serviceFee}`} />
          <PriceRow label="Taxes" value={`$${quote.taxes}`} />
          <Separator />
          <PriceRow bold label="Total USD" value={`$${quote.total}`} />
        </Surface>

        <Surface className="gap-2 rounded-2xl border border-border p-5" variant="transparent">
          <Text className="text-[16px] font-semibold text-foreground">Free cancellation</Text>
          <Text className="text-[14px] text-muted">Cancel within 48 hours for a full refund.</Text>
        </Surface>

        <Text className="text-[15px] text-foreground">
          💎 <Text className="font-semibold">This is a rare find.</Text> {rareFind}.
        </Text>

        {error ? <Text className="text-[14px] font-semibold text-accent">{error}</Text> : null}
      </ScrollView>

      <View
        className="absolute inset-x-0 px-3"
        pointerEvents="box-none"
        style={{ bottom: insets.bottom + 12 }}
      >
        <Pressable
          accessibilityLabel="Confirm booking"
          accessibilityRole="button"
          accessibilityState={{ busy: pending, disabled: pending }}
          disabled={pending}
          onPress={confirmBooking}
        >
          <AdaptiveGlassView
            colorScheme="dark"
            glassEffectStyle="regular"
            isInteractive
            pointerEvents="none"
            style={{
              alignItems: "center",
              borderCurve: "continuous",
              borderRadius: 32,
              flexDirection: "row",
              gap: 10,
              height: 60,
              justifyContent: "center",
              opacity: pending ? 0.7 : 1,
              paddingHorizontal: 24,
            }}
          >
            {pending ? <Spinner color="#ffffff" size="sm" /> : null}
            <Text className="text-[16px] font-semibold text-foreground">
              {pending ? "Confirming…" : "Confirm booking"}
            </Text>
          </AdaptiveGlassView>
        </Pressable>
      </View>
    </Screen>
  );
}
