import { Children, createContext, forwardRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { IconChevronDown } from "../icons";
import { Text } from "../text";

export const comboBoxVariants = tv({
  slots: {
    base: "relative gap-1.5",
    inputGroup:
      "min-h-11 flex-row items-center overflow-hidden rounded-xl border border-border bg-background",
    popover: "max-h-72 rounded-2xl border border-border bg-background p-2",
    trigger: "min-h-11 flex-row items-center gap-2 rounded-xl px-3 py-2",
    triggerText: "text-sm text-foreground",
  },
  variants: {
    fullWidth: {
      false: {},
      true: {
        base: "w-full",
        inputGroup: "w-full",
      },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

export type ComboBoxVariants = VariantProps<typeof comboBoxVariants>;
export const ComboBoxContext = createContext<Record<string, unknown>>({});

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }
    return child;
  });
}

export interface ComboBoxRootProps<TValue = object>
  extends Omit<ViewProps, "children">,
    ComboBoxVariants {
  children?: ReactNode | ((props: { isOpen: boolean; items?: Iterable<TValue> }) => ReactNode);
  className?: string;
  defaultInputValue?: string;
  inputValue?: string;
  isDisabled?: boolean;
  items?: Iterable<TValue>;
  menuTrigger?: "focus" | "input" | "manual";
  onInputChange?: (value: string) => void;
  selectedKey?: string | number | null;
  variant?: "primary" | "secondary";
}

function ComboBoxRootInner<TValue = object>(
  {
    children,
    className,
    fullWidth,
    isDisabled,
    items,
    menuTrigger: _menuTrigger,
    variant: _variant,
    ...props
  }: ComboBoxRootProps<TValue>,
  ref: React.ForwardedRef<View>,
) {
  const slots = comboBoxVariants({ fullWidth });

  return (
    <ComboBoxContext.Provider value={{ isDisabled, items, slots }}>
      <View
        ref={ref}
        accessibilityState={{ disabled: isDisabled }}
        className={slots.base({ className })}
        {...props}
      >
        {typeof children === "function" ? children({ isOpen: true, items }) : children}
      </View>
    </ComboBoxContext.Provider>
  );
}

const ComboBoxRoot = forwardRef(ComboBoxRootInner) as <TValue = object>(
  props: ComboBoxRootProps<TValue> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

export interface ComboBoxInputGroupProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ComboBoxInputGroup = forwardRef<View, ComboBoxInputGroupProps>(
  ({ className, ...props }, ref) => {
    const slots = comboBoxVariants();
    return <View ref={ref} className={slots.inputGroup({ className })} {...props} />;
  },
);

export interface ComboBoxTriggerProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const ComboBoxTrigger = forwardRef<View, ComboBoxTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const slots = comboBoxVariants();
    return (
      <Pressable ref={ref} className={slots.trigger({ className })} {...props}>
        {children ? renderTextChildren(children, slots.triggerText()) : <IconChevronDown />}
      </Pressable>
    );
  },
);

export interface ComboBoxPopoverProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  placement?: "bottom" | "left" | "right" | "top";
}

const ComboBoxPopover = forwardRef<View, ComboBoxPopoverProps>(
  ({ className, placement: _placement, ...props }, ref) => {
    const slots = comboBoxVariants();
    return <View ref={ref} className={slots.popover({ className })} {...props} />;
  },
);

export { ComboBoxInputGroup, ComboBoxPopover, ComboBoxRoot, ComboBoxTrigger };
