import { forwardRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  ContextMenuItem as DropdownItem,
  ContextMenuItemIndicator as DropdownItemIndicator,
  type ContextMenuItemIndicatorProps as DropdownItemIndicatorProps,
  type ContextMenuItemProps as DropdownItemProps,
  ContextMenuSubmenuIndicator as DropdownSubmenuIndicator,
  type ContextMenuSubmenuIndicatorProps as DropdownSubmenuIndicatorProps,
  ContextMenuSubTrigger as DropdownSubmenuTrigger,
  type ContextMenuSubTriggerProps as DropdownSubmenuTriggerProps,
} from "../context-menu";
import { Text } from "../text";

export const dropdownVariants = tv({
  slots: {
    menu: "gap-1",
    popover: "min-w-48 gap-1 rounded-2xl border border-border bg-background p-1",
    root: "relative",
    section: "gap-1 py-1",
    trigger: "min-h-10 flex-row items-center gap-2 rounded-xl px-3 py-2",
    triggerText: "text-sm text-foreground",
  },
});

export type DropdownVariants = VariantProps<typeof dropdownVariants>;

function renderText(children: ReactNode, className: string) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text className={className}>{children}</Text>;
  }
  return children;
}

export interface DropdownRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DropdownRoot = forwardRef<View, DropdownRootProps>(({ className, ...props }, ref) => {
  const slots = dropdownVariants();
  return <View ref={ref} className={slots.root({ className })} {...props} />;
});

export interface DropdownTriggerProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const DropdownTrigger = forwardRef<View, DropdownTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const slots = dropdownVariants();
    return (
      <Pressable ref={ref} className={slots.trigger({ className })} {...props}>
        {renderText(children, slots.triggerText())}
      </Pressable>
    );
  },
);

export interface DropdownPopoverProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DropdownPopover = forwardRef<View, DropdownPopoverProps>(({ className, ...props }, ref) => {
  const slots = dropdownVariants();
  return <View ref={ref} className={slots.popover({ className })} {...props} />;
});

export interface DropdownMenuProps<TValue = object> extends Omit<ViewProps, "children"> {
  children?: ReactNode | ((item: TValue) => ReactNode);
  className?: string;
  items?: Iterable<TValue>;
}

function DropdownMenuInner<TValue = object>(
  { children, className, items: _items, ...props }: DropdownMenuProps<TValue>,
  ref: React.ForwardedRef<View>,
) {
  const slots = dropdownVariants();
  return (
    <View ref={ref} className={slots.menu({ className })} {...props}>
      {typeof children === "function" ? null : children}
    </View>
  );
}

const DropdownMenu = forwardRef(DropdownMenuInner) as <TValue = object>(
  props: DropdownMenuProps<TValue> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

export interface DropdownSectionProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DropdownSection = forwardRef<View, DropdownSectionProps>(({ className, ...props }, ref) => {
  const slots = dropdownVariants();
  return <View ref={ref} className={slots.section({ className })} {...props} />;
});

export type {
  DropdownItemIndicatorProps,
  DropdownItemProps,
  DropdownSubmenuIndicatorProps,
  DropdownSubmenuTriggerProps,
};
export {
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
  DropdownTrigger,
};
