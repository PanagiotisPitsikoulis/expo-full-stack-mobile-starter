import type { ComponentProps } from "react";

import { ComboBoxInputGroup, ComboBoxPopover, ComboBoxRoot, ComboBoxTrigger } from "./combo-box";

export const ComboBox = Object.assign(ComboBoxRoot, {
  InputGroup: ComboBoxInputGroup,
  Popover: ComboBoxPopover,
  Root: ComboBoxRoot,
  Trigger: ComboBoxTrigger,
});

export type ComboBox = {
  InputGroupProps: ComponentProps<typeof ComboBoxInputGroup>;
  PopoverProps: ComponentProps<typeof ComboBoxPopover>;
  Props: ComponentProps<typeof ComboBoxRoot>;
  RootProps: ComponentProps<typeof ComboBoxRoot>;
  TriggerProps: ComponentProps<typeof ComboBoxTrigger>;
};

export type {
  ComboBoxInputGroupProps,
  ComboBoxPopoverProps,
  ComboBoxRootProps,
  ComboBoxRootProps as ComboBoxProps,
  ComboBoxTriggerProps,
  ComboBoxVariants,
} from "./combo-box";

export {
  ComboBoxContext,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger,
  comboBoxVariants,
} from "./combo-box";
