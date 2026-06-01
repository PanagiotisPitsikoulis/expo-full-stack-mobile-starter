import { Children, createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { IconChevronRight } from "../icons";
import { Text } from "../text";

export const menuItemVariants = tv({
  slots: {
    indicator: "size-5 items-center justify-center",
    item: "min-h-10 flex-row items-center gap-3 rounded-xl px-3 py-2",
    itemText: "text-sm text-foreground",
    submenuIndicator: "ml-auto size-5 items-center justify-center",
  },
  variants: {
    isDisabled: {
      false: {},
      true: {
        item: "opacity-disabled",
      },
    },
    isSelected: {
      false: {},
      true: {
        item: "bg-default",
      },
    },
    variant: {
      danger: {
        indicator: "text-danger",
        itemText: "text-danger",
      },
      default: {},
    },
  },
  defaultVariants: {
    isDisabled: false,
    isSelected: false,
    variant: "default",
  },
});

export type MenuItemVariants = VariantProps<typeof menuItemVariants>;
export type MenuItemKey = string | number;

export type MenuItemRenderProps = {
  hasSubmenu: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  isPressed: boolean;
  isSelected: boolean;
};

type MenuItemContextValue = {
  renderProps: MenuItemRenderProps;
  slots: ReturnType<typeof menuItemVariants>;
};

const MenuItemContext = createContext<MenuItemContextValue | undefined>(undefined);

function useMenuItemContext() {
  return useContext(MenuItemContext);
}

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }

    return child;
  });
}

export interface MenuItemRootProps
  extends Omit<PressableProps, "children" | "disabled" | "id">,
    Pick<MenuItemVariants, "variant"> {
  children?: ReactNode | ((props: MenuItemRenderProps) => ReactNode);
  className?: string;
  hasSubmenu?: boolean;
  id?: MenuItemKey;
  isDisabled?: boolean;
  isSelected?: boolean;
  onAction?: () => void;
  onClick?: () => void;
  textValue?: string;
}

const MenuItemRoot = forwardRef<View, MenuItemRootProps>(
  (
    {
      children,
      className,
      hasSubmenu = false,
      id: _id,
      isDisabled = false,
      isSelected = false,
      onAction,
      onClick,
      onPress,
      textValue,
      variant,
      ...props
    },
    ref,
  ) => {
    const slots = useMemo(
      () => menuItemVariants({ isDisabled, isSelected, variant }),
      [isDisabled, isSelected, variant],
    );

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, selected: isSelected }}
        className={slots.item({ className })}
        disabled={isDisabled}
        onPress={(event) => {
          onPress?.(event);
          onAction?.();
          onClick?.();
        }}
        {...props}
      >
        {({ pressed }) => {
          const renderProps: MenuItemRenderProps = {
            hasSubmenu,
            isDisabled,
            isFocused: false,
            isFocusVisible: false,
            isHovered: false,
            isPressed: pressed,
            isSelected,
          };

          return (
            <MenuItemContext.Provider value={{ renderProps, slots }}>
              {renderTextChildren(
                typeof children === "function" ? children(renderProps) : (children ?? textValue),
                slots.itemText(),
              )}
            </MenuItemContext.Provider>
          );
        }}
      </Pressable>
    );
  },
);

MenuItemRoot.displayName = "PitsiUINative.MenuItemRoot";

export interface MenuItemIndicatorProps extends Omit<ViewProps, "children"> {
  children?: ReactNode | ((props: MenuItemRenderProps) => ReactNode);
  className?: string;
  type?: "checkmark" | "dot";
}

const MenuItemIndicator = forwardRef<View, MenuItemIndicatorProps>(
  ({ children, className, type = "checkmark", ...props }, ref) => {
    const context = useMenuItemContext();
    const renderProps =
      context?.renderProps ??
      ({
        hasSubmenu: false,
        isDisabled: false,
        isFocused: false,
        isFocusVisible: false,
        isHovered: false,
        isPressed: false,
        isSelected: false,
      } satisfies MenuItemRenderProps);
    const fallback =
      type === "dot" ? (
        <Text className="text-sm text-link">•</Text>
      ) : (
        <Text className="text-sm text-link">✓</Text>
      );
    const content =
      typeof children === "function"
        ? children(renderProps)
        : (children ?? (renderProps.isSelected ? fallback : null));

    if (!content) {
      return null;
    }

    return (
      <View ref={ref} className={context?.slots.indicator({ className }) ?? className} {...props}>
        {content}
      </View>
    );
  },
);

MenuItemIndicator.displayName = "PitsiUINative.MenuItemIndicator";

export interface MenuItemSubmenuIndicatorProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const MenuItemSubmenuIndicator = forwardRef<View, MenuItemSubmenuIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const context = useMenuItemContext();

    if (context && !context.renderProps.hasSubmenu) {
      return null;
    }

    return (
      <View
        ref={ref}
        className={context?.slots.submenuIndicator({ className }) ?? className}
        {...props}
      >
        {children ?? <IconChevronRight className="text-muted" />}
      </View>
    );
  },
);

MenuItemSubmenuIndicator.displayName = "PitsiUINative.MenuItemSubmenuIndicator";

export { MenuItemIndicator, MenuItemRoot, MenuItemSubmenuIndicator };
