import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import {
  type Text as NativeText,
  Pressable,
  type PressableProps,
  type TextProps,
  View,
  type ViewProps,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

const itemVariants = tv({
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  slots: {
    actions: "shrink-0 flex-row items-center gap-1",
    base: "flex-row items-center gap-3 rounded-md px-3 py-2",
    content: "min-w-0 flex-1 flex-col",
    description: "text-xs text-muted",
    media: "shrink-0 items-center justify-center",
    title: "text-sm font-medium text-foreground",
  },
  variants: {
    size: {
      lg: {
        base: "gap-4 rounded-lg px-4 py-3",
        description: "text-sm",
        title: "text-base",
      },
      md: {},
      sm: {
        base: "gap-2 rounded-sm px-2 py-1",
        description: "text-[11px]",
        title: "text-xs",
      },
    },
    variant: {
      default: {
        base: "bg-transparent",
      },
      ghost: {
        base: "bg-transparent",
      },
    },
  },
});

export type ItemVariants = VariantProps<typeof itemVariants>;

interface ItemContextValue {
  slots: ReturnType<typeof itemVariants>;
}

const ItemContext = createContext<ItemContextValue | null>(null);

function useItemContext() {
  return useContext(ItemContext);
}

export interface ItemRootProps extends PressableProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  size?: ItemVariants["size"];
  variant?: ItemVariants["variant"];
}

const ItemRoot = forwardRef<View, ItemRootProps>(
  (
    { children, className, disabled = false, onPress, size = "md", variant = "default", ...props },
    ref,
  ) => {
    const slots = useMemo(() => itemVariants({ size, variant }), [size, variant]);
    const content = <ItemContext.Provider value={{ slots }}>{children}</ItemContext.Provider>;

    if (onPress) {
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          className={slots.base({ className })}
          disabled={disabled}
          onPress={onPress}
          ref={ref}
          {...props}
        >
          {content}
        </Pressable>
      );
    }

    return (
      <View
        accessibilityState={{ disabled }}
        className={slots.base({ className })}
        ref={ref}
        {...(props as ViewProps)}
      >
        {content}
      </View>
    );
  },
);

ItemRoot.displayName = "PitsiUINative.Item";

export interface ItemMediaProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ItemMedia = forwardRef<View, ItemMediaProps>(({ children, className, ...props }, ref) => {
  const context = useItemContext();

  return (
    <View className={context?.slots.media({ className }) ?? className} ref={ref} {...props}>
      {children}
    </View>
  );
});

ItemMedia.displayName = "PitsiUINative.Item.Media";

export interface ItemContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ItemContent = forwardRef<View, ItemContentProps>(({ children, className, ...props }, ref) => {
  const context = useItemContext();

  return (
    <View className={context?.slots.content({ className }) ?? className} ref={ref} {...props}>
      {children}
    </View>
  );
});

ItemContent.displayName = "PitsiUINative.Item.Content";

export interface ItemTitleProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const ItemTitle = forwardRef<NativeText, ItemTitleProps>(
  ({ children, className, ...props }, ref) => {
    const context = useItemContext();

    return (
      <Text
        className={context?.slots.title({ className }) ?? className}
        numberOfLines={1}
        ref={ref}
        {...props}
      >
        {children}
      </Text>
    );
  },
);

ItemTitle.displayName = "PitsiUINative.Item.Title";

export interface ItemDescriptionProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const ItemDescription = forwardRef<NativeText, ItemDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    const context = useItemContext();

    return (
      <Text
        className={context?.slots.description({ className }) ?? className}
        numberOfLines={1}
        ref={ref}
        {...props}
      >
        {children}
      </Text>
    );
  },
);

ItemDescription.displayName = "PitsiUINative.Item.Description";

export interface ItemActionsProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ItemActions = forwardRef<View, ItemActionsProps>(({ children, className, ...props }, ref) => {
  const context = useItemContext();

  return (
    <View className={context?.slots.actions({ className }) ?? className} ref={ref} {...props}>
      {children}
    </View>
  );
});

ItemActions.displayName = "PitsiUINative.Item.Actions";

export { ItemActions, ItemContent, ItemDescription, ItemMedia, ItemRoot, ItemTitle, itemVariants };
