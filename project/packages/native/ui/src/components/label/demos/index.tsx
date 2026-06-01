import { View } from "react-native";

import { Input, Label } from "../..";

export function Basic() {
  return (
    <View className="gap-1">
      <Label nativeID="name-label">Name</Label>
      <Input
        accessibilityLabelledBy="name-label"
        className="w-64"
        placeholder="Enter your name"
        textContentType="name"
      />
    </View>
  );
}
