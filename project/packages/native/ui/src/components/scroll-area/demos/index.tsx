import { View } from "react-native";

import { ScrollArea, Text } from "../..";

const items = Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`);

export function Default() {
  return (
    <ScrollArea className="h-[200px] w-[260px] rounded-2xl bg-surface p-4 shadow-surface">
      <View className="gap-2">
        {items.map((item) => (
          <Text key={item} className="text-sm text-foreground">
            {item}
          </Text>
        ))}
      </View>
    </ScrollArea>
  );
}

export { Default as Basic };
