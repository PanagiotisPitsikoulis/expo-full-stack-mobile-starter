import { forwardRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  ContextMenuItem as MenubarItem,
  type ContextMenuItemProps as MenubarItemProps,
} from "../context-menu";

export const menubarVariants = tv({
  slots: {
    content: "min-w-48 gap-1 rounded-2xl border border-border bg-background p-1",
    menu: "relative",
    root: "flex-row items-center gap-1 rounded-2xl bg-default p-1",
    separator: "my-1 h-px w-full bg-border",
    trigger: "min-h-9 flex-row items-center rounded-xl px-3 py-2",
  },
});

export type MenubarVariants = VariantProps<typeof menubarVariants>;

export interface MenubarRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const MenubarRoot = forwardRef<View, MenubarRootProps>(({ className, ...props }, ref) => {
  const slots = menubarVariants();
  return <View ref={ref} className={slots.root({ className })} {...props} />;
});

export interface MenubarMenuProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const MenubarMenu = forwardRef<View, MenubarMenuProps>(({ className, ...props }, ref) => {
  const slots = menubarVariants();
  return <View ref={ref} className={slots.menu({ className })} {...props} />;
});

export interface MenubarTriggerProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const MenubarTrigger = forwardRef<View, MenubarTriggerProps>(({ className, ...props }, ref) => {
  const slots = menubarVariants();
  return <Pressable ref={ref} className={slots.trigger({ className })} {...props} />;
});

export interface MenubarContentProps<TValue = object> extends Omit<ViewProps, "children"> {
  children?: ReactNode | ((item: TValue) => ReactNode);
  className?: string;
  items?: Iterable<TValue>;
}

function MenubarContentInner<TValue = object>(
  { children, className, items: _items, ...props }: MenubarContentProps<TValue>,
  ref: React.ForwardedRef<View>,
) {
  const slots = menubarVariants();
  return (
    <View ref={ref} className={slots.content({ className })} {...props}>
      {typeof children === "function" ? null : children}
    </View>
  );
}

const MenubarContent = forwardRef(MenubarContentInner) as <TValue = object>(
  props: MenubarContentProps<TValue> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

export interface MenubarSeparatorProps extends ViewProps {
  className?: string;
}

const MenubarSeparator = forwardRef<View, MenubarSeparatorProps>(({ className, ...props }, ref) => {
  const slots = menubarVariants();
  return <View ref={ref} className={slots.separator({ className })} {...props} />;
});

export type { MenubarItemProps };
export { MenubarContent, MenubarItem, MenubarMenu, MenubarRoot, MenubarSeparator, MenubarTrigger };
