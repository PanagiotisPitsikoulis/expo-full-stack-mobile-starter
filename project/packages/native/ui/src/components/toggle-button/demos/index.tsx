import { useState } from "react";
import { View } from "react-native";

import { Text, ToggleButton } from "../..";

export function Basic() {
  return <ToggleButton>Like</ToggleButton>;
}

export function Controlled() {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <View className="gap-3">
      <ToggleButton isSelected={isSelected} onChange={setIsSelected}>
        {({ isSelected: selected }) => (selected ? "Liked" : "Like")}
      </ToggleButton>
      <Text className="text-sm text-muted">Status: {isSelected ? "Selected" : "Not selected"}</Text>
    </View>
  );
}

export function Sizes() {
  return (
    <View className="flex-row items-center gap-3">
      <ToggleButton size="sm">Small</ToggleButton>
      <ToggleButton size="md">Medium</ToggleButton>
      <ToggleButton size="lg">Large</ToggleButton>
    </View>
  );
}

export function Variants() {
  return (
    <View className="flex-row items-center gap-3">
      <ToggleButton>Default</ToggleButton>
      <ToggleButton variant="ghost">Ghost</ToggleButton>
    </View>
  );
}
