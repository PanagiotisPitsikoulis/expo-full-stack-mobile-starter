import { Button, Modal } from "../..";

export function Basic() {
  return (
    <Modal>
      <Modal.Trigger>
        <Button>Open modal</Button>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Confirm change</Modal.Heading>
            </Modal.Header>
            <Modal.Body>This action updates your saved settings.</Modal.Body>
            <Modal.Footer>
              <Modal.CloseTrigger />
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export { Basic as Controlled, Basic as Sizes, Basic as Variants };
