import { BottomSheet } from "@pitsi-ui/native/bottom-sheet";
import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { Pressable, View } from "react-native";
import {
  ACTIVITY_FILTER_CATEGORIES,
  type ActivityCategory,
  type ActivityFilters,
} from "../../lib/api/travel";

export function ActivityFilterQuickSheet({
  filters,
  isOpen,
  onChange,
  onClear,
  onOpenAll,
  onOpenChange,
}: {
  filters: ActivityFilters;
  isOpen: boolean;
  onChange: (next: Partial<ActivityFilters>) => void;
  onClear: () => void;
  onOpenAll: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const toggleCategory = (category: ActivityCategory) => {
    const selected = filters.categories.includes(category);
    onChange({
      categories: selected
        ? filters.categories.filter((item) => item !== category)
        : [...filters.categories, category],
    });
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content snapPoints={["45%"]}>
          <View className="gap-6 px-4 pb-4 pt-2">
            <View className="flex-row items-center justify-between gap-3">
              <BottomSheet.Title>Activity filters</BottomSheet.Title>
              <BottomSheet.Close accessibilityLabel="Close activity filters" />
            </View>

            <View className="gap-3">
              <Text className="text-[18px] font-semibold text-foreground">Activity type</Text>
              <View className="flex-row flex-wrap gap-2">
                {ACTIVITY_FILTER_CATEGORIES.map(({ id, label }) => {
                  const active = filters.categories.includes(id);
                  return (
                    <Pressable
                      accessibilityRole="button"
                      className={`rounded-full border px-4 py-2 ${
                        active ? "border-accent bg-accent-soft" : "border-border"
                      }`}
                      key={id}
                      onPress={() => toggleCategory(id)}
                      style={{ borderCurve: "continuous" }}
                      testID={`activity-filter-category-${id}`}
                    >
                      <Text className="text-[14px] font-semibold text-foreground">{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-4 pt-1">
              <Pressable accessibilityRole="button" hitSlop={8} onPress={onClear}>
                <Text className="text-[15px] font-semibold text-foreground underline">
                  Clear all
                </Text>
              </Pressable>
              <Button className="px-6" onPress={onOpenAll} testID="activity-filter-open-all">
                All filters
              </Button>
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
