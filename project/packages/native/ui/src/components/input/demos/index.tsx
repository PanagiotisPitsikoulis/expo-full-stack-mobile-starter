import { useState } from "react";
import { View } from "react-native";

import { Input, Label, Surface, Text } from "../..";

export function Basic() {
  return (
    <Input
      accessibilityLabel="Name"
      className="w-64"
      placeholder="Enter your name"
      textContentType="name"
    />
  );
}

export function Controlled() {
  const [value, setValue] = useState("pitsiui.com");

  return (
    <View className="w-80 gap-2">
      <Input
        accessibilityLabel="Domain"
        onChangeText={setValue}
        placeholder="domain"
        value={value}
      />
      <Text className="px-1 text-sm text-muted">https://{value || "your-domain"}</Text>
    </View>
  );
}

export function FullWidth() {
  return (
    <View className="w-[400px] max-w-full gap-3">
      <Input className="w-full" placeholder="Full width input" />
    </View>
  );
}

export function OnSurface() {
  return (
    <Surface className="h-[180px] w-[280px] items-center justify-center rounded-3xl bg-surface p-4">
      <Input className="w-full" placeholder="Your name" variant="secondary" />
    </Surface>
  );
}

export function Types() {
  return (
    <View className="w-80 gap-4">
      <View className="gap-1">
        <Label>Email</Label>
        <Input
          keyboardType="email-address"
          placeholder="jane@example.com"
          textContentType="emailAddress"
        />
      </View>
      <View className="gap-1">
        <Label>Age</Label>
        <Input keyboardType="number-pad" placeholder="30" />
      </View>
      <View className="gap-1">
        <Label>Password</Label>
        <Input placeholder="Password" secureTextEntry textContentType="password" />
      </View>
    </View>
  );
}

export function Variants() {
  return (
    <View className="w-[240px] gap-2">
      <Input className="w-full" placeholder="Primary input" variant="primary" />
      <Input className="w-full" placeholder="Secondary input" variant="secondary" />
    </View>
  );
}
