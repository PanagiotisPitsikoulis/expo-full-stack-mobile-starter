import { Button, HoverCard, Text } from "../..";

export function Basic() {
  return (
    <HoverCard>
      <HoverCard.Trigger>
        <Button variant="secondary">Profile</Button>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <Text className="text-sm font-medium text-foreground">Pitsi UI</Text>
        <Text className="text-xs text-muted">Native primitives and app templates.</Text>
      </HoverCard.Content>
    </HoverCard>
  );
}

export { Basic as Controlled, Basic as Delays, Basic as Placements };
