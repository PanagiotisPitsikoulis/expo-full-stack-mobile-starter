import { forwardRef, type ReactNode } from "react";
import {
  Linking,
  Pressable,
  type PressableProps,
  ScrollView,
  type ScrollViewProps,
  View,
  type ViewProps,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../../_utils";
import type { TextRef } from "../../helpers/internal/types";
import {
  CalendarYearPickerCell,
  type CalendarYearPickerCellProps,
  type CalendarYearPickerCellRenderProps,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  type CalendarYearPickerGridBodyProps,
  type CalendarYearPickerGridProps,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  type CalendarYearPickerTriggerHeadingProps,
  CalendarYearPickerTriggerIndicator,
  type CalendarYearPickerTriggerIndicatorProps,
  type CalendarYearPickerTriggerProps,
  type CalendarYearPickerTriggerRenderProps,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  type YearPickerContextValue,
  YearPickerStateContext,
  type YearPickerStateContextValue,
} from "../calendar-year-picker";
import { Text, type TextProps } from "../text";

export type CalendarDayValue = {
  day: number;
  month: number;
  year: number;
  toString: () => string;
};

export type CalendarCellRenderProps = {
  date?: CalendarDayValue | unknown;
  isDisabled: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  isPressed: boolean;
  isSelected: boolean;
};

type InteractiveChildren = ReactNode | ((state: CalendarCellRenderProps) => ReactNode);

type SharedProps = {
  className?: string;
  date?: CalendarDayValue | unknown;
  disabled?: boolean;
  href?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  label?: ReactNode;
  offset?: unknown;
  onAction?: () => void;
  onClick?: () => void;
  selected?: boolean;
  slot?: "next" | "previous" | string;
  textValue?: string;
  title?: ReactNode;
  value?: ReactNode;
};

export const calendarVariants = tv({
  slots: {
    cell: "size-10 items-center justify-center rounded-full",
    cellIndicator: "absolute bottom-1 size-1 rounded-full bg-link",
    grid: "w-full",
    gridBody: "flex-row flex-wrap",
    gridHeader: "flex-row",
    header: "flex-row items-center justify-between",
    headerCell: "w-10 py-1 text-center text-xs text-muted",
    heading: "text-base font-semibold text-foreground",
    navButton: "size-9 items-center justify-center rounded-full bg-default",
    root: "gap-3 rounded-2xl bg-background p-3",
  },
});

export type CalendarVariants = VariantProps<typeof calendarVariants>;

export type CalendarRootProps = Omit<ViewProps, "children"> &
  SharedProps & {
    children?: ReactNode;
  };
export type CalendarHeaderProps = Omit<ViewProps, "children"> &
  SharedProps & {
    children?: ReactNode;
  };
export type CalendarHeadingProps = Omit<TextProps, "children"> &
  SharedProps & {
    children?: ReactNode;
  };
export type CalendarNavButtonProps = Omit<PressableProps, "children" | "disabled"> &
  SharedProps & {
    children?: InteractiveChildren;
  };
export type CalendarGridProps = Omit<ScrollViewProps, "children"> &
  SharedProps & {
    children?: ReactNode;
    orientation?: "both" | "horizontal" | "vertical" | string;
  };
export type CalendarGridHeaderProps = Omit<ViewProps, "children"> &
  SharedProps & {
    children?: ReactNode | ((day: string) => ReactNode);
  };
export type CalendarGridBodyProps = Omit<ViewProps, "children"> &
  SharedProps & {
    children?: ReactNode | ((date: CalendarDayValue) => ReactNode);
  };
export type CalendarHeaderCellProps = Omit<TextProps, "children"> &
  SharedProps & {
    children?: ReactNode;
  };
export type CalendarCellProps = Omit<PressableProps, "children" | "disabled"> &
  SharedProps & {
    children?: InteractiveChildren;
  };
export type CalendarCellIndicatorProps = Omit<ViewProps, "children"> &
  SharedProps & {
    children?: ReactNode;
  };

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const days = Array.from({ length: 35 }, (_, index): CalendarDayValue => {
  const day = index + 1;
  return {
    day,
    month: 5,
    toString: () => `2026-05-${String(day).padStart(2, "0")}`,
    year: 2026,
  };
});

function stripSharedProps<TProps extends SharedProps>(props: TProps) {
  const {
    className: _className,
    date: _date,
    disabled: _disabled,
    href: _href,
    isDisabled: _isDisabled,
    isSelected: _isSelected,
    label: _label,
    offset: _offset,
    onAction: _onAction,
    onClick: _onClick,
    selected: _selected,
    slot: _slot,
    textValue: _textValue,
    title: _title,
    value: _value,
    ...nativeProps
  } = props;

  return nativeProps;
}

function renderNode(value: ReactNode) {
  if (value == null || typeof value === "boolean") return null;
  if (typeof value === "string" || typeof value === "number") {
    return <Text>{value}</Text>;
  }

  return value;
}

function sharedContent(children: ReactNode | undefined, props: SharedProps) {
  return children ?? props.label ?? props.title ?? props.value ?? props.textValue ?? null;
}

function createCellState(props: SharedProps, isPressed = false): CalendarCellRenderProps {
  return {
    date: props.date,
    isDisabled: Boolean(props.disabled || props.isDisabled),
    isFocused: false,
    isFocusVisible: false,
    isHovered: false,
    isPressed,
    isSelected: Boolean(props.selected || props.isSelected),
  };
}

function getDayLabel(date: unknown) {
  if (date && typeof date === "object" && "day" in date) {
    const day = (date as { day?: unknown }).day;
    return typeof day === "number" || typeof day === "string" ? day : null;
  }

  return null;
}

const CalendarRoot = forwardRef<View, CalendarRootProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarVariants();
    const nativeProps = stripSharedProps(props);

    return (
      <View ref={ref} className={slots.root({ className })} {...nativeProps}>
        {renderNode(sharedContent(children, props))}
      </View>
    );
  },
);

