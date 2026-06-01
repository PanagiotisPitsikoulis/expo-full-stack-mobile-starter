import type { ComponentProps } from "react";

import {
  DatePickerPopover,
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
  datePickerVariants,
} from "./date-picker";

export const DatePicker = Object.assign(DatePickerRoot, {
  Popover: DatePickerPopover,
  Root: DatePickerRoot,
  Trigger: DatePickerTrigger,
  TriggerIndicator: DatePickerTriggerIndicator,
});

export type DatePicker = {
  PopoverProps: ComponentProps<typeof DatePickerPopover>;
  Props: ComponentProps<typeof DatePickerRoot>;
  RootProps: ComponentProps<typeof DatePickerRoot>;
  TriggerIndicatorProps: ComponentProps<typeof DatePickerTriggerIndicator>;
  TriggerProps: ComponentProps<typeof DatePickerTrigger>;
};

export type {
  DatePickerPopoverProps,
  DatePickerRootProps,
  DatePickerRootProps as DatePickerProps,
  DatePickerTriggerIndicatorProps,
  DatePickerTriggerProps,
  DatePickerVariants,
} from "./date-picker";

export {
  DatePickerPopover,
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
  datePickerVariants,
};
