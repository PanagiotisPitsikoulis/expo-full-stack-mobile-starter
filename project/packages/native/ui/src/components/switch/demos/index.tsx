import { useState } from "react";
import { Alert, View } from "react-native";

import { Button, Description, Label, Switch, Text } from "../..";

function SwitchRow({
  description,
  label,
  selected = false,
}: {
  description?: string;
  label: string;
  selected?: boolean;
}) {
  const [isSelected, setSelected] = useState(selected);

  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1">
        <Text className="text-base text-foreground">{label}</Text>
        {description ? <Text className="text-sm text-muted">{description}</Text> : null}
      </View>
      <Switch isSelected={isSelected} onSelectedChange={setSelected} />
    </View>
  );
}

export function Basic() {
  const [selected, setSelected] = useState(false);

  return <Switch isSelected={selected} onSelectedChange={setSelected} />;
}

export function Controlled() {
  const [selected, setSelected] = useState(true);

  return (
    <View className="gap-3">
      <Switch isSelected={selected} onSelectedChange={setSelected} />
      <Text className="text-sm text-muted">Enabled: {selected ? "yes" : "no"}</Text>
    </View>
  );
}

export function CustomRenderFunction() {
  const [selected, setSelected] = useState(true);

  return (
    <Switch isSelected={selected} onSelectedChange={setSelected}>
      {({ isSelected }) => (
        <>
          <Switch.StartContent>
            <Text className="text-[10px] font-bold text-muted">0</Text>
          </Switch.StartContent>
          <Switch.EndContent>
            <Text className="text-[10px] font-bold text-accent-foreground">1</Text>
          </Switch.EndContent>
          <Switch.Thumb>
            <Text className="text-[9px] font-bold text-muted">{isSelected ? "Y" : "N"}</Text>
          </Switch.Thumb>
        </>
      )}
    </Switch>
  );
}

export function CustomStyles() {
  const [selected, setSelected] = useState(true);

  return (
    <Switch
      className="h-7 w-14 rounded-full"
      isSelected={selected}
      onSelectedChange={setSelected}
    />
  );
}

export function DefaultSelected() {
  const [selected, setSelected] = useState(true);

  return <Switch isSelected={selected} onSelectedChange={setSelected} />;
}

export function Disabled() {
  return (
    <View className="flex-row items-center gap-4">
      <Switch isDisabled isSelected={false} />
      <Switch isDisabled isSelected />
    </View>
  );
}

export function Form() {
  const [selected, setSelected] = useState(false);

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <Text className="flex-1 text-base text-foreground">Accept terms</Text>
        <Switch isSelected={selected} onSelectedChange={setSelected} />
      </View>
      <Button onPress={() => Alert.alert(selected ? "Submitted" : "Enable first")}>Submit</Button>
    </View>
  );
}

export function Group() {
  return (
    <View className="w-full max-w-sm gap-4">
      <SwitchRow label="Email notifications" selected />
      <SwitchRow label="Push notifications" />
      <SwitchRow label="Weekly summary" />
    </View>
  );
}

export function GroupHorizontal() {
  return (
    <View className="flex-row flex-wrap gap-6">
      <SwitchRow label="Email" selected />
      <SwitchRow label="Push" />
    </View>
  );
}

export function LabelPosition() {
  return (
    <View className="gap-4">
      <SwitchRow label="Label before switch" />
      <View className="flex-row items-center gap-3">
        <Switch isSelected />
        <Text className="text-base text-foreground">Label after switch</Text>
      </View>
    </View>
  );
}

export function RenderProps() {
  return <CustomRenderFunction />;
}

export function Sizes() {
  return (
    <View className="flex-row items-center gap-4">
      <Switch className="scale-75" isSelected />
      <Switch isSelected />
      <Switch className="scale-125" isSelected />
    </View>
  );
}

export function WithDescription() {
  return (
    <View className="gap-1">
      <Label>Marketing emails</Label>
      <SwitchRow
        description="Receive product updates and launch notes."
        label="Subscribe to updates"
      />
      <Description>You can change this later in settings.</Description>
    </View>
  );
}

export function WithIcons() {
  const [selected, setSelected] = useState(true);

  return (
    <Switch isSelected={selected} onSelectedChange={setSelected}>
      <Switch.StartContent>
        <Text className="text-[10px] font-bold text-muted">x</Text>
      </Switch.StartContent>
      <Switch.EndContent>
        <Text className="text-[10px] font-bold text-accent-foreground">ok</Text>
      </Switch.EndContent>
      <Switch.Thumb />
    </Switch>
  );
}

export function WithoutLabel() {
  const [selected, setSelected] = useState(false);

  return (
    <Switch
      accessibilityLabel="Notifications"
      isSelected={selected}
      onSelectedChange={setSelected}
    />
  );
}
