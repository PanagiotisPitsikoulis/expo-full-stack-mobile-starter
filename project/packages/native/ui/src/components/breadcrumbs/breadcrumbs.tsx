import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
} from "react";
import { Linking, Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

const breadcrumbsVariants = tv({
  slots: {
    base: "flex-row flex-wrap items-center",
    item: "flex-row items-center gap-1 px-0.5",
    link: "text-sm font-medium text-muted underline-offset-4",
    linkCurrent: "text-link",
    separator: "text-xs text-muted",
  },
});

export type BreadcrumbsVariants = VariantProps<typeof breadcrumbsVariants>;

interface BreadcrumbsContextValue {
  separator?: ReactNode;
  slots: ReturnType<typeof breadcrumbsVariants>;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextValue | null>(null);

export interface BreadcrumbsRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  separator?: ReactNode;
}

const BreadcrumbsRoot = forwardRef<View, BreadcrumbsRootProps>(
  ({ children, className, separator, ...props }, ref) => {
    const slots = breadcrumbsVariants();
    const childArray = Children.toArray(children);

    return (
      <BreadcrumbsContext.Provider value={{ separator, slots }}>
        <View className={slots.base({ className })} ref={ref} {...props}>
          {childArray.map((child, index) => {
            if (!isValidElement(child)) return child;

            return cloneElement(child as ReactElement<BreadcrumbsItemProps>, {
              isLast: index === childArray.length - 1,
            });
          })}
        </View>
      </BreadcrumbsContext.Provider>
    );
  },
);

BreadcrumbsRoot.displayName = "PitsiUINative.Breadcrumbs";

export interface BreadcrumbsItemProps extends Omit<PressableProps, "children"> {
  children?: ReactNode;
  className?: string;
  href?: string;
  isCurrent?: boolean;
  isDisabled?: boolean;
  isLast?: boolean;
}

function openHref(href: string | undefined) {
  if (!href || href.startsWith("#") || href.startsWith("/")) return;
  void Linking.openURL(href);
}

function renderSeparator(separator: ReactNode) {
  if (separator == null) return <Text className="text-xs text-muted">&gt;</Text>;
  if (typeof separator === "string" || typeof separator === "number") {
    return <Text className="text-xs text-muted">{separator}</Text>;
  }
  return separator;
}

const BreadcrumbsItem = forwardRef<View, BreadcrumbsItemProps>(
  (
    {
      children,
      className,
      href,
      isCurrent = false,
      isDisabled = false,
      isLast = false,
      onPress,
      ...props
    },
    ref,
  ) => {
    const context = useContext(BreadcrumbsContext);
    const slots = context?.slots ?? breadcrumbsVariants();
    const current = isCurrent || isLast;
    const disabled = isDisabled || current;

    return (
      <View className={slots.item({ className })}>
        <Pressable
          accessibilityRole="link"
          accessibilityState={{ disabled, selected: current }}
          disabled={disabled}
          onPress={(event) => {
            onPress?.(event);
            if (!event.defaultPrevented) openHref(href);
          }}
          ref={ref}
          {...props}
        >
          <Text
            className={`${slots.link()} ${current ? slots.linkCurrent() : ""}`}
            numberOfLines={1}
          >
            {children}
          </Text>
        </Pressable>
        {!current ? renderSeparator(context?.separator) : null}
      </View>
    );
  },
);

BreadcrumbsItem.displayName = "PitsiUINative.Breadcrumbs.Item";

export { BreadcrumbsItem, BreadcrumbsRoot, breadcrumbsVariants };
