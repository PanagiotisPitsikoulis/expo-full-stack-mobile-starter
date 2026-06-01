import { View } from "react-native";

import { Kbd, Surface, Text } from "../..";

function Shortcut({ keys }: { keys: string[] }) {
  return (
    <View className="flex-row items-center gap-1">
      {keys.map((key) => (
        <Kbd key={key}>
          <Kbd.Content>{key}</Kbd.Content>
        </Kbd>
      ))}
    </View>
  );
}

export function Basic() {
  return (
    <View className="flex-row flex-wrap items-center gap-4">
      <Shortcut keys={["Cmd", "K"]} />
      <Shortcut keys={["Shift", "P"]} />
      <Shortcut keys={["Ctrl", "C"]} />
      <Shortcut keys={["Opt", "D"]} />
    </View>
  );
}

export function InlineUsage() {
  return (
    <View className="gap-4">
      <Text className="text-sm">Press Esc to close the dialog.</Text>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">Use</Text>
        <Shortcut keys={["Cmd", "K"]} />
        <Text className="text-sm">to open the command palette.</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">Navigate with</Text>
        <Shortcut keys={["Up", "Down"]} />
      </View>
    </View>
  );
}

export function InstructionalText() {
  return (
    <Surface className="gap-3 rounded-lg p-4">
      <Text className="text-sm font-semibold">Quick Actions</Text>
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm">Open search:</Text>
          <Shortcut keys={["Cmd", "K"]} />
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm">Toggle sidebar:</Text>
          <Shortcut keys={["Cmd", "B"]} />
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm">New file:</Text>
          <Shortcut keys={["Cmd", "N"]} />
        </View>
      </View>
    </Surface>
  );
}

export function NavigationKeys() {
  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-2">
        <Text className="text-sm text-muted">Arrow Keys:</Text>
        <Shortcut keys={["Up", "Down", "Left", "Right"]} />
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm text-muted">Page Navigation:</Text>
        <Shortcut keys={["PgUp", "PgDn", "Home", "End"]} />
      </View>
    </View>
  );
}

export function SpecialKeys() {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">Press</Text>
        <Shortcut keys={["Enter"]} />
        <Text className="text-sm">to confirm.</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">Use</Text>
        <Shortcut keys={["Tab"]} />
        <Text className="text-sm">to navigate fields.</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">Hold</Text>
        <Shortcut keys={["Space"]} />
        <Text className="text-sm">to pan.</Text>
      </View>
    </View>
  );
}

export function Variants() {
  const rows = [
    ["Copy", "C"],
    ["Paste", "V"],
    ["Cut", "X"],
    ["Undo", "Z"],
  ] as const;

  return (
    <View className="gap-4">
      {rows.map(([label, key]) => (
        <View className="flex-row items-center gap-2" key={label}>
          <Text>{label}:</Text>
          <Shortcut keys={["Cmd", key]} />
          <Kbd className="bg-transparent border border-border">
            <Kbd.Content>{key}</Kbd.Content>
          </Kbd>
        </View>
      ))}
    </View>
  );
}
