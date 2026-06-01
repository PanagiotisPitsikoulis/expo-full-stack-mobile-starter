import { View } from "react-native";

import { BottomSheet, Button, Text } from "../..";

export function Basic() {
  return (
    <BottomSheet isDefaultOpen>
      <BottomSheet.Trigger>
        <Button>Open sheet</Button>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content snapPoints={["35%"]}>
          <View className="gap-3">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1">
                <BottomSheet.Title>Profile</BottomSheet.Title>
                <BottomSheet.Description>Update visible account details.</BottomSheet.Description>
              </View>
              <BottomSheet.Close accessibilityLabel="Close profile sheet" />
            </View>
            <Button className="w-full">Save changes</Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

export function Closed() {
  return (
    <BottomSheet>
      <BottomSheet.Trigger>
        <Button variant="secondary">Open actions</Button>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content snapPoints={["30%"]}>
          <View className="gap-3">
            <BottomSheet.Title>Actions</BottomSheet.Title>
            <Text className="text-sm text-muted">
              This sheet starts closed and opens from trigger.
            </Text>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
