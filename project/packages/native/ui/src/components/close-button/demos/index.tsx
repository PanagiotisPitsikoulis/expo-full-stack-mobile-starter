import { useState } from "react";
import { View } from "react-native";

import { CloseButton, Text } from "../..";

export function Default() {
  return <CloseButton accessibilityLabel="Close" />;
}

export function Interactive() {
  const [count, setCount] = useState(0);

  return (
    <View className="items-center justify-center gap-4">
      <CloseButton
        accessibilityLabel={`Close (clicked ${count} times)`}
        onPress={() => setCount(count + 1)}
      />
      <Text className="text-sm text-muted">Clicked: {count} times</Text>
    </View>
  );
}

export function WithCustomIcon() {
  return (
    <View className="flex-row items-center gap-4">
      <View className="items-center gap-2">
        <CloseButton accessibilityLabel="Close with custom icon">
          <Text className="text-lg font-bold text-muted">(x)</Text>
        </CloseButton>
        <Text className="text-xs text-muted">Custom Icon</Text>
      </View>
      <View className="items-center gap-2">
        <CloseButton accessibilityLabel="Close with alternative icon">
          <Text className="text-lg font-bold text-muted">x</Text>
        </CloseButton>
        <Text className="text-xs text-muted">Alternative Icon</Text>
      </View>
    </View>
  );
}
