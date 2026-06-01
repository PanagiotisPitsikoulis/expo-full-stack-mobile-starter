import { BottomSheet } from "@pitsi-ui/native/bottom-sheet";
import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { Pressable, ScrollView, View } from "react-native";
import {
  ACTIVITY_FILTER_CATEGORIES,
  type ActivityCategory,
  type ActivityFilters,
} from "../../lib/api/travel";

export function ActivityFilterSheet({
  count,
  filters,
  isOpen,
  onChange,
  onClear,
  onOpenChange,
}: {
  count: number;
  filters: ActivityFilters;
  isOpen: boolean;
  onChange: (next: Partial<ActivityFilters>) => void;
  onClear: () => void;
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
        <BottomSheet.Content snapPoints={["65%"]}>
          <View className="flex-row items-center justify-between gap-3 px-4 pb-2">
            <BottomSheet.Title>Activity filters</BottomSheet.Title>
            <BottomSheet.Close accessibilityLabel="Close activity filters" />
          </View>

          <ScrollView
            className="px-4"
            contentContainerClassName="gap-6 pb-4 pt-2"
            showsVerticalScrollIndicator={false}
          >
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
                    >
                      <Text className="text-[14px] font-semibold text-foreground">{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View className="flex-row items-center justify-between gap-4 border-t border-border px-4 pb-2 pt-3">
            <Pressable accessibilityRole="button" hitSlop={8} onPress={onClear}>
              <Text className="text-[15px] font-semibold text-foreground underline">Clear all</Text>
            </Pressable>
            <Button className="px-6" onPress={() => onOpenChange(false)}>
              Show {count} activities
            </Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
