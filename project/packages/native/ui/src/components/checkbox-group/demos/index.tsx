import { useState } from "react";
import { View } from "react-native";

import { Checkbox, CheckboxGroup, Description, Label, Text } from "../..";

function CheckboxRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox value={value}>
        <Checkbox.Indicator />
      </Checkbox>
      <Label>{label}</Label>
    </View>
  );
}

export function Basic() {
  return (
    <CheckboxGroup defaultValue={["coding"]} name="interests">
      <Label>Select your interests</Label>
      <Description>Choose all that apply</Description>
      <CheckboxRow label="Coding" value="coding" />
      <CheckboxRow label="Design" value="design" />
      <CheckboxRow label="Writing" value="writing" />
    </CheckboxGroup>
  );
}

export function Controlled() {
  const [selected, setSelected] = useState(["coding", "design"]);

  return (
    <View className="gap-3">
      <CheckboxGroup value={selected} onChange={setSelected}>
        <CheckboxRow label="Coding" value="coding" />
        <CheckboxRow label="Design" value="design" />
        <CheckboxRow label="Writing" value="writing" />
      </CheckboxGroup>
      <Text className="text-sm text-muted">Selected: {selected.join(", ") || "None"}</Text>
    </View>
  );
}

export {
  Basic as CustomRenderFunction,
  Basic as Disabled,
  Basic as FeaturesAndAddOns,
  Basic as Indeterminate,
  Basic as OnSurface,
  Basic as Validation,
  Basic as WithCustomIndicator,
};
