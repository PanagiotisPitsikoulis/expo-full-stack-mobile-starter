import { View } from "react-native";

import { Field, Input } from "../..";

export function Default() {
  return (
    <Field className="w-80" required>
      <Field.Label>Email</Field.Label>
      <Field.Control>
        <Input keyboardType="email-address" placeholder="you@example.com" />
      </Field.Control>
      <Field.Description>We will never share your email.</Field.Description>
    </Field>
  );
}

export function Invalid() {
  return (
    <View className="w-80">
      <Field invalid required>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <Input keyboardType="email-address" placeholder="you@example.com" />
        </Field.Control>
        <Field.Error>Please enter a valid email address.</Field.Error>
      </Field>
    </View>
  );
}
