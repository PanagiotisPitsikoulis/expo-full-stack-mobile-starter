import { Children, createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  type ListBoxItemRenderProps,
  type ListBoxKey,
  useListBoxContext,
} from "../list-box/list-box";
import { Text } from "../text";

export const listboxItemVariants = tv({
  slots: {
    indicator: "ml-auto size-5 items-center justify-center",
    item: "min-h-11 flex-row items-center gap-3 rounded-2xl px-4 py-3",
    itemText: "text-sm text-foreground",
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

export type ListBoxItemVariants = VariantProps<typeof listboxItemVariants>;

export type ListBoxItemContextValue = {
  renderProps: ListBoxItemRenderProps;
  slots: ReturnType<typeof listboxItemVariants>;
};

export const ListBoxItemContext = createContext<ListBoxItemContextValue | undefined>(undefined);

function useListBoxItemContext() {
  return useContext(ListBoxItemContext);
}

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }

    return child;
  });
}

export interface ListBoxItemRootProps
  extends Omit<PressableProps, "children" | "disabled" | "id">,
    Pick<ListBoxItemVariants, "variant"> {
  children?: ReactNode | ((props: ListBoxItemRenderProps) => ReactNode);
  className?: string;
  id?: ListBoxKey;
  isDisabled?: boolean;
  onAction?: () => void;
  onClick?: () => void;
  textValue?: string;
  value?: ListBoxKey;
}

const ListBoxItemRoot = forwardRef<View, ListBoxItemRootProps>(
  (
    {
      children,
      className,
      id,
      isDisabled,
      onAction,
      onClick,
      onPress,
      textValue,
      value,
      variant,
      ...props
    },
    ref,
  ) => {
    const listBox = useListBoxContext();
    const itemKey = id ?? value;
    const selected = listBox?.isSelected(itemKey) ?? false;
    const disabled = Boolean(isDisabled || listBox?.isDisabled);
    const slots = useMemo(
      () => listboxItemVariants({ isDisabled: disabled, isSelected: selected, variant }),
      [disabled, selected, variant],
    );

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled, selected }}
        className={slots.item({ className })}
        disabled={disabled}
        onPress={(event) => {
          listBox?.selectKey(itemKey);
          onPress?.(event);
          onAction?.();
          onClick?.();
        }}
        {...props}
      >
        {({ pressed }) => {
          const renderProps: ListBoxItemRenderProps = {
            isDisabled: disabled,
            isFocused: false,
            isFocusVisible: false,
            isHovered: false,
            isPressed: pressed,
            isSelected: selected,
          };

          return (
            <ListBoxItemContext.Provider value={{ renderProps, slots }}>
              {renderTextChildren(
                typeof children === "function" ? children(renderProps) : (children ?? textValue),
                slots.itemText(),
              )}
            </ListBoxItemContext.Provider>
          );
        }}
      </Pressable>
    );
  },
);

ListBoxItemRoot.displayName = "PitsiUINative.ListBoxItemRoot";

export interface ListBoxItemIndicatorProps extends Omit<ViewProps, "children"> {
  children?: ReactNode | ((props: ListBoxItemRenderProps) => ReactNode);
  className?: string;
}

const ListBoxItemIndicator = forwardRef<View, ListBoxItemIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const context = useListBoxItemContext();
    const renderProps =
      context?.renderProps ??
      ({
        isDisabled: false,
        isFocused: false,
        isFocusVisible: false,
        isHovered: false,
        isPressed: false,
        isSelected: false,
      } satisfies ListBoxItemRenderProps);
    const content =
      typeof children === "function"
        ? children(renderProps)
        : (children ??
          (renderProps.isSelected ? <Text className="text-sm text-link">✓</Text> : null));

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

ListBoxItemIndicator.displayName = "PitsiUINative.ListBoxItemIndicator";

export { ListBoxItemIndicator, ListBoxItemRoot };
