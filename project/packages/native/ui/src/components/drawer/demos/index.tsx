import { Button, Drawer } from "../..";

export function Basic() {
  return (
    <Drawer>
      <Drawer.Trigger>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog>
            <Drawer.Handle />
            <Drawer.Header>
              <Drawer.Heading>Drawer title</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>Drawer body content.</Drawer.Body>
            <Drawer.Footer>
              <Drawer.CloseTrigger />
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export { Basic as Placements };
