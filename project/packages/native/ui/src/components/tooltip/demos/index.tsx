import { Button, Tooltip } from "../..";

export function Basic() {
  return (
    <Tooltip defaultOpen>
      <Button variant="secondary">Press me</Button>
      <Tooltip.Content>This is a tooltip</Tooltip.Content>
    </Tooltip>
  );
}

export function WithArrow() {
  return (
    <Tooltip defaultOpen>
      <Tooltip.Trigger accessibilityLabel="Show tooltip">
        <Button variant="secondary">With arrow</Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        Tooltip with arrow indicator
      </Tooltip.Content>
    </Tooltip>
  );
}
