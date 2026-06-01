import { useState } from "react";
import { View } from "react-native";

import { ControlField, Text } from "../..";

export function Basic() {
  const [selected, setSelected] = useState(true);

  return (
    <ControlField isSelected={selected} onSelectedChange={setSelected}>
      <ControlField.Indicator />
      <Text className="text-base text-foreground">Enable sync</Text>
    </ControlField>
  );
}

export function Variants() {
  const [newsletter, setNewsletter] = useState(true);
  const [plan, setPlan] = useState(false);
  const [offline, setOffline] = useState(true);

  return (
    <View className="gap-4">
      <ControlField isSelected={newsletter} onSelectedChange={setNewsletter}>
        <ControlField.Indicator variant="checkbox" />
        <Text className="text-base text-foreground">Weekly newsletter</Text>
      </ControlField>
      <ControlField isSelected={plan} onSelectedChange={setPlan}>
        <ControlField.Indicator variant="radio" />
        <Text className="text-base text-foreground">Starter plan</Text>
      </ControlField>
      <ControlField isSelected={offline} onSelectedChange={setOffline}>
        <ControlField.Indicator variant="switch" />
        <Text className="text-base text-foreground">Offline mode</Text>
      </ControlField>
    </View>
  );
}

export function States() {
  return (
    <View className="gap-4">
      <ControlField isDisabled isSelected>
        <ControlField.Indicator />
        <Text className="text-base text-muted">Disabled selected</Text>
      </ControlField>
      <ControlField isInvalid isSelected={false}>
        <ControlField.Indicator variant="checkbox" />
        <Text className="text-base text-danger">Invalid choice</Text>
      </ControlField>
    </View>
  );
}
