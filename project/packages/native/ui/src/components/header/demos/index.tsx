import { View } from "react-native";

import { Button, Header, Text } from "../..";

export function Default() {
  return (
    <Header className="w-96 flex-row flex-wrap items-start gap-x-6 gap-y-6">
      <View className="flex-1 gap-1">
        <Text className="text-xl font-semibold text-foreground">Project settings</Text>
        <Text className="text-sm text-muted">Manage integrations and team access.</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </View>
    </Header>
  );
}
