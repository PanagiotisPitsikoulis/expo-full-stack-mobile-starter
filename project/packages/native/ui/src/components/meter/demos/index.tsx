import { View } from "react-native";

import { Meter, Text } from "../..";

export function Basic() {
  return (
    <View className="w-72">
      <Meter className="gap-2" value={72}>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium text-foreground">Storage</Text>
          <Meter.Output />
        </View>
        <Meter.Track>
          <Meter.Fill />
        </Meter.Track>
      </Meter>
    </View>
  );
}

export function Colors() {
  return (
    <View className="w-72 gap-4">
      {(["accent", "success", "warning", "danger"] as const).map((color, index) => (
        <Meter color={color} key={color} value={(index + 2) * 18}>
          <Meter.Track>
            <Meter.Fill />
          </Meter.Track>
        </Meter>
      ))}
    </View>
  );
}
