import { BottomSheet } from "@pitsi-ui/native/bottom-sheet";
import { Button } from "@pitsi-ui/native/button";
import { Switch } from "@pitsi-ui/native/switch";
import { Text } from "@pitsi-ui/native/text";
import { Pressable, View } from "react-native";
import type { StayFilters, StayPlaceType } from "../../lib/api/travel";

const PLACE_TYPES: Array<[StayPlaceType, string]> = [
  ["any", "Any type"],
  ["room", "Room"],
  ["entire", "Entire home"],
];

export function FilterQuickSheet({
  count,
  filters,
  isOpen,
  onChange,
  onClear,
  onOpenAll,
  onOpenChange,
}: {
  count: number;
  filters: StayFilters;
  isOpen: boolean;
  onChange: (next: Partial<StayFilters>) => void;
  onClear: () => void;
  onOpenAll: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content snapPoints={["45%"]}>
          <View className="gap-6 px-4 pb-4 pt-2">
            <View className="flex-row items-center justify-between gap-3">
              <BottomSheet.Title>Filters</BottomSheet.Title>
              <BottomSheet.Close accessibilityLabel="Close filters" />
            </View>

            <View className="gap-3">
              <Text className="text-[18px] font-semibold text-foreground">Type of place</Text>
              <View
                className="flex-row rounded-2xl border border-border p-1"
                style={{ borderCurve: "continuous" }}
              >
                {PLACE_TYPES.map(([id, label]) => {
                  const active = filters.placeType === id;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      className={`h-11 flex-1 items-center justify-center rounded-xl ${
                        active ? "bg-default" : ""
                      }`}
                      key={id}
                      onPress={() => onChange({ placeType: id })}
                      style={{ borderCurve: "continuous" }}
                      testID={`stay-filter-place-${id}`}
                    >
                      <Text
                        className={`text-[14px] ${
                          active ? "font-semibold text-foreground" : "text-muted"
                        }`}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1">
                <Text className="text-[16px] font-semibold text-foreground">Instant Book</Text>
                <Text className="mt-0.5 text-[13px] text-muted">
                  Book without waiting for host approval
                </Text>
              </View>
              <Switch
                isSelected={filters.instantBook}
                onSelectedChange={(value) => onChange({ instantBook: value })}
              />
            </View>

            <View className="flex-row items-center justify-between gap-4 pt-1">
              <Pressable accessibilityRole="button" hitSlop={8} onPress={onClear}>
                <Text className="text-[15px] font-semibold text-foreground underline">
                  Clear all
                </Text>
              </Pressable>
              <Button className="px-6" onPress={onOpenAll} testID="stay-filter-open-all">
                All filters · {count}
              </Button>
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
