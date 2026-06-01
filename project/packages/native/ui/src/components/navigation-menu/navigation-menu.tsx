import { Children, forwardRef, type ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  ScrollView,
  type ScrollViewProps,
  View,
  type ViewProps,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const navigationMenuVariants = tv({
  slots: {
    content: "gap-2 rounded-2xl bg-background p-3",
    indicator: "h-1 w-6 rounded-full bg-link",
    item: "rounded-xl",
    link: "min-h-10 flex-row items-center rounded-xl px-3 py-2",
    linkText: "text-sm text-foreground",
    list: "w-full",
    root: "relative gap-2",
    trigger: "min-h-10 flex-row items-center gap-2 rounded-xl px-3 py-2",
    triggerText: "text-sm font-medium text-foreground",
    viewport: "overflow-hidden rounded-2xl border border-border bg-background",
  },
});

export type NavigationMenuVariants = VariantProps<typeof navigationMenuVariants>;

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }
    return child;
  });
}

export interface NavigationMenuRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const NavigationMenuRoot = forwardRef<View, NavigationMenuRootProps>(
  ({ className, ...props }, ref) => {
    const slots = navigationMenuVariants();
    return <View ref={ref} className={slots.root({ className })} {...props} />;
  },
);

export interface NavigationMenuListProps extends ScrollViewProps {
  children?: ReactNode;
  className?: string;
}

const NavigationMenuList = forwardRef<ScrollView, NavigationMenuListProps>(
  ({ className, horizontal = true, showsHorizontalScrollIndicator = false, ...props }, ref) => {
    const slots = navigationMenuVariants();
    return (
      <ScrollView
        ref={ref}
        className={slots.list({ className })}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        {...props}
      />
    );
  },
);

export interface NavigationMenuItemProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const NavigationMenuItem = forwardRef<View, NavigationMenuItemProps>(
  ({ className, ...props }, ref) => {
    const slots = navigationMenuVariants();
    return <Pressable ref={ref} className={slots.item({ className })} {...props} />;
  },
);

export interface NavigationMenuTriggerProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const NavigationMenuTrigger = forwardRef<View, NavigationMenuTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const slots = navigationMenuVariants();
    return (
      <Pressable ref={ref} className={slots.trigger({ className })} {...props}>
        {renderTextChildren(children, slots.triggerText())}
      </Pressable>
    );
  },
);

export interface NavigationMenuLinkProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const NavigationMenuLink = forwardRef<View, NavigationMenuLinkProps>(
  ({ children, className, ...props }, ref) => {
    const slots = navigationMenuVariants();
    return (
      <Pressable ref={ref} className={slots.link({ className })} {...props}>
        {renderTextChildren(children, slots.linkText())}
      </Pressable>
    );
  },
);

export interface NavigationMenuContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const NavigationMenuContent = forwardRef<View, NavigationMenuContentProps>(
  ({ className, ...props }, ref) => {
    const slots = navigationMenuVariants();
    return <View ref={ref} className={slots.content({ className })} {...props} />;
  },
);

export interface NavigationMenuIndicatorProps extends ViewProps {
  className?: string;
}

const NavigationMenuIndicator = forwardRef<View, NavigationMenuIndicatorProps>(
  ({ className, ...props }, ref) => {
    const slots = navigationMenuVariants();
    return <View ref={ref} className={slots.indicator({ className })} {...props} />;
  },
);

export interface NavigationMenuViewportProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const NavigationMenuViewport = forwardRef<View, NavigationMenuViewportProps>(
  ({ className, ...props }, ref) => {
    const slots = navigationMenuVariants();
    return <View ref={ref} className={slots.viewport({ className })} {...props} />;
  },
);

export {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