const CalendarHeader = forwardRef<View, CalendarHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarVariants();
    return (
      <View ref={ref} className={slots.header({ className })} {...stripSharedProps(props)}>
        {renderNode(sharedContent(children, props))}
      </View>
    );
  },
);

const CalendarHeading = forwardRef<TextRef, CalendarHeadingProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarVariants();
    return (
      <Text ref={ref} className={slots.heading({ className })} {...stripSharedProps(props)}>
        {sharedContent(children, props) ?? "May 2026"}
      </Text>
    );
  },
);

const CalendarNavButton = forwardRef<View, CalendarNavButtonProps>(
  (
    {
      children,
      className,
      disabled,
      href,
      isDisabled,
      isSelected,
      onAction,
      onClick,
      onPress,
      selected,
      slot,
      ...props
    },
    ref,
  ) => {
    const slots = calendarVariants();
    const disabledValue = Boolean(disabled || isDisabled);
    const selectedValue = Boolean(selected || isSelected);
    const nativeProps = stripSharedProps({ ...props, href, slot });

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabledValue, selected: selectedValue }}
        className={cn(
          slots.navButton(),
          selectedValue && "bg-default",
          disabledValue && "opacity-50",
          className,
        )}
        disabled={disabledValue}
        onPress={
          onPress ??
          (onAction
            ? () => onAction()
            : onClick
              ? () => onClick()
              : href
                ? () => void Linking.openURL(href)
                : undefined)
        }
        {...nativeProps}
      >
        {({ pressed }) =>
          renderNode(
            typeof children === "function"
              ? children(createCellState({ disabled, isDisabled, isSelected, selected }, pressed))
              : (sharedContent(children, props) ?? (slot === "previous" ? "<" : ">")),
          )
        }
      </Pressable>
    );
  },
);

const CalendarGrid = forwardRef<ScrollView, CalendarGridProps>(
  ({ children, className, horizontal, orientation, ...props }, ref) => {
    const slots = calendarVariants();
    const resolvedHorizontal = horizontal ?? orientation === "horizontal";

    return (
      <ScrollView
        ref={ref}
        className={slots.grid({ className })}
        horizontal={resolvedHorizontal}
        {...stripSharedProps(props)}
      >
        {renderNode(sharedContent(children, props))}
      </ScrollView>
    );
  },
);

