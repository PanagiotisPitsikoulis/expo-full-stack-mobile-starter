import { Ionicons } from "@expo/vector-icons";
import type { GestureResponderEvent, ViewStyle } from "react-native";
import { Pressable } from "react-native";
import { AIRBNB_ACCENT } from "../theme/airbnb-colors";
import { AdaptiveGlassView } from "./adaptive-glass-view";

type FavoriteHeartButtonProps = {
  accessibilityLabel: string;
  onPress?: () => void;
  saved: boolean;
  style?: ViewStyle;
};

const BUTTON_SIZE = 34;
const ICON_SIZE = 20;

export function FavoriteHeartButton({
  accessibilityLabel,
  onPress,
  saved,
  style,
}: FavoriteHeartButtonProps) {
  const iconColor = saved ? AIRBNB_ACCENT : "#FFFFFF";

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPressIn={(event: GestureResponderEvent) => {
        event.stopPropagation();
      }}
      onPress={(event: GestureResponderEvent) => {
        event.stopPropagation();
        onPress?.();
      }}
      style={[
        {
          height: BUTTON_SIZE,
          elevation: 20,
          position: "absolute",
          right: 10,
          top: 10,
          width: BUTTON_SIZE,
          zIndex: 20,
        },
        style,
      ]}
    >
      <AdaptiveGlassView
        colorScheme="dark"
        glassEffectStyle="regular"
        isInteractive
        pointerEvents="none"
        style={{
          alignItems: "center",
          borderCurve: "continuous",
          borderRadius: BUTTON_SIZE / 2,
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Ionicons color={iconColor} name={saved ? "heart" : "heart-outline"} size={ICON_SIZE} />
      </AdaptiveGlassView>
    </Pressable>
  );
}
