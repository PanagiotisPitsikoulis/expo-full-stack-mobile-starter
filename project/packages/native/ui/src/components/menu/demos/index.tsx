import { Button, Menu, SubMenu, Text } from "../..";

export function Basic() {
  return (
    <Menu isDefaultOpen>
      <Menu.Trigger>
        <Button>Open menu</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content presentation="popover" width={220}>
          <Menu.Label>Workspace</Menu.Label>
          <Menu.Item>
            <Menu.ItemTitle>Rename</Menu.ItemTitle>
            <Menu.ItemDescription>Change display name</Menu.ItemDescription>
          </Menu.Item>
          <Menu.Item variant="danger">
            <Menu.ItemTitle>Delete</Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}

export function SelectableGroup() {
  return (
    <Menu isDefaultOpen>
      <Menu.Trigger>
        <Button variant="secondary">Sort</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content presentation="popover" width={230}>
          <Menu.Group defaultSelectedKeys={["recent"]} selectionMode="single">
            <Menu.Item id="recent">
              <Menu.ItemTitle>Most recent</Menu.ItemTitle>
              <Menu.ItemIndicator />
            </Menu.Item>
            <Menu.Item id="name">
              <Menu.ItemTitle>Name</Menu.ItemTitle>
              <Menu.ItemIndicator />
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}

export function WithSubMenu() {
  return (
    <Menu isDefaultOpen presentation="popover">
      <Menu.Trigger>
        <Button variant="secondary">More</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content presentation="popover" width={240}>
          <Menu.Item>
            <Menu.ItemTitle>Duplicate</Menu.ItemTitle>
          </Menu.Item>
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
