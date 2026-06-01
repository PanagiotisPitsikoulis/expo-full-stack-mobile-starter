import { useState } from "react";
import { View } from "react-native";

import { Switch, SwitchGroup, Text } from "../..";

function SwitchRow({ label }: { label: string }) {
  const [selected, setSelected] = useState(false);

  return (
    <View className="flex-row items-center gap-3">
      <Switch isSelected={selected} onSelectedChange={setSelected} />
      <Text className="text-sm text-foreground">{label}</Text>
    </View>
  );
}

export function Default() {
  return (
    <SwitchGroup label="Notifications" orientation="vertical">
      <SwitchRow label="Email" />
      <SwitchRow label="SMS" />
      <SwitchRow label="Push" />
    </SwitchGroup>
  );
}

export { Default as Basic };
