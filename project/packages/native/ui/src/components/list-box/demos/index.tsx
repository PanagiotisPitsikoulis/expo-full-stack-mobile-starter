import { useState } from "react";
import { View } from "react-native";

import { ListBox, Text } from "../..";

const items = [
  { id: "dashboard", label: "Dashboard" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

export function Basic() {
  return (
    <ListBox defaultSelectedKeys={["dashboard"]}>
      {items.map((item) => (
        <ListBox.Item id={item.id} key={item.id}>
          {item.label}
          <ListBox.ItemIndicator />
        </ListBox.Item>
      ))}
    </ListBox>
  );
}

export function Controlled() {
  const [selectedKeys, setSelectedKeys] = useState(new Set<string | number>(["reports"]));

  return (
    <View className="gap-3">
      <ListBox selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
        {items.map((item) => (
          <ListBox.Item id={item.id} key={item.id}>
            {item.label}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
      <Text className="text-sm text-muted">
        Selected: {Array.from(selectedKeys).join(", ") || "None"}
      </Text>
    </View>
  );
}

export function Sections() {
  return (
    <ListBox selectionMode="multiple">
      <ListBox.Section heading="Primary">
        <ListBox.Item id="home">Home</ListBox.Item>
        <ListBox.Item id="search">Search</ListBox.Item>
      </ListBox.Section>
      <ListBox.Section heading="Account">
        <ListBox.Item id="profile">Profile</ListBox.Item>
        <ListBox.Item id="billing">Billing</ListBox.Item>
      </ListBox.Section>
    </ListBox>
  );
}

export { Basic as Disabled, Basic as MultipleSelection, Basic as WithDescriptions };
