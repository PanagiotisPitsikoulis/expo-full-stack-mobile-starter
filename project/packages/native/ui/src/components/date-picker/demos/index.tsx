import { Text } from "@pitsi-ui/native";
import { DatePicker } from "@pitsi-ui/native/date-picker";
import { useState } from "react";
import { View } from "react-native";

const dates = ["2026-05-27", "2026-05-28", "2026-05-29"];

export function Basic() {
  return (
    <DatePicker className="w-64">
      <DatePicker.Trigger label="2026-05-27">
        <Text className="text-sm text-foreground">2026-05-27</Text>
        <DatePicker.TriggerIndicator />
      </DatePicker.Trigger>
    </DatePicker>
  );
}

export function WithPopover() {
  return (
    <DatePicker className="w-72">
      <DatePicker.Trigger>
        <Text className="text-sm text-foreground">May 27, 2026</Text>
        <DatePicker.TriggerIndicator />
      </DatePicker.Trigger>
      <DatePicker.Popover>
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Selected date</Text>
          <Text className="text-sm text-muted">Calendar composition is supplied by the app.</Text>
        </View>
      </DatePicker.Popover>
    </DatePicker>
  );
}

export function ControlledTrigger() {
  const [index, setIndex] = useState(0);
  const value = dates[index] ?? dates[0];

  return (
    <DatePicker className="w-64">
      <DatePicker.Trigger onAction={() => setIndex((index + 1) % dates.length)}>
        <Text className="text-sm text-foreground">{value}</Text>
        <DatePicker.TriggerIndicator />
      </DatePicker.Trigger>
      <Text className="px-1 text-xs text-muted">Tap the trigger to cycle demo state.</Text>
    </DatePicker>
  );
}
