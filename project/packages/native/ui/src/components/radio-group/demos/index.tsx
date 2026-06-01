import { useState } from "react";
import { View } from "react-native";

import { Button, Card, Radio, RadioGroup, Surface, Text } from "../..";

const deliveryOptions = [
  { label: "Standard", value: "standard" },
  { label: "Express", value: "express" },
  { label: "Pickup", value: "pickup" },
];

function GroupOptions({
  disabledValue,
  horizontal = false,
  invalid = false,
  onValueChange,
  value,
  variant,
}: {
  disabledValue?: string;
  horizontal?: boolean;
  invalid?: boolean;
  onValueChange: (value: string) => void;
  value: string | undefined;
  variant?: "primary" | "secondary";
}) {
  return (
    <RadioGroup
      className={horizontal ? "flex-row gap-6" : "gap-3"}
      isInvalid={invalid}
      onValueChange={onValueChange}
      value={value}
      variant={variant}
    >
      {deliveryOptions.map((option) => (
        <RadioGroup.Item
          isDisabled={disabledValue === option.value}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup>
  );
}

export function Basic() {
  const [value, setValue] = useState("standard");

  return <GroupOptions onValueChange={setValue} value={value} />;
}

export function Controlled() {
  const [value, setValue] = useState("express");

  return (
    <View className="gap-3">
      <GroupOptions onValueChange={setValue} value={value} />
      <Text className="text-sm text-muted">Selected: {value}</Text>
    </View>
  );
}

export function CustomIndicator() {
  const [value, setValue] = useState("standard");

  return (
    <RadioGroup className="gap-3" onValueChange={setValue} value={value}>
      {deliveryOptions.map((option) => (
        <RadioGroup.Item key={option.value} value={option.value}>
          {({ isSelected }) => (
            <>
              <Text className="text-base text-foreground">{option.label}</Text>
              <Radio>
                <Radio.Indicator className="size-7 rounded-full border border-accent bg-default">
                  <Radio.IndicatorThumb
                    className={isSelected ? "size-3 rounded-full bg-accent" : "size-0"}
                    isAnimatedStyleActive={false}
                  />
                </Radio.Indicator>
              </Radio>
            </>
          )}
        </RadioGroup.Item>
      ))}
    </RadioGroup>
  );
}

export function CustomRenderFunction() {
  const [value, setValue] = useState("pickup");

  return (
    <RadioGroup className="gap-3" onValueChange={setValue} value={value}>
      {deliveryOptions.map((option) => (
        <RadioGroup.Item key={option.value} value={option.value}>
          {({ isSelected }) => (
            <Card className="w-full flex-row items-center justify-between gap-3 p-3">
              <View>
                <Text className="text-base font-medium text-foreground">{option.label}</Text>
                <Text className="text-sm text-muted">
                  {isSelected ? "Selected option" : "Tap to select"}
                </Text>
              </View>
              <Radio />
            </Card>
          )}
        </RadioGroup.Item>
      ))}
    </RadioGroup>
  );
}

export function DeliveryAndPayment() {
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("card");

  return (
    <View className="w-full max-w-sm gap-6">
      <View className="gap-3">
        <Text className="text-base font-semibold text-foreground">Delivery</Text>
        <GroupOptions onValueChange={setDelivery} value={delivery} />
      </View>
      <View className="gap-3">
        <Text className="text-base font-semibold text-foreground">Payment</Text>
        <RadioGroup onValueChange={setPayment} value={payment}>
          <RadioGroup.Item value="card">Card</RadioGroup.Item>
          <RadioGroup.Item value="wallet">Wallet</RadioGroup.Item>
          <RadioGroup.Item value="cash">Cash</RadioGroup.Item>
        </RadioGroup>
      </View>
    </View>
  );
}

export function Disabled() {
  const [value, setValue] = useState("standard");

  return <GroupOptions disabledValue="express" onValueChange={setValue} value={value} />;
}

export function Horizontal() {
  const [value, setValue] = useState("standard");

  return <GroupOptions horizontal onValueChange={setValue} value={value} />;
}

export function OnSurface() {
  const [value, setValue] = useState("standard");

  return (
    <Surface className="w-full max-w-sm rounded-3xl p-4" variant="secondary">
      <GroupOptions onValueChange={setValue} value={value} variant="secondary" />
    </Surface>
  );
}

export function Uncontrolled() {
  const [value, setValue] = useState("standard");

  return <GroupOptions onValueChange={setValue} value={value} />;
}

export function Validation() {
  const [value, setValue] = useState<string | undefined>(undefined);
  const invalid = value === undefined;

  return (
    <View className="gap-3">
      <GroupOptions invalid={invalid} onValueChange={setValue} value={value} />
      {invalid ? <Text className="text-sm text-danger">Choose a delivery method.</Text> : null}
      <Button className="self-start" size="sm">
        Continue
      </Button>
    </View>
  );
}

export function Variants() {
  const [primary, setPrimary] = useState("standard");
  const [secondary, setSecondary] = useState("express");

  return (
    <View className="gap-6">
      <GroupOptions onValueChange={setPrimary} value={primary} variant="primary" />
      <GroupOptions onValueChange={setSecondary} value={secondary} variant="secondary" />
    </View>
  );
}
