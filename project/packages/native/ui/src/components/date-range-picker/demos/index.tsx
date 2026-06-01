import { Text } from "@pitsi-ui/native";
import { DateRangePicker } from "@pitsi-ui/native/date-range-picker";
import { useState } from "react";

const ranges: [string, string][] = [
  ["2026-05-27", "2026-06-02"],
  ["2026-06-03", "2026-06-09"],
  ["2026-06-10", "2026-06-16"],
];
const fallbackRange: [string, string] = ["2026-05-27", "2026-06-02"];

export function Basic() {
  return (
    <DateRangePicker className="w-80">
      <DateRangePicker.Trigger>
        <Text className="text-sm text-foreground">2026-05-27</Text>
        <DateRangePicker.RangeSeparator />
        <Text className="text-sm text-foreground">2026-06-02</Text>
        <DateRangePicker.TriggerIndicator />
      </DateRangePicker.Trigger>
    </DateRangePicker>
  );
}

export function ControlledTrigger() {
  const [index, setIndex] = useState(0);
  const [start, end] = ranges[index] ?? fallbackRange;

  return (
    <DateRangePicker className="w-80">
      <DateRangePicker.Trigger onAction={() => setIndex((index + 1) % ranges.length)}>
        <Text className="text-sm text-foreground">{start}</Text>
        <DateRangePicker.RangeSeparator />
        <Text className="text-sm text-foreground">{end}</Text>
        <DateRangePicker.TriggerIndicator />
      </DateRangePicker.Trigger>
      <Text className="px-1 text-xs text-muted">Tap the trigger to cycle demo state.</Text>
    </DateRangePicker>
  );
}

export function WithPopover() {
  return (
    <DateRangePicker className="w-80">
      <DateRangePicker.Trigger>
        <Text className="text-sm text-foreground">This week</Text>
        <DateRangePicker.TriggerIndicator />
      </DateRangePicker.Trigger>
      <DateRangePicker.Popover>
        <Text className="text-sm text-muted">Render native range calendar content here.</Text>
      </DateRangePicker.Popover>
    </DateRangePicker>
  );
}
