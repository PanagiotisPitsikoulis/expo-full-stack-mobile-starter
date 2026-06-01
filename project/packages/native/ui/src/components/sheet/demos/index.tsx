import { Button, Sheet } from "../..";

export function Basic() {
  return (
    <Sheet>
      <Sheet.Trigger>
        <Button>Open sheet</Button>
      </Sheet.Trigger>
      <Sheet.Backdrop>
        <Sheet.Content side="bottom">
          <Sheet.Dialog>
            <Sheet.Header>
              <Sheet.Title>Sheet title</Sheet.Title>
              <Sheet.Description>Supporting description for this sheet.</Sheet.Description>
            </Sheet.Header>
            <Sheet.Body>Sheet body content.</Sheet.Body>
            <Sheet.Footer>
              <Sheet.Close />
            </Sheet.Footer>
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  );
}

export { Basic as Sides };
