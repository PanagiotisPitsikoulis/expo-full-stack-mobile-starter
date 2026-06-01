import type { ComponentProps } from "react";

import {
  DateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
  dateRangePickerVariants,
} from "./date-range-picker";

export const DateRangePicker = Object.assign(DateRangePickerRoot, {
  Popover: DateRangePickerPopover,
  RangeSeparator: DateRangePickerRangeSeparator,
  Root: DateRangePickerRoot,
  Trigger: DateRangePickerTrigger,
  TriggerIndicator: DateRangePickerTriggerIndicator,
});

export type DateRangePicker = {
  PopoverProps: ComponentProps<typeof DateRangePickerPopover>;
  Props: ComponentProps<typeof DateRangePickerRoot>;
  RangeSeparatorProps: ComponentProps<typeof DateRangePickerRangeSeparator>;
  RootProps: ComponentProps<typeof DateRangePickerRoot>;
  TriggerIndicatorProps: ComponentProps<typeof DateRangePickerTriggerIndicator>;
  TriggerProps: ComponentProps<typeof DateRangePickerTrigger>;
};

export type {
  DateRangePickerPopoverProps,
  DateRangePickerRangeSeparatorProps,
  DateRangePickerRootProps,
  DateRangePickerRootProps as DateRangePickerProps,
  DateRangePickerTriggerIndicatorProps,
  DateRangePickerTriggerProps,
  DateRangePickerVariants,
} from "./date-range-picker";

export {
  DateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
  dateRangePickerVariants,
};
