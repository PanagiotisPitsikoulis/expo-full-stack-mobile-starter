import { forwardRef, type ReactNode } from "react";
import type { View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  DatePickerPopover,
  type DatePickerPopoverProps,
  DatePickerRoot,
  type DatePickerRootProps,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
  type DatePickerTriggerIndicatorProps,
  type DatePickerTriggerProps,
} from "../date-picker";
import { Text, type TextProps } from "../text";

export const dateRangePickerVariants = tv({
  slots: {
    rangeSeparator: "px-1 text-sm text-muted",
  },
});

export type DateRangePickerVariants = VariantProps<typeof dateRangePickerVariants>;

export type DateRangePickerRootProps = DatePickerRootProps;
export type DateRangePickerPopoverProps = DatePickerPopoverProps;
export type DateRangePickerTriggerProps = DatePickerTriggerProps;
export type DateRangePickerTriggerIndicatorProps = DatePickerTriggerIndicatorProps;

export interface DateRangePickerRangeSeparatorProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const DateRangePickerRoot = forwardRef<View, DateRangePickerRootProps>((props, ref) => (
  <DatePickerRoot ref={ref} {...props} />
));

const DateRangePickerPopover = forwardRef<View, DateRangePickerPopoverProps>((props, ref) => (
  <DatePickerPopover ref={ref} {...props} />
));

const DateRangePickerTrigger = forwardRef<View, DateRangePickerTriggerProps>((props, ref) => (
  <DatePickerTrigger ref={ref} {...props} />
));

const DateRangePickerTriggerIndicator = forwardRef<View, DateRangePickerTriggerIndicatorProps>(
  (props, ref) => <DatePickerTriggerIndicator ref={ref} {...props} />,
);

function DateRangePickerRangeSeparator({
  children,
  className,
  ...props
}: DateRangePickerRangeSeparatorProps) {
  const slots = dateRangePickerVariants();
  return (
    <Text className={slots.rangeSeparator({ className })} {...props}>
      {children ?? "-"}
    </Text>
  );
}

DateRangePickerRoot.displayName = "PitsiUINative.DateRangePickerRoot";
DateRangePickerPopover.displayName = "PitsiUINative.DateRangePickerPopover";
DateRangePickerTrigger.displayName = "PitsiUINative.DateRangePickerTrigger";
DateRangePickerTriggerIndicator.displayName = "PitsiUINative.DateRangePickerTriggerIndicator";

export {
  DateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
};
