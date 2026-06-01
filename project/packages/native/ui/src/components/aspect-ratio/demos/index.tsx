import { View } from "react-native";

import { AspectRatio, Surface, Text } from "../..";

export function Default() {
  return (
    <View className="w-72 gap-4">
      <AspectRatio ratio={16 / 9}>
        <Surface className="h-full w-full items-center justify-center rounded-3xl bg-accent/15 shadow-none">
          <Text className="text-sm font-semibold text-accent">16:9</Text>
        </Surface>
      </AspectRatio>
      <AspectRatio ratio="4 / 3">
        <Surface className="h-full w-full items-center justify-center rounded-3xl bg-success/15 shadow-none">
          <Text className="text-sm font-semibold text-success">4:3</Text>
        </Surface>
      </AspectRatio>
    </View>
  );
}
