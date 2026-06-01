import { useState } from "react";
import { View } from "react-native";

import { Label, Surface, Text, TextArea } from "../..";

export function Basic() {
  return <TextArea className="w-full max-w-sm" placeholder="Write a note" />;
}

export function Controlled() {
  const [value, setValue] = useState("Project kickoff notes");

  return (
    <View className="w-full max-w-sm gap-2">
      <TextArea onChangeText={setValue} placeholder="Write a note" value={value} />
      <Text className="text-sm text-muted">{value.length} characters</Text>
    </View>
  );
}

export function FullWidth() {
  return (
    <View className="w-full">
      <TextArea className="w-full" placeholder="Full width text area" />
    </View>
  );
}

export function OnSurface() {
  return (
    <Surface className="w-full max-w-sm rounded-3xl p-4" variant="secondary">
      <TextArea placeholder="On surface" variant="secondary" />
    </Surface>
  );
}

export function Rows() {
  return (
    <View className="w-full max-w-sm gap-3">
      <TextArea className="h-20" placeholder="Short note" />
      <TextArea className="h-40" placeholder="Longer note" />
    </View>
  );
}

export function Variants() {
  return (
    <View className="w-full max-w-sm gap-3">
      <View className="gap-1">
        <Label>Primary</Label>
        <TextArea placeholder="Primary variant" variant="primary" />
      </View>
      <View className="gap-1">
        <Label>Secondary</Label>
        <TextArea placeholder="Secondary variant" variant="secondary" />
      </View>
    </View>
  );
}
