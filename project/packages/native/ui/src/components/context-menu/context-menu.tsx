import { Children, forwardRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const contextMenuVariants = tv({
  slots: {
    content: "min-w-48 gap-1 rounded-2xl border border-border bg-background p-1",
    indicator: "size-5 items-center justify-center",
    item: "min-h-10 flex-row items-center gap-3 rounded-xl px-3 py-2",
    itemText: "text-sm text-foreground",
    root: "relative",
    separator: "my-1 h-px w-full bg-border",
    sub: "gap-1",
    submenuIndicator: "ml-auto size-5 items-center justify-center",
    trigger: "self-start",
  },
});

export type ContextMenuVariants = VariantProps<typeof contextMenuVariants>;

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }
    return child;
  });
}

export interface ContextMenuRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ContextMenuRoot = forwardRef<View, ContextMenuRootProps>(({ className, ...props }, ref) => {
  const slots = contextMenuVariants();
  return <View ref={ref} className={slots.root({ className })} {...props} />;
});

export interface ContextMenuTriggerProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const ContextMenuTrigger = forwardRef<View, ContextMenuTriggerProps>(
  ({ className, ...props }, ref) => {
    const slots = contextMenuVariants();
    return <Pressable ref={ref} className={slots.trigger({ className })} {...props} />;
  },
);

export interface ContextMenuContentProps<TValue = object> extends Omit<ViewProps, "children"> {
  children?: ReactNode | ((item: TValue) => ReactNode);
  className?: string;
  items?: Iterable<TValue>;
}

function ContextMenuContentInner<TValue = object>(
  { children, className, items: _items, ...props }: ContextMenuContentProps<TValue>,
  ref: React.ForwardedRef<View>,
) {
  const slots = contextMenuVariants();
  return (
    <View ref={ref} className={slots.content({ className })} {...props}>
      {typeof children === "function" ? null : children}
    </View>
  );
}

const ContextMenuContent = forwardRef(ContextMenuContentInner) as <TValue = object>(
  props: ContextMenuContentProps<TValue> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

export interface ContextMenuItemProps extends PressableProps {
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  onAction?: () => void;
  onClick?: () => void;
}

const ContextMenuItem = forwardRef<View, ContextMenuItemProps>(
  ({ children, className, isDisabled = false, onAction, onClick, onPress, ...props }, ref) => {
    const slots = contextMenuVariants();
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        className={slots.item({
          className: `${isDisabled ? "opacity-disabled" : ""} ${className ?? ""}`,
        })}
        disabled={isDisabled}
        onPress={(event) => {
          onPress?.(event);
          onAction?.();
          onClick?.();
        }}
        {...props}
      >
        {renderTextChildren(children, slots.itemText())}
      </Pressable>
    );
  },
);

export interface ContextMenuItemIndicatorProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ContextMenuItemIndicator = forwardRef<View, ContextMenuItemIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const slots = contextMenuVariants();
    return (
      <View ref={ref} className={slots.indicator({ className })} {...props}>
        {children ?? <Text className="text-sm text-link">✓</Text>}
      </View>
    );
  },
);

export interface ContextMenuSeparatorProps extends ViewProps {
  className?: string;
}

const ContextMenuSeparator = forwardRef<View, ContextMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    const slots = contextMenuVariants();
    return <View ref={ref} className={slots.separator({ className })} {...props} />;
  },
);

export interface ContextMenuSubProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ContextMenuSub = forwardRef<View, ContextMenuSubProps>(({ className, ...props }, ref) => {
  const slots = contextMenuVariants();
  return <View ref={ref} className={slots.sub({ className })} {...props} />;
});

export interface ContextMenuSubContentProps<TValue = object>
  extends ContextMenuContentProps<TValue> {}

const ContextMenuSubContent = ContextMenuContent;

export interface ContextMenuSubTriggerProps extends ContextMenuItemProps {}

const ContextMenuSubTrigger = ContextMenuItem;

export interface ContextMenuSubmenuIndicatorProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ContextMenuSubmenuIndicator = forwardRef<View, ContextMenuSubmenuIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const slots = contextMenuVariants();
    return (
      <View ref={ref} className={slots.submenuIndicator({ className })} {...props}>
        {children ?? <Text className="text-sm text-muted">›</Text>}
      </View>
    );
  },
);

export {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubmenuIndicator,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
