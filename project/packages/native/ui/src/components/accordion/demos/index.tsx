import { View } from "react-native";

import { Accordion, Text } from "../..";

export function Basic() {
  return (
    <Accordion className="w-full max-w-[380px]" defaultValue="profile">
      <Accordion.Item value="profile">
        <Accordion.Trigger>
          <Text className="flex-1 text-base font-medium text-foreground">Profile</Text>
          <Accordion.Indicator />
        </Accordion.Trigger>
        <Accordion.Content>
          <Text className="text-sm text-muted">Name, avatar, and account preferences.</Text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="security">
        <Accordion.Trigger>
          <Text className="flex-1 text-base font-medium text-foreground">Security</Text>
          <Accordion.Indicator />
        </Accordion.Trigger>
        <Accordion.Content>
          <Text className="text-sm text-muted">Password, sessions, and two-factor settings.</Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export function Surface() {
  return (
    <Accordion className="w-full max-w-[380px]" defaultValue="sync" variant="surface">
      <Accordion.Item value="sync">
        <Accordion.Trigger>
          <Text className="flex-1 text-base font-medium text-foreground">Sync</Text>
          <Accordion.Indicator />
        </Accordion.Trigger>
        <Accordion.Content>
          <Text className="text-sm text-muted">Keep data available across devices.</Text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="exports">
        <Accordion.Trigger>
          <Text className="flex-1 text-base font-medium text-foreground">Exports</Text>
          <Accordion.Indicator />
        </Accordion.Trigger>
        <Accordion.Content>
          <Text className="text-sm text-muted">Download backups as JSON or CSV files.</Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export function Multiple() {
  return (
    <Accordion
      className="w-full max-w-[380px]"
      defaultValue={["nutrition", "training"]}
      selectionMode="multiple"
    >
      <Accordion.Item value="nutrition">
        <Accordion.Trigger>
          <Text className="flex-1 text-base font-medium text-foreground">Nutrition</Text>
          <Accordion.Indicator />
        </Accordion.Trigger>
        <Accordion.Content>
          <Text className="text-sm text-muted">Meals, macros, water, and targets.</Text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="training">
        <Accordion.Trigger>
          <Text className="flex-1 text-base font-medium text-foreground">Training</Text>
          <Accordion.Indicator />
        </Accordion.Trigger>
        <Accordion.Content>
          <Text className="text-sm text-muted">Workouts, templates, and performance history.</Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export function DisabledItem() {
  return (
    <View className="w-full max-w-[380px]">
      <Accordion defaultValue="available" variant="surface">
        <Accordion.Item value="available">
          <Accordion.Trigger>
            <Text className="flex-1 text-base font-medium text-foreground">Available</Text>
            <Accordion.Indicator />
          </Accordion.Trigger>
          <Accordion.Content>
            <Text className="text-sm text-muted">This panel can be toggled.</Text>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item isDisabled value="locked">
          <Accordion.Trigger>
            <Text className="flex-1 text-base font-medium text-muted">Locked</Text>
            <Accordion.Indicator />
          </Accordion.Trigger>
          <Accordion.Content>
            <Text className="text-sm text-muted">This panel is disabled.</Text>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </View>
  );
}
