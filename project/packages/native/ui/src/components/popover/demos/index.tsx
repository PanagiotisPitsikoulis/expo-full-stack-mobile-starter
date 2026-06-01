import { View } from "react-native";

import { Button, Popover } from "../..";

export function Basic() {
  return (
    <Popover isDefaultOpen>
      <Popover.Trigger>
        <Button>Open popover</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content presentation="popover" width={260}>
          <Popover.Arrow />
          <View className="gap-2">
            <Popover.Title>Quick note</Popover.Title>
            <Popover.Description>
              Keep this surface small and anchored to the triggering control.
            </Popover.Description>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}

export function BottomSheetPresentation() {
  return (
    <Popover isDefaultOpen presentation="bottom-sheet">
      <Popover.Trigger>
        <Button variant="secondary">Open details</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Overlay className="bg-backdrop" />
        <Popover.Content presentation="bottom-sheet" snapPoints={["32%"]}>
          <View className="gap-2">
            <Popover.Title>Details</Popover.Title>
            <Popover.Description>
              Popovers can promote to a bottom sheet on smaller screens.
            </Popover.Description>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
