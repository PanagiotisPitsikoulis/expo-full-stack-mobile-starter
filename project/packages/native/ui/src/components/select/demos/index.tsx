import { View } from "react-native";

import { Button, Select } from "../..";

const plans = [
  { value: "starter", label: "Starter", description: "For personal projects" },
  { value: "team", label: "Team", description: "For shared workspaces" },
  { value: "enterprise", label: "Enterprise", description: "For advanced controls" },
];

export function Basic() {
  return (
    <Select defaultValue={{ value: "team", label: "Team" }} isDefaultOpen>
      <Select.Trigger className="w-full max-w-[320px]">
        <Select.Value placeholder="Choose plan" />
        <Select.TriggerIndicator />
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay />
        <Select.Content presentation="popover" width="trigger">
          <Select.ListLabel>Plans</Select.ListLabel>
          {plans.map((plan) => (
            <Select.Item key={plan.value} label={plan.label} value={plan.value}>
              <View className="flex-1">
                <Select.ItemLabel />
                <Select.ItemDescription>{plan.description}</Select.ItemDescription>
              </View>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

export function DialogPresentation() {
  return (
    <Select
      defaultValue={{ value: "starter", label: "Starter" }}
      isDefaultOpen
      presentation="dialog"
    >
      <Select.Trigger className="w-full max-w-[320px]">
        <Select.Value placeholder="Choose plan" />
        <Select.TriggerIndicator />
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay className="bg-backdrop" />
        <Select.Content presentation="dialog">
          <View className="flex-row items-center justify-between">
            <Select.ListLabel>Plans</Select.ListLabel>
            <Select.Close accessibilityLabel="Close plan select" />
          </View>
          {plans.map((plan) => (
            <Select.Item key={plan.value} label={plan.label} value={plan.value}>
              <View className="flex-1">
                <Select.ItemLabel />
                <Select.ItemDescription>{plan.description}</Select.ItemDescription>
              </View>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

export function Disabled() {
  return (
    <Select defaultValue={{ value: "starter", label: "Starter" }} isDisabled>
      <Select.Trigger className="w-full max-w-[320px]">
        <Select.Value placeholder="Choose plan" />
        <Select.TriggerIndicator />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content presentation="popover">
          <Select.Item label="Starter" value="starter" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

export function TriggerOnly() {
  return (
    <Select>
      <Select.Trigger asChild>
        <Button variant="secondary">Open select</Button>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content presentation="popover">
          <Select.Item label="Starter" value="starter" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}
