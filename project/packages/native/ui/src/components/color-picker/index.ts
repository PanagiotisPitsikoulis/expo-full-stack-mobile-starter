import type { ComponentProps } from "react";

import { ColorPickerPopover, ColorPickerRoot, ColorPickerTrigger } from "./color-picker";

export const ColorPicker = Object.assign(ColorPickerRoot, {
  Popover: ColorPickerPopover,
  Root: ColorPickerRoot,
  Trigger: ColorPickerTrigger,
});

export type ColorPicker = {
  PopoverProps: ComponentProps<typeof ColorPickerPopover>;
  Props: ComponentProps<typeof ColorPickerRoot>;
  RootProps: ComponentProps<typeof ColorPickerRoot>;
  TriggerProps: ComponentProps<typeof ColorPickerTrigger>;
};

export type {
  ColorPickerPopoverProps,
  ColorPickerRootProps,
  ColorPickerRootProps as ColorPickerProps,
  ColorPickerTriggerProps,
  ColorPickerVariants,
} from "./color-picker";

export {
  ColorPickerPopover,
  ColorPickerRoot,
  ColorPickerTrigger,
  colorPickerVariants,
} from "./color-picker";
