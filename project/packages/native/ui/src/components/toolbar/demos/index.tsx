import { Button, ButtonGroup, Separator, ToggleButton, Toolbar } from "../..";

export function Basic() {
  return (
    <Toolbar accessibilityLabel="Text formatting">
      <ToggleButton isIconOnly accessibilityLabel="Bold">
        B
      </ToggleButton>
      <ToggleButton isIconOnly accessibilityLabel="Italic">
        I
      </ToggleButton>
      <ToggleButton isIconOnly accessibilityLabel="Underline">
        U
      </ToggleButton>
      <Separator orientation="vertical" />
      <ButtonGroup variant="tertiary">
        <Button isIconOnly accessibilityLabel="Copy">
          C
        </Button>
        <ButtonGroup.Separator />
        <Button isIconOnly accessibilityLabel="Cut">
          X
        </Button>
      </ButtonGroup>
    </Toolbar>
  );
}

export function Attached() {
  return (
    <Toolbar isAttached accessibilityLabel="Attached toolbar">
      <ToggleButton isIconOnly accessibilityLabel="Bold">
        B
      </ToggleButton>
      <ToggleButton isIconOnly accessibilityLabel="Italic">
        I
      </ToggleButton>
      <Separator orientation="vertical" />
      <Button isIconOnly accessibilityLabel="Copy" variant="tertiary">
        C
      </Button>
    </Toolbar>
  );
}

export function Vertical() {
  return (
    <Toolbar accessibilityLabel="Tools" orientation="vertical">
      <ToggleButton isIconOnly accessibilityLabel="Bold">
        B
      </ToggleButton>
      <ToggleButton isIconOnly accessibilityLabel="Italic">
        I
      </ToggleButton>
      <Separator />
      <Button isIconOnly accessibilityLabel="Undo" variant="tertiary">
        U
      </Button>
    </Toolbar>
  );
}
