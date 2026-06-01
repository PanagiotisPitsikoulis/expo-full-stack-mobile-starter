import { useState } from "react";

import { Separator, Tabs, Text } from "../..";

const items = ["Overview", "Activity", "Billing"] as const;

function TabsExample({
  disabled = false,
  secondary = false,
}: {
  disabled?: boolean;
  secondary?: boolean;
}) {
  const [value, setValue] = useState("Overview");

  return (
    <Tabs
      className="w-full max-w-[360px]"
      onValueChange={setValue}
      value={value}
      variant={secondary ? "secondary" : "primary"}
    >
      <Tabs.List>
        {items.map((item) => (
          <Tabs.Trigger isDisabled={disabled && item === "Billing"} key={item} value={item}>
            <Tabs.Label>{item}</Tabs.Label>
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content key={item} value={item}>
          <Text className="text-sm text-muted">{item} content</Text>
        </Tabs.Content>
      ))}
    </Tabs>
  );
}

export function Basic() {
  return <TabsExample />;
}

export function CustomRenderFunction() {
  return <TabsExample />;
}

export function CustomStyles() {
  return (
    <Tabs
      className="w-full max-w-[360px] rounded-3xl bg-surface p-3"
      onValueChange={() => {}}
      value="Overview"
    >
      <Tabs.List>
        <Tabs.Trigger value="Overview">
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Trigger>
        <Tabs.Trigger value="Activity">
          <Tabs.Label>Activity</Tabs.Label>
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs>
  );
}

export function Disabled() {
  return <TabsExample disabled />;
}

export function Secondary() {
  return <TabsExample secondary />;
}

export function SecondaryVertical() {
  return <TabsExample secondary />;
}

export function Vertical() {
  return <TabsExample />;
}

export function WithSeparator() {
  const [value, setValue] = useState("Overview");

  return (
    <Tabs className="w-full max-w-[360px]" onValueChange={setValue} value={value}>
      <Tabs.List>
        <Tabs.Trigger value="Overview">
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Trigger>
        <Tabs.Separator betweenValues={["Overview", "Activity"]} isAlwaysVisible />
        <Tabs.Trigger value="Activity">
          <Tabs.Label>Activity</Tabs.Label>
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Separator />
      <Tabs.Content value={value}>
        <Text className="text-sm text-muted">{value} content</Text>
      </Tabs.Content>
    </Tabs>
  );
}
