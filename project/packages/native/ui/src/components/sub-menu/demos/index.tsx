import { Button, Menu, SubMenu, Text } from "../..";

export function Basic() {
  return (
    <Menu isDefaultOpen presentation="popover">
      <Menu.Trigger>
        <Button>Open menu</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content presentation="popover" width={240}>
          <SubMenu isDefaultOpen>
            <SubMenu.Trigger>
              <Text className="flex-1 text-base font-medium text-foreground">Move to</Text>
              <SubMenu.TriggerIndicator />
            </SubMenu.Trigger>
            <SubMenu.Content>
              <Menu.Item>
                <Menu.ItemTitle>Archive</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item>
                <Menu.ItemTitle>Favorites</Menu.ItemTitle>
              </Menu.Item>
            </SubMenu.Content>
          </SubMenu>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}

export function Disabled() {
  return (
    <Menu isDefaultOpen presentation="popover">
      <Menu.Trigger>
        <Button variant="secondary">Open menu</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content presentation="popover" width={240}>
          <SubMenu>
            <SubMenu.Trigger isDisabled>
              <Text className="flex-1 text-base font-medium text-muted">Locked group</Text>
              <SubMenu.TriggerIndicator />
            </SubMenu.Trigger>
            <SubMenu.Content>
              <Menu.Item>
                <Menu.ItemTitle>Hidden option</Menu.ItemTitle>
              </Menu.Item>
            </SubMenu.Content>
          </SubMenu>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}
