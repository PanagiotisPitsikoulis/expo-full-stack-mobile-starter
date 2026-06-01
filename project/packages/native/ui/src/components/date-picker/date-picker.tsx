import { forwardRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const datePickerVariants = tv({
  slots: {
    indicator: "ml-auto size-5 items-center justify-center",
    popover: "rounded-2xl border border-border bg-background p-3",
    root: "relative gap-2",
    trigger: "min-h-11 flex-row items-center gap-2 rounded-xl border border-border px-3 py-2",
  },
});

export type DatePickerVariants = VariantProps<typeof datePickerVariants>;

export interface DatePickerRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface DatePickerPopoverProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface DatePickerTriggerProps extends Omit<PressableProps, "children" | "disabled"> {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  isDisabled?: boolean;
  label?: ReactNode;
  onAction?: () => void;
  onClick?: () => void;
  textValue?: string;
  title?: ReactNode;
  value?: ReactNode;
}

export interface DatePickerTriggerIndicatorProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

function renderTriggerContent(children: ReactNode, fallback: ReactNode) {
  const content = children ?? fallback;
  if (typeof content === "string" || typeof content === "number") {
    return <Text className="text-sm text-foreground">{content}</Text>;
  }

  return content;
}

const DatePickerRoot = forwardRef<View, DatePickerRootProps>(({ className, ...props }, ref) => {
  const slots = datePickerVariants();
  return <View ref={ref} className={slots.root({ className })} {...props} />;
});

const DatePickerPopover = forwardRef<View, DatePickerPopoverProps>(
  ({ className, ...props }, ref) => {
    const slots = datePickerVariants();
    return <View ref={ref} className={slots.popover({ className })} {...props} />;
  },
);

const DatePickerTrigger = forwardRef<View, DatePickerTriggerProps>(
  (
    {
      children,
      className,
      disabled,
      isDisabled,
      label,
      onAction,
      onClick,
      onPress,
      textValue,
      title,
      value,
      ...props
    },
    ref,
  ) => {
    const slots = datePickerVariants();
    const resolvedDisabled = Boolean(disabled || isDisabled);
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: resolvedDisabled }}
        className={slots.trigger({ className })}
        disabled={resolvedDisabled}
        onPress={onPress ?? (onAction ? () => onAction() : onClick ? () => onClick() : undefined)}
        {...props}
      >
        {renderTriggerContent(children, label ?? title ?? value ?? textValue)}
      </Pressable>
    );
  },
);

const DatePickerTriggerIndicator = forwardRef<View, DatePickerTriggerIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const slots = datePickerVariants();
    return (
      <View ref={ref} className={slots.indicator({ className })} {...props}>
        {children ?? <Text className="text-sm text-muted">⌄</Text>}
      </View>
    );
  },
);

DatePickerRoot.displayName = "PitsiUINative.DatePickerRoot";
DatePickerPopover.displayName = "PitsiUINative.DatePickerPopover";
DatePickerTrigger.displayName = "PitsiUINative.DatePickerTrigger";
DatePickerTriggerIndicator.displayName = "PitsiUINative.DatePickerTriggerIndicator";

export { DatePickerPopover, DatePickerRoot, DatePickerTrigger, DatePickerTriggerIndicator };
