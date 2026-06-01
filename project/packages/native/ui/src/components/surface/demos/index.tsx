import { View } from "react-native";

import { Surface, Text } from "../..";

const variants = [
  {
    description: "This is a default surface variant. It uses bg-surface styling.",
    label: "Default",
    variant: "default" as const,
  },
  {
    description: "This is a secondary surface variant. It uses bg-surface-secondary styling.",
    label: "Secondary",
    variant: "secondary" as const,
  },
  {
    description: "This is a tertiary surface variant. It uses bg-surface-tertiary styling.",
    label: "Tertiary",
    variant: "tertiary" as const,
  },
  {
    description:
      "This is a transparent surface variant. It has no background, suitable for overlays and cards with custom backgrounds.",
    label: "Transparent",
    variant: "transparent" as const,
  },
];

export function Variants() {
  return (
    <View className="gap-4">
      {variants.map((item) => (
        <View className="gap-2" key={item.variant}>
          <Text className="text-sm font-medium text-muted">{item.label}</Text>
          <Surface className="min-w-[320px] gap-3 rounded-3xl p-6" variant={item.variant}>
            <Text className="text-base font-semibold text-foreground">Surface Content</Text>
            <Text className="text-sm text-muted">{item.description}</Text>
          </Surface>
        </View>
      ))}
    </View>
  );
}
