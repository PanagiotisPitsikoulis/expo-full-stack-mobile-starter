import {
  createContext,
  forwardRef,
  type PropsWithChildren,
  type ReactNode,
  useContext,
} from "react";
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
import { Text, type TextProps } from "../text";

export type YearPickerContextValue = Record<string, unknown>;
export type YearPickerStateContextValue = Record<string, unknown>;

export const YearPickerContext = createContext<YearPickerContextValue>({});
export const YearPickerStateContext = createContext<YearPickerStateContextValue>({});

export function useYearPicker() {
  return useContext(YearPickerContext);
}

export function useYearPickerState() {
  return useContext(YearPickerStateContext);
}

export type CalendarYearPickerCellRenderProps = {
  isDisabled: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  isPressed: boolean;
  isSelected: boolean;
  year?: number;
};

export type CalendarYearPickerTriggerRenderProps = Omit<CalendarYearPickerCellRenderProps, "year">;

type InteractiveChildren = ReactNode | ((state: CalendarYearPickerCellRenderProps) => ReactNode);
type TriggerChildren = ReactNode | ((state: CalendarYearPickerTriggerRenderProps) => ReactNode);

type SharedProps = {
  className?: string;
  disabled?: boolean;
  href?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  label?: ReactNode;
  onAction?: () => void;
  onClick?: () => void;
  selected?: boolean;
  slot?: string;
  textValue?: string;
  title?: ReactNode;
  value?: ReactNode;
  year?: number;
};

export const calendarYearPickerVariants = tv({
  slots: {
    cell: "min-h-10 min-w-20 items-center justify-center rounded-xl px-3 py-2",
    grid: "max-h-72",
    gridBody: "flex-row flex-wrap gap-2",
    root: "gap-2",
    trigger: "min-h-10 flex-row items-center gap-2 rounded-xl px-3 py-2",
    triggerHeading: "text-base font-semibold text-foreground",
    triggerIndicator: "size-5 items-center justify-center",
  },
});

export type CalendarYearPickerVariants = VariantProps<typeof calendarYearPickerVariants>;

export type CalendarYearPickerRootProps = Omit<ViewProps, "children"> &
  SharedProps & {
    children?: ReactNode;
  };
export type CalendarYearPickerGridProps = Omit<ScrollViewProps, "children"> &
  SharedProps & {
    children?: ReactNode;
    orientation?: "both" | "horizontal" | "vertical" | string;
  };
export type CalendarYearPickerGridBodyProps = Omit<ViewProps, "children"> &
  SharedProps & {
    children?: ReactNode | ((values: CalendarYearPickerCellRenderProps) => ReactNode);
  };
export type CalendarYearPickerCellProps = Omit<PressableProps, "children" | "disabled"> &
  SharedProps & {
    children?: InteractiveChildren;
  };
export type CalendarYearPickerTriggerProps = Omit<PressableProps, "children" | "disabled"> &
  SharedProps & {
    children?: TriggerChildren;
  };
export type CalendarYearPickerTriggerHeadingProps = Omit<TextProps, "children"> &
  SharedProps & {
    children?: ReactNode;
  };
export type CalendarYearPickerTriggerIndicatorProps = Omit<ViewProps, "children"> &
  SharedProps & {
    children?: ReactNode;
  };

function stripSharedProps<TProps extends SharedProps>(props: TProps) {
  const {
    className: _className,
    disabled: _disabled,
    href: _href,
    isDisabled: _isDisabled,
    isSelected: _isSelected,
    label: _label,
    onAction: _onAction,
    onClick: _onClick,
    selected: _selected,
    slot: _slot,
    textValue: _textValue,
    title: _title,
    value: _value,
    year: _year,
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

function createTriggerState(props: SharedProps): CalendarYearPickerTriggerRenderProps {
  return {
    isDisabled: Boolean(props.disabled || props.isDisabled),
    isFocused: false,
    isFocusVisible: false,
    isHovered: false,
    isPressed: false,
    isSelected: Boolean(props.selected || props.isSelected),
  };
}

function createCellState(props: SharedProps, isPressed = false): CalendarYearPickerCellRenderProps {
  return {
    ...createTriggerState(props),
    isPressed,
    year: props.year,
  };
}

const CalendarYearPickerRoot = forwardRef<View, CalendarYearPickerRootProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarYearPickerVariants();
    const nativeProps = stripSharedProps(props);

    return (
      <View ref={ref} className={slots.root({ className })} {...nativeProps}>
        {renderNode(sharedContent(children, props))}
      </View>
    );
  },
);

