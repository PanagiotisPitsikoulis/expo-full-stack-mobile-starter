import { useState } from "react";
import { View } from "react-native";

import { Description, Label, NumberField, Surface, Text } from "../..";

export function Basic() {
  return (
    <NumberField className="w-full max-w-64" defaultValue={1024} minValue={0}>
      <Label>Width</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
}

export function Controlled() {
  const [value, setValue] = useState(10);

  return (
    <View className="gap-2">
      <NumberField value={value} minValue={0} onChange={(nextValue) => setValue(nextValue ?? 0)}>
        <Label>Quantity</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>
      <Text className="text-sm text-muted">Current value: {value}</Text>
    </View>
  );
}

export function Disabled() {
  return (
    <NumberField isDisabled defaultValue={1024} minValue={0}>
      <Label>Width</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
      <Description>This field cannot be edited</Description>
    </NumberField>
  );
}

export function FullWidth() {
  return (
    <NumberField fullWidth defaultValue={1024} minValue={0}>
      <Label>Width</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
}

export function OnSurface() {
  return (
    <Surface className="w-full max-w-72 rounded-3xl p-4">
      <NumberField defaultValue={1024} minValue={0} variant="secondary">
        <Label>Width</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>
    </Surface>
  );
}

export function WithStep() {
  return (
    <NumberField defaultValue={0} maxValue={100} minValue={0} step={5}>
      <Label>Step: 5</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
}

export function Variants() {
  return (
    <View className="gap-4">
      <Basic />
      <OnSurface />
    </View>
  );
}

export {
  Basic as CustomIcons,
  Basic as CustomRenderFunction,
  Basic as FormExample,
  Basic as Required,
  Basic as Validation,
  Basic as WithChevrons,
  Basic as WithDescription,
  Basic as WithFormatOptions,
  Basic as WithValidation,
};
