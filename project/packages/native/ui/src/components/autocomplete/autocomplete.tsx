import { Children, forwardRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { CloseIcon, IconChevronDown } from "../icons";
import { Text } from "../text";

export const autocompleteVariants = tv({
  slots: {
    base: "relative gap-1.5",
    clearButton: "size-8 items-center justify-center rounded-full bg-default",
    filter: "gap-1",
    indicator: "ml-auto size-5 items-center justify-center",
    popover: "max-h-72 gap-1 rounded-2xl border border-border bg-background p-2",
    trigger: "min-h-11 flex-row items-center gap-2 rounded-xl border border-border px-3 py-2",
    value: "min-w-0 flex-1",
    valueText: "text-sm text-foreground",
  },
  variants: {
    fullWidth: {
      false: {},
      true: {
        base: "w-full",
        trigger: "w-full",
      },
    },
    variant: {
      primary: {},
      secondary: {
        trigger: "bg-default",
      },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: "primary",
  },
});

export type AutocompleteVariants = VariantProps<typeof autocompleteVariants>;

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }
    return child;
  });
}

export interface AutocompleteRootProps<
  TValue = object,
  Mode extends "multiple" | "single" = "single",
> extends Omit<ViewProps, "children">,
    AutocompleteVariants {
  children?: ReactNode | ((props: { items?: Iterable<TValue>; selectionMode?: Mode }) => ReactNode);
  className?: string;
  isDisabled?: boolean;
  items?: Iterable<TValue>;
  onClear?: () => void;
  selectedKey?: string | number | null;
  selectedKeys?: Set<string | number>;
  selectionMode?: Mode;
}

function AutocompleteRootInner<TValue = object, Mode extends "multiple" | "single" = "single">(
  {
    children,
    className,
    fullWidth,
    isDisabled,
    items,
    onClear: _onClear,
    selectionMode,
    variant,
    ...props
  }: AutocompleteRootProps<TValue, Mode>,
  ref: React.ForwardedRef<View>,
) {
  const slots = autocompleteVariants({ fullWidth, variant });

  return (
    <View
      ref={ref}
      accessibilityState={{ disabled: isDisabled }}
      className={slots.base({ className })}
      {...props}
    >
      {typeof children === "function" ? children({ items, selectionMode }) : children}
    </View>
  );
}

const AutocompleteRoot = forwardRef(AutocompleteRootInner) as <
  TValue = object,
  Mode extends "multiple" | "single" = "single",
>(
  props: AutocompleteRootProps<TValue, Mode> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

export interface AutocompleteTriggerProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const AutocompleteTrigger = forwardRef<View, AutocompleteTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const slots = autocompleteVariants();
    return (
      <Pressable ref={ref} className={slots.trigger({ className })} {...props}>
        {children}
      </Pressable>
    );
  },
);

export interface AutocompleteValueProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  placeholder?: ReactNode;
}

const AutocompleteValue = forwardRef<View, AutocompleteValueProps>(
  ({ children, className, placeholder, ...props }, ref) => {
    const slots = autocompleteVariants();
    return (
      <View ref={ref} className={slots.value({ className })} {...props}>
        {renderTextChildren(children ?? placeholder, slots.valueText())}
      </View>
    );
  },
);

export interface AutocompleteIndicatorProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const AutocompleteIndicator = forwardRef<View, AutocompleteIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const slots = autocompleteVariants();
    return (
      <View ref={ref} className={slots.indicator({ className })} {...props}>
        {children ?? <IconChevronDown className="text-muted" />}
      </View>
    );
  },
);

export interface AutocompletePopoverProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  placement?: "bottom" | "left" | "right" | "top";
}

const AutocompletePopover = forwardRef<View, AutocompletePopoverProps>(
  ({ className, placement: _placement, ...props }, ref) => {
    const slots = autocompleteVariants();
    return <View ref={ref} className={slots.popover({ className })} {...props} />;
  },
);

export interface AutocompleteFilterProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const AutocompleteFilter = forwardRef<View, AutocompleteFilterProps>(
  ({ className, ...props }, ref) => {
    const slots = autocompleteVariants();
    return <View ref={ref} className={slots.filter({ className })} {...props} />;
  },
);

export interface AutocompleteClearButtonProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const AutocompleteClearButton = forwardRef<View, AutocompleteClearButtonProps>(
  ({ children, className, ...props }, ref) => {
    const slots = autocompleteVariants();
    return (
      <Pressable ref={ref} className={slots.clearButton({ className })} {...props}>
        {children ?? <CloseIcon className="text-muted" />}
      </Pressable>
    );
  },
);

export {
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
};
