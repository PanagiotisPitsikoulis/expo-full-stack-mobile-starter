import { Avatar, Button, Item } from "../..";

export function Default() {
  return (
    <Item className="w-80 rounded-lg border border-border">
      <Item.Media>
        <Avatar alt="Panagiotis Pitsikoulis">
          <Avatar.Fallback>PA</Avatar.Fallback>
        </Avatar>
      </Item.Media>
      <Item.Content>
        <Item.Title>Panagiotis Pitsikoulis</Item.Title>
        <Item.Description>panagiotis@pitsiui.com</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button size="sm" variant="tertiary">
          View
        </Button>
      </Item.Actions>
    </Item>
  );
}
