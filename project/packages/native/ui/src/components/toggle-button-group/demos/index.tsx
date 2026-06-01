import { useState } from "react";
import { View } from "react-native";

import { Text, ToggleButton, ToggleButtonGroup } from "../..";

export function Basic() {
  return (
    <ToggleButtonGroup defaultSelectedKeys={["bold"]} selectionMode="multiple">
      <ToggleButton id="bold">Bold</ToggleButton>
      <ToggleButtonGroup.Separator />
      <ToggleButton id="italic">Italic</ToggleButton>
      <ToggleButtonGroup.Separator />
      <ToggleButton id="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
  );
}

export function Controlled() {
  const [selectedKeys, setSelectedKeys] = useState(new Set<string | number>(["center"]));

  return (
    <View className="gap-3">
      <ToggleButtonGroup
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={setSelectedKeys}
      >
        <ToggleButton id="left">Left</ToggleButton>
        <ToggleButton id="center">Center</ToggleButton>
        <ToggleButton id="right">Right</ToggleButton>
      </ToggleButtonGroup>
      <Text className="text-sm text-muted">
        Selected: {Array.from(selectedKeys).join(", ") || "None"}
      </Text>
    </View>
  );
}

export function Orientation() {
  return (
    <View className="gap-4">
      <Basic />
      <ToggleButtonGroup orientation="vertical" selectionMode="multiple">
        <ToggleButton id="one">One</ToggleButton>
        <ToggleButtonGroup.Separator />
        <ToggleButton id="two">Two</ToggleButton>
      </ToggleButtonGroup>
    </View>
  );
}

export {
  Basic as Attached,
  Basic as Disabled,
  Basic as FullWidth,
  Basic as SelectionMode,
  Basic as Sizes,
  Basic as WithoutSeparator,
};
