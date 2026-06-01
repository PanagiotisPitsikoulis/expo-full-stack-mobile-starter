import { View } from "react-native";

import { Description, Input, Label } from "../..";

export function Basic() {
  return (
    <View className="gap-1">
      <Label nativeID="email-label">Email</Label>
      <Input
        accessibilityLabelledBy="email-label"
        className="w-64"
        keyboardType="email-address"
        placeholder="you@example.com"
        textContentType="emailAddress"
      />
      <Description nativeID="email-description">
        We'll never share your email with anyone else.
      </Description>
    </View>
  );
}
