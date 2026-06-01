import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "@pitsi-ui/native/text";
import type { ComponentProps } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useUniwind } from "uniwind";
import type { TravelCategoryId } from "../../lib/api/travel";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const CATEGORY_ICONS: Record<TravelCategoryId, IconName> = {
  all: "view-grid-outline",
  wifi: "wifi",
  kitchen: "silverware-fork-knife",
  ac: "snowflake",
  workspace: "laptop",
  "self-check-in": "key-outline",
  parking: "car-outline",
  tv: "television",
  coffee: "coffee-outline",
  washer: "washing-machine",
  heating: "radiator",
  iron: "iron-outline",
  "hair-dryer": "hair-dryer-outline",
};

export function CategoryStrip({
  activeCategory,
  categories,
  onCategoryChange,
}: {
  activeCategory: TravelCategoryId;
  categories: Array<{ id: TravelCategoryId; label: string }>;
  onCategoryChange: (category: TravelCategoryId) => void;
}) {
  const { theme } = useUniwind();
  const activeColor = theme === "dark" ? "#fafafa" : "#222222";
  const mutedColor = theme === "dark" ? "#a1a1aa" : "#717171";

  return (
    <View className="border-b border-border">
      <ScrollView
        contentContainerClassName="gap-6 px-4 py-3"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => {
          const active = category.id === activeCategory;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className="items-center gap-1.5"
              key={category.id}
              onPress={() => onCategoryChange(category.id)}
            >
              <MaterialCommunityIcons
                color={active ? activeColor : mutedColor}
                name={CATEGORY_ICONS[category.id] ?? "view-grid-outline"}
                size={26}
              />
              <Text
                className={
                  active ? "text-[12px] font-semibold text-foreground" : "text-[12px] text-muted"
                }
                numberOfLines={1}
              >
                {category.label}
              </Text>
              <View className={active ? "h-0.5 w-7 bg-foreground" : "h-0.5 w-7 bg-transparent"} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
