import { View } from "react-native";

import { ProgressCircle, Text } from "../..";

function CircleDemo({
  color = "accent",
  label,
  value,
}: {
  color?: "accent" | "danger" | "default" | "success" | "warning";
  label: string;
  value: number;
}) {
  return (
    <View className="items-center gap-2">
      <ProgressCircle color={color} value={value}>
        <ProgressCircle.Track>
          <ProgressCircle.TrackCircle />
          <ProgressCircle.FillCircle />
        </ProgressCircle.Track>
      </ProgressCircle>
      <Text className="text-xs text-muted">{label}</Text>
    </View>
  );
}

export function Basic() {
  return (
    <View className="flex-row items-center gap-6">
      <CircleDemo label="25%" value={25} />
      <CircleDemo color="success" label="60%" value={60} />
      <CircleDemo color="warning" label="85%" value={85} />
    </View>
  );
}
