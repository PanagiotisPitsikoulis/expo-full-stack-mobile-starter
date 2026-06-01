import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { useUniwind } from "uniwind";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export function TravelEmptyState({
  actionLabel,
  icon = "compass-outline",
  message,
  onAction,
  title,
}: {
  /** Label for the optional call-to-action button. Omit `onAction` to hide. */
  actionLabel?: string;
  icon?: IconName;
  message: string;
  onAction?: () => void;
  title: string;
}) {
  const { theme } = useUniwind();

  const iconColor = theme === "dark" ? "#a1a1aa" : "#717171";

  return (
    <View className="flex-1 items-center justify-center px-6">
      <View
        className="size-20 items-center justify-center rounded-full bg-surface-tertiary"
        style={{ borderCurve: "continuous" }}
      >
        <MaterialCommunityIcons color={iconColor} name={icon} size={36} />
      </View>

      <View className="mt-6 items-center gap-2">
        <Text className="text-center text-[22px] font-semibold tracking-tight text-foreground">
          {title}
        </Text>
        <Text className="max-w-sm text-center text-[15px] leading-5 text-muted">{message}</Text>
      </View>

      {onAction && actionLabel ? (
        <Button className="mt-8 rounded-full px-5" onPress={onAction} size="sm">
          <Button.Label className="text-[14px] font-semibold">{actionLabel}</Button.Label>
        </Button>
      ) : null}
    </View>
  );
}
