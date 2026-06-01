import { ScrollView, View } from "react-native";

import { ScrollShadow, Text } from "../..";

function DemoGradient({
  colors,
  style,
}: {
  colors: string[];
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: object;
}) {
  return <View pointerEvents="none" style={[style, { backgroundColor: colors[0] }]} />;
}

export function Basic() {
  return (
    <ScrollShadow className="h-48 w-full max-w-[320px]" LinearGradientComponent={DemoGradient}>
      <ScrollView className="rounded-2xl bg-surface p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Text className="py-2 text-base text-foreground" key={index}>
            Activity item {index + 1}
          </Text>
        ))}
      </ScrollView>
    </ScrollShadow>
  );
}

export function Horizontal() {
  return (
    <ScrollShadow
      className="w-full max-w-[340px]"
      LinearGradientComponent={DemoGradient}
      orientation="horizontal"
    >
      <ScrollView horizontal className="rounded-2xl bg-surface p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <View
            className="mr-3 h-20 w-24 items-center justify-center rounded-2xl bg-default"
            key={index}
          >
            <Text className="text-base font-medium text-foreground">{index + 1}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollShadow>
  );
}

export function ForcedVisibility() {
  return (
    <ScrollShadow
      className="h-40 w-full max-w-[320px]"
      LinearGradientComponent={DemoGradient}
      visibility="both"
    >
      <ScrollView className="rounded-2xl bg-surface p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Text className="py-2 text-base text-foreground" key={index}>
            Persistent shadow row {index + 1}
          </Text>
        ))}
      </ScrollView>
    </ScrollShadow>
  );
}
