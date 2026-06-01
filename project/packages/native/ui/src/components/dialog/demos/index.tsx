import { View } from "react-native";

import { Button, Dialog } from "../..";

export function Basic() {
  return (
    <Dialog isDefaultOpen>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <View className="gap-4">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1">
                <Dialog.Title>Delete workout?</Dialog.Title>
                <Dialog.Description>
                  This removes the workout from your history. This action cannot be undone.
                </Dialog.Description>
              </View>
              <Dialog.Close accessibilityLabel="Close dialog" />
            </View>
            <View className="flex-row justify-end gap-2">
              <Dialog.Close accessibilityLabel="Cancel delete" />
              <Button variant="danger">Delete</Button>
            </View>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export function NotSwipeable() {
  return (
    <Dialog isDefaultOpen>
      <Dialog.Trigger>
        <Button variant="secondary">Open settings</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content isSwipeable={false}>
          <View className="gap-2">
            <Dialog.Title>Settings saved</Dialog.Title>
            <Dialog.Description>Your preferences have been updated.</Dialog.Description>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
