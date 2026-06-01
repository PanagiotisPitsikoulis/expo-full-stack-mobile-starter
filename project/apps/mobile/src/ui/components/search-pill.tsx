import { Feather } from "@expo/vector-icons";
import { Text } from "@pitsi-ui/native/text";
import { Pressable, View } from "react-native";
import {
  type CustomerTripTab,
  formatShortRange,
} from "../../lib/client/features/customer-trip/model";
import { AdaptiveGlassView } from "./adaptive-glass-view";

type SearchPillForm = {
  checkIn: string;
  checkOut: string;
  destination: string;
  guests: number;
};

const PILL_HEIGHT = 64;

export function SearchPill({
  form,
  onClear,
  onOpen,
}: {
  form: SearchPillForm;
  onClear?: () => void;
  onOpen: (tab: CustomerTripTab) => void;
}) {
  const destinationValue = form.destination || "Anywhere";
  const whenValue = formatShortRange(form.checkIn, form.checkOut) || "Add dates";
  const guestsValue =
    form.guests >= 1 ? `${form.guests} guest${form.guests === 1 ? "" : "s"}` : "Add guests";
  const isComplete = Boolean(
    form.destination.trim() && form.checkIn && form.checkOut && form.guests >= 1,
  );

  return (
    <View className="px-4">
      <AdaptiveGlassView
        glassEffectStyle="regular"
        isInteractive
        style={{
          alignItems: "stretch",
          borderCurve: "continuous",
          borderRadius: 999,
          flexDirection: "row",
          height: PILL_HEIGHT,
          overflow: "hidden",
          paddingLeft: 4,
          paddingRight: 4,
          shadowColor: "#000",
          shadowOffset: { height: 2, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        }}
      >
        <View style={{ alignItems: "center", flex: 1, flexDirection: "row" }}>
          <PillSegment
            accessibilityLabel="Where"
            label="Where"
            onPress={() => onOpen("country")}
            value={destinationValue}
          />
          <View className="w-px bg-border" style={{ height: 28 }} />
          <PillSegment
            accessibilityLabel="When"
            label="When"
            onPress={() => onOpen("checkIn")}
            value={whenValue}
          />
          <View className="w-px bg-border" style={{ height: 28 }} />
          <PillSegment
            accessibilityLabel="Who"
            label="Who"
            onPress={() => onOpen("who")}
            value={guestsValue}
          />
        </View>
        <Pressable
          accessibilityLabel={isComplete ? "Clear search" : "Search"}
          accessibilityRole="button"
          className="rounded-full bg-accent"
          onPress={() => {
            if (isComplete && onClear) {
              onClear();
              return;
            }
            onOpen("country");
          }}
          style={{
            alignItems: "center",
            alignSelf: "center",
            borderCurve: "continuous",
            height: 48,
            justifyContent: "center",
            marginLeft: 4,
            width: 48,
          }}
        >
          <Feather color="#ffffff" name={isComplete ? "x" : "search"} size={20} />
        </Pressable>
      </AdaptiveGlassView>
    </View>
  );
}

function PillSegment({
  accessibilityLabel,
  label,
  onPress,
  value,
}: {
  accessibilityLabel: string;
  label: string;
  onPress: () => void;
  value: string;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={{
        alignItems: "center",
        alignSelf: "stretch",
        flex: 1,
        flexBasis: 0,
        justifyContent: "center",
        minWidth: 0,
        paddingHorizontal: 4,
      }}
    >
      <Text
        className="text-[15px] font-semibold text-foreground"
        style={{ lineHeight: 18, textAlign: "center" }}
      >
        {label}
      </Text>
      <Text
        className="text-[14px] text-muted"
        numberOfLines={1}
        style={{ lineHeight: 18, textAlign: "center" }}
      >
        {value}
      </Text>
    </Pressable>
  );
}
