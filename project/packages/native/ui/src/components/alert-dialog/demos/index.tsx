import { AlertDialog, Button } from "../..";

export function Basic() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger>
        <Button variant="danger">Delete item</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon />
              <AlertDialog.Heading>Delete item?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>This action cannot be undone.</AlertDialog.Body>
            <AlertDialog.Footer>
              <AlertDialog.CloseTrigger />
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export { Basic as Statuses };
