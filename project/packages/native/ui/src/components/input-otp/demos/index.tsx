import { useState } from "react";
import { Alert, View } from "react-native";

import { Description, FieldError, InputOTP, REGEXP_ONLY_DIGITS, Surface, Text } from "../..";

function Slots({ length = 6, variant }: { length?: number; variant?: "primary" | "secondary" }) {
  return (
    <InputOTP.Group>
      {Array.from({ length }).map((_, index) => (
        <InputOTP.Slot index={index} key={index} variant={variant} />
      ))}
    </InputOTP.Group>
  );
}

function SixDigitOtp(props: Partial<React.ComponentProps<typeof InputOTP>>) {
  return (
    <InputOTP inputMode="numeric" maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...props}>
      <Slots />
    </InputOTP>
  );
}

export function Basic() {
  return <SixDigitOtp defaultValue="12" />;
}

export function Controlled() {
  const [value, setValue] = useState("987");

  return (
    <View className="gap-3">
      <SixDigitOtp onChange={setValue} value={value} />
      <Text className="text-sm text-muted">Code: {value || "empty"}</Text>
    </View>
  );
}

export function Disabled() {
  return <SixDigitOtp defaultValue="123" isDisabled />;
}

export function FormExample() {
  const [value, setValue] = useState("");

  return (
    <View className="gap-3">
      <SixDigitOtp onChange={setValue} value={value} />
      <Description>Enter the 6 digit verification code.</Description>
      <Text className="text-sm text-muted">Ready: {value.length === 6 ? "yes" : "no"}</Text>
    </View>
  );
}

export function FourDigits() {
  return (
    <InputOTP inputMode="numeric" maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
      <Slots length={4} />
    </InputOTP>
  );
}

export function OnComplete() {
  return <SixDigitOtp onComplete={(value) => Alert.alert(`Completed ${value}`)} />;
}

export function OnSurface() {
  return (
    <Surface className="rounded-3xl p-4" variant="secondary">
      <InputOTP inputMode="numeric" maxLength={6} pattern={REGEXP_ONLY_DIGITS} variant="secondary">
        <Slots variant="secondary" />
      </InputOTP>
    </Surface>
  );
}

export function Variants() {
  return (
    <View className="gap-4">
      <InputOTP inputMode="numeric" maxLength={6} pattern={REGEXP_ONLY_DIGITS} variant="primary">
        <Slots variant="primary" />
      </InputOTP>
      <InputOTP inputMode="numeric" maxLength={6} pattern={REGEXP_ONLY_DIGITS} variant="secondary">
        <Slots variant="secondary" />
      </InputOTP>
    </View>
  );
}

export function WithPattern() {
  return <SixDigitOtp />;
}

export function WithValidation() {
  const [value, setValue] = useState("401");
  const isInvalid = value.length > 0 && value.length < 6;

  return (
    <View className="gap-2">
      <SixDigitOtp isInvalid={isInvalid} onChange={setValue} value={value} />
      <FieldError isInvalid={isInvalid}>Enter all 6 digits.</FieldError>
    </View>
  );
}
