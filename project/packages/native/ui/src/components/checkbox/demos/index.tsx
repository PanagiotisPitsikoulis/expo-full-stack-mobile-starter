import { useState } from "react";
import { Alert, View } from "react-native";

import { Button, Checkbox, Text } from "../..";

function FieldRow({
  children,
  description,
  label,
}: {
  children: React.ReactNode;
  description?: string;
  label: string;
}) {
  return (
    <View className="flex-row items-start gap-3">
      {children}
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-medium text-foreground">{label}</Text>
        {description ? <Text className="text-sm text-muted">{description}</Text> : null}
      </View>
    </View>
  );
}

export function Basic() {
  return <Checkbox accessibilityLabel="Accept terms" />;
}

export function Controlled() {
  const [isSelected, setSelected] = useState(true);

  return (
    <View className="gap-2">
      <FieldRow label={isSelected ? "Notifications enabled" : "Notifications disabled"}>
        <Checkbox
          accessibilityLabel="Toggle notifications"
          isSelected={isSelected}
          onSelectedChange={setSelected}
        />
      </FieldRow>
      <Text className="text-sm text-muted">Selected: {isSelected ? "true" : "false"}</Text>
    </View>
  );
}

export function CustomIndicator() {
  return (
    <Checkbox accessibilityLabel="Custom indicator" isSelected>
      <Checkbox.Indicator className="bg-success">
        <Text className="text-sm font-bold text-white">OK</Text>
      </Checkbox.Indicator>
    </Checkbox>
  );
}

export function CustomRenderFunction() {
  return (
    <Checkbox accessibilityLabel="Render function checkbox" isSelected>
      {({ isSelected }) => (
        <Checkbox.Indicator className={isSelected ? "bg-accent" : "bg-default"}>
          <Text className="text-xs font-bold text-white">{isSelected ? "ON" : "OFF"}</Text>
        </Checkbox.Indicator>
      )}
    </Checkbox>
  );
}

export function CustomStyles() {
  return (
    <Checkbox
      accessibilityLabel="Styled checkbox"
      className="size-8 rounded-2xl border border-accent bg-transparent"
      isSelected
    >
      <Checkbox.Indicator className="rounded-2xl bg-accent" iconProps={{ size: 18 }} />
    </Checkbox>
  );
}

export function DefaultSelected() {
  return <Checkbox accessibilityLabel="Selected checkbox" isSelected />;
}

export function Disabled() {
  return (
    <View className="flex-row gap-4">
      <Checkbox accessibilityLabel="Disabled unchecked checkbox" isDisabled />
      <Checkbox accessibilityLabel="Disabled selected checkbox" isDisabled isSelected />
    </View>
  );
}

export function Form() {
  const [accepts, setAccepts] = useState(false);

  return (
    <View className="w-full max-w-sm gap-4">
      <FieldRow
        description="Required before continuing."
        label="I agree to the terms and privacy policy"
      >
        <Checkbox
          accessibilityLabel="Agree to terms"
          isSelected={accepts}
          onSelectedChange={setAccepts}
        />
      </FieldRow>
      <Button className="self-start" isDisabled={!accepts} onPress={() => Alert.alert("Submitted")}>
        Submit
      </Button>
    </View>
  );
}

export function FullRounded() {
  return (
    <Checkbox accessibilityLabel="Fully rounded checkbox" className="rounded-full" isSelected>
      <Checkbox.Indicator className="rounded-full" />
    </Checkbox>
  );
}

export function Indeterminate() {
  return (
    <Checkbox accessibilityLabel="Indeterminate checkbox" isSelected>
      <Checkbox.Indicator>
        <View className="h-0.5 w-3 rounded-full bg-white" />
      </Checkbox.Indicator>
    </Checkbox>
  );
}

export function Invalid() {
  return <Checkbox accessibilityLabel="Invalid checkbox" isInvalid />;
}

export function RenderProps() {
  return (
    <Checkbox accessibilityLabel="Render props checkbox" isSelected>
      {({ isSelected, isInvalid }) => (
        <Checkbox.Indicator className={isInvalid ? "bg-danger" : "bg-accent"}>
          <Text className="text-xs font-bold text-white">{isSelected ? "OK" : ""}</Text>
        </Checkbox.Indicator>
      )}
    </Checkbox>
  );
}

export function Variants() {
  return (
    <View className="flex-row gap-4">
      <Checkbox accessibilityLabel="Primary checkbox" isSelected variant="primary" />
      <Checkbox accessibilityLabel="Secondary checkbox" isSelected variant="secondary" />
    </View>
  );
}

export function WithDescription() {
  return (
    <FieldRow
      description="You can unsubscribe from product updates at any time."
      label="Subscribe to updates"
    >
      <Checkbox accessibilityLabel="Subscribe to updates" isSelected />
    </FieldRow>
  );
}

export function WithLabel() {
  return (
    <FieldRow label="Remember me">
      <Checkbox accessibilityLabel="Remember me" />
    </FieldRow>
  );
}