const CalendarYearPickerGrid = forwardRef<ScrollView, CalendarYearPickerGridProps>(
  ({ children, className, horizontal, orientation, ...props }, ref) => {
    const slots = calendarYearPickerVariants();
    const nativeProps = stripSharedProps(props);
    const resolvedHorizontal = horizontal ?? orientation === "horizontal";

    return (
      <ScrollView
        ref={ref}
        className={slots.grid({ className })}
        horizontal={resolvedHorizontal}
        {...nativeProps}
      >
        {renderNode(sharedContent(children, props))}
      </ScrollView>
    );
  },
);

const CalendarYearPickerGridBody = forwardRef<View, CalendarYearPickerGridBodyProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarYearPickerVariants();
    const nativeProps = stripSharedProps(props);
    const years = Array.from({ length: 12 }, (_, index) => 2021 + index);

    return (
      <View ref={ref} className={slots.gridBody({ className })} {...nativeProps}>
        {typeof children === "function"
          ? years.map((year) => (
              <CalendarYearPickerCell key={year} year={year}>
                {children(createCellState({ year }))}
              </CalendarYearPickerCell>
            ))
          : renderNode(sharedContent(children, props))}
      </View>
    );
  },
);

const CalendarYearPickerCell = forwardRef<View, CalendarYearPickerCellProps>(
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
      year,
      ...props
    },
    ref,
  ) => {
    const slots = calendarYearPickerVariants();
    const disabledValue = Boolean(disabled || isDisabled);
    const selectedValue = Boolean(selected || isSelected);
    const nativeProps = stripSharedProps({ ...props, href, year });

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
                  createCellState({ disabled, isDisabled, isSelected, selected, year }, pressed),
                )
              : (sharedContent(children, { ...props, year }) ?? year),
          )
        }
      </Pressable>
    );
  },
);

const CalendarYearPickerTrigger = forwardRef<View, CalendarYearPickerTriggerProps>(
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
      ...props
    },
    ref,
  ) => {
    const slots = calendarYearPickerVariants();
    const disabledValue = Boolean(disabled || isDisabled);
    const selectedValue = Boolean(selected || isSelected);
    const nativeProps = stripSharedProps({ ...props, href });

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabledValue, selected: selectedValue }}
        className={cn(
          slots.trigger(),
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
              ? children({
                  ...createTriggerState({ disabled, isDisabled, isSelected, selected }),
                  isPressed: pressed,
                })
              : sharedContent(children, props),
          )
        }
      </Pressable>
    );
  },
);

const CalendarYearPickerTriggerHeading = forwardRef<TextRef, CalendarYearPickerTriggerHeadingProps>(
  ({ children, className, ...props }, ref) => {
    const slots = calendarYearPickerVariants();

    return (
      <Text ref={ref} className={slots.triggerHeading({ className })} {...stripSharedProps(props)}>
        {sharedContent(children, props) ?? "2026"}
      </Text>
    );
  },
);

const CalendarYearPickerTriggerIndicator = forwardRef<
  View,
  CalendarYearPickerTriggerIndicatorProps
>(({ children, className, ...props }, ref) => {
  const slots = calendarYearPickerVariants();

  return (
    <View ref={ref} className={slots.triggerIndicator({ className })} {...stripSharedProps(props)}>
      {children ?? <Text className="text-sm text-muted">⌄</Text>}
    </View>
  );
});

CalendarYearPickerRoot.displayName = "PitsiUINative.CalendarYearPickerRoot";
CalendarYearPickerGrid.displayName = "PitsiUINative.CalendarYearPickerGrid";
CalendarYearPickerGridBody.displayName = "PitsiUINative.CalendarYearPickerGridBody";
CalendarYearPickerCell.displayName = "PitsiUINative.CalendarYearPickerCell";
CalendarYearPickerTrigger.displayName = "PitsiUINative.CalendarYearPickerTrigger";
CalendarYearPickerTriggerHeading.displayName = "PitsiUINative.CalendarYearPickerTriggerHeading";
CalendarYearPickerTriggerIndicator.displayName = "PitsiUINative.CalendarYearPickerTriggerIndicator";

function CalendarYearPickerProvider({
  children,
  value,
}: PropsWithChildren<{ value?: YearPickerContextValue }>) {
  return <YearPickerContext.Provider value={value ?? {}}>{children}</YearPickerContext.Provider>;
}

export {
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerProvider,
  CalendarYearPickerRoot,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
};
