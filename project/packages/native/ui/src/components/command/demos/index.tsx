import { useState } from "react";
import { View } from "react-native";

import { Command, Text } from "../..";

export function Default() {
  const [selected, setSelected] = useState("No command selected");

  return (
    <View className="gap-3">
      <Command>
        <Command.Input placeholder="Search commands..." />
        <Command.List>
          <Command.Empty>No command found.</Command.Empty>
          <Command.Group heading="Actions">
            <Command.Item onSelect={setSelected} value="new-file">
              New file
              <Command.Shortcut>N</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={setSelected} value="open-search">
              Open search
              <Command.Shortcut>S</Command.Shortcut>
            </Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Navigation">
            <Command.Item onSelect={setSelected} value="settings">
              Settings
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
      <Text className="text-sm text-muted">Selected: {selected}</Text>
    </View>
  );
}
