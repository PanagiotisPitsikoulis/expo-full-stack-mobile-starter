import { View } from "react-native";

import { PressableFeedback, Text } from "../..";

export function Basic() {
  return (
    <PressableFeedback className="rounded-2xl bg-surface p-4">
      <Text className="text-base font-medium text-foreground">Press surface</Text>
    </PressableFeedback>
  );
}

export function Highlight() {
  return (
    <PressableFeedback animation={false} className="rounded-2xl bg-surface p-4">
      <PressableFeedback.Highlight />
      <Text className="text-base font-medium text-foreground">Highlight feedback</Text>
    </PressableFeedback>
  );
}

export function Ripple() {
  return (
    <PressableFeedback animation={false} className="rounded-2xl bg-surface p-4">
      <PressableFeedback.Ripple />
      <Text className="text-base font-medium text-foreground">Ripple feedback</Text>
    </PressableFeedback>
  );
}

export function ScaleSlot() {
  return (
    <PressableFeedback animation={false}>
      <PressableFeedback.Scale>
        <View className="rounded-2xl bg-accent px-5 py-3">
          <Text className="text-base font-medium text-accent-foreground">Scaled child</Text>
        </View>
      </PressableFeedback.Scale>
    </PressableFeedback>
  );
}
