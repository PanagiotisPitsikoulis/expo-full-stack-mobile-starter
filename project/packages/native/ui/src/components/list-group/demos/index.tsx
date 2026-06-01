import { View } from "react-native";

import { Avatar, ListGroup, Text } from "../..";

export function Basic() {
  return (
    <ListGroup className="w-full max-w-[360px]">
      <ListGroup.Item>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>Profile</ListGroup.ItemTitle>
          <ListGroup.ItemDescription>Manage account details</ListGroup.ItemDescription>
        </ListGroup.ItemContent>
        <ListGroup.ItemSuffix />
      </ListGroup.Item>
      <ListGroup.Item>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>Notifications</ListGroup.ItemTitle>
          <ListGroup.ItemDescription>Push and email settings</ListGroup.ItemDescription>
        </ListGroup.ItemContent>
        <ListGroup.ItemSuffix />
      </ListGroup.Item>
    </ListGroup>
  );
}

export function WithPrefixes() {
  return (
    <ListGroup className="w-full max-w-[380px]">
      <ListGroup.Item>
        <ListGroup.ItemPrefix>
          <Avatar accessibilityLabel="Ana profile" alt="Ana profile" color="accent" size="sm">
            <Avatar.Fallback>AP</Avatar.Fallback>
          </Avatar>
        </ListGroup.ItemPrefix>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>Ana Pereira</ListGroup.ItemTitle>
          <ListGroup.ItemDescription>Product design</ListGroup.ItemDescription>
        </ListGroup.ItemContent>
        <ListGroup.ItemSuffix />
      </ListGroup.Item>
      <ListGroup.Item>
        <ListGroup.ItemPrefix>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-success-soft">
            <Text className="text-sm font-semibold text-success-soft-foreground">OK</Text>
          </View>
        </ListGroup.ItemPrefix>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>Workspace active</ListGroup.ItemTitle>
          <ListGroup.ItemDescription>All services are online</ListGroup.ItemDescription>
        </ListGroup.ItemContent>
        <ListGroup.ItemSuffix />
      </ListGroup.Item>
    </ListGroup>
  );
}

export function CustomSuffix() {
  return (
    <ListGroup className="w-full max-w-[360px]" variant="secondary">
      <ListGroup.Item>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>Storage</ListGroup.ItemTitle>
          <ListGroup.ItemDescription>42 GB of 100 GB used</ListGroup.ItemDescription>
        </ListGroup.ItemContent>
        <ListGroup.ItemSuffix>
          <Text className="text-sm font-medium text-muted">42%</Text>
        </ListGroup.ItemSuffix>
      </ListGroup.Item>
      <ListGroup.Item>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>Plan</ListGroup.ItemTitle>
          <ListGroup.ItemDescription>Team workspace</ListGroup.ItemDescription>
        </ListGroup.ItemContent>
        <ListGroup.ItemSuffix>
          <Text className="text-sm font-medium text-accent">Pro</Text>
        </ListGroup.ItemSuffix>
      </ListGroup.Item>
    </ListGroup>
  );
}
