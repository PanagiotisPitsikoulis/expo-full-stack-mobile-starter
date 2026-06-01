import { View } from "react-native";

import { Button, ButtonGroup } from "../..";

export function Basic() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Day</Button>
      <ButtonGroup.Separator />
      <Button variant="secondary">Week</Button>
      <ButtonGroup.Separator />
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  );
}

export function Orientation() {
  return (
    <View className="flex-row gap-8">
      <ButtonGroup.Root orientation="vertical">
        <Button variant="secondary">First</Button>
        <ButtonGroup.Separator />
        <Button variant="secondary">Second</Button>
        <ButtonGroup.Separator />
        <Button variant="secondary">Third</Button>
      </ButtonGroup.Root>
      <ButtonGroup>
        <Button size="sm" variant="tertiary">
          S
        </Button>
        <ButtonGroup.Separator />
        <Button size="sm" variant="tertiary">
          M
        </Button>
        <ButtonGroup.Separator />
        <Button size="sm" variant="tertiary">
          L
        </Button>
      </ButtonGroup>
    </View>
  );
}