const CalendarGridHeader = forwardRef<View, CalendarGridHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarVariants();

    return (
      <View ref={ref} className={slots.gridHeader({ className })} {...stripSharedProps(props)}>
        {typeof children === "function"
          ? weekdays.map((day) => (
              <CalendarHeaderCell key={day}>{children(day)}</CalendarHeaderCell>
            ))
          : renderNode(sharedContent(children, props))}
      </View>
    );
  },
);

const CalendarGridBody = forwardRef<View, CalendarGridBodyProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarVariants();

    return (
      <View ref={ref} className={slots.gridBody({ className })} {...stripSharedProps(props)}>
        {typeof children === "function"
          ? days.map((date) => (
              <CalendarCell key={date.toString()} date={date}>
                {children(date)}
              </CalendarCell>
            ))
          : renderNode(sharedContent(children, props))}
      </View>
    );
  },
);

const CalendarHeaderCell = forwardRef<TextRef, CalendarHeaderCellProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarVariants();
    return (
      <Text ref={ref} className={slots.headerCell({ className })} {...stripSharedProps(props)}>
        {sharedContent(children, props)}
      </Text>
    );
  },
);

const CalendarCell = forwardRef<View, CalendarCellProps>(
  (
    {
      children,
      className,
      date,
      disabled,
      href,
      isDisabled,
      isSelected,
      onAction,
      onClick,
      onPress,
      selected,
      ...props
    },
    ref,
  ) => {
    const slots = calendarVariants();
    const disabledValue = Boolean(disabled || isDisabled);
    const selectedValue = Boolean(selected || isSelected);
    const nativeProps = stripSharedProps({ ...props, date, href });

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabledValue, selected: selectedValue }}
        className={cn(
          slots.cell(),
          selectedValue && "bg-default",
          disabledValue && "opacity-50",
          className,
        )}
        disabled={disabledValue}
        onPress={
          onPress ??
          (onAction
            ? () => onAction()
            : onClick
              ? () => onClick()
              : href
                ? () => void Linking.openURL(href)
                : undefined)
        }
        {...nativeProps}
      >
        {({ pressed }) =>
          renderNode(
            typeof children === "function"
              ? children(
                  createCellState({ date, disabled, isDisabled, isSelected, selected }, pressed),
                )
              : (sharedContent(children, props) ?? getDayLabel(date)),
          )
        }
      </Pressable>
    );
  },
);

const CalendarCellIndicator = forwardRef<View, CalendarCellIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarVariants();
    return (
      <View ref={ref} className={slots.cellIndicator({ className })} {...stripSharedProps(props)}>
        {renderNode(sharedContent(children, props))}
      </View>
    );
  },
);

CalendarRoot.displayName = "PitsiUINative.CalendarRoot";
CalendarHeader.displayName = "PitsiUINative.CalendarHeader";
CalendarHeading.displayName = "PitsiUINative.CalendarHeading";
CalendarNavButton.displayName = "PitsiUINative.CalendarNavButton";
CalendarGrid.displayName = "PitsiUINative.CalendarGrid";
CalendarGridHeader.displayName = "PitsiUINative.CalendarGridHeader";
CalendarGridBody.displayName = "PitsiUINative.CalendarGridBody";
CalendarHeaderCell.displayName = "PitsiUINative.CalendarHeaderCell";
CalendarCell.displayName = "PitsiUINative.CalendarCell";
CalendarCellIndicator.displayName = "PitsiUINative.CalendarCellIndicator";

export type {
  CalendarYearPickerCellProps,
  CalendarYearPickerCellRenderProps,
  CalendarYearPickerGridBodyProps,
  CalendarYearPickerGridProps,
  CalendarYearPickerTriggerHeadingProps,
  CalendarYearPickerTriggerIndicatorProps,
  CalendarYearPickerTriggerProps,
  CalendarYearPickerTriggerRenderProps,
  YearPickerContextValue,
  YearPickerStateContextValue,
};
export {
  CalendarCell,
  CalendarCellIndicator,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  CalendarHeading,
  CalendarNavButton,
  CalendarRoot,
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  YearPickerStateContext,
};
