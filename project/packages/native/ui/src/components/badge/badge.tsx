import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { type StyleProp, type TextProps, View, type ViewProps, type ViewStyle } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

const badgeVariants = tv({
  defaultVariants: {
    color: "default",
    placement: "top-right",
    size: "md",
    variant: "primary",
  },
  slots: {
    anchor: "relative self-start",
    base: "absolute items-center justify-center border border-background",
    label: "font-medium tabular-nums",
  },
  variants: {
    color: {
      accent: {},
      danger: {},
      default: {},
      success: {},
      warning: {},
    },
    placement: {
      "bottom-left": {},
      "bottom-right": {},
      "top-left": {},
      "top-right": {},
    },
    size: {
      lg: {
        base: "min-h-8 min-w-8 rounded-2xl px-2",
        label: "text-sm",
      },
      md: {
        base: "min-h-7 min-w-7 rounded-3xl px-1.5",
        label: "text-xs",
      },
      sm: {
        base: "min-h-4 min-w-4 rounded-xl px-1",
        label: "text-[10px]",
      },
    },
    variant: {
      primary: {},
      secondary: {
        base: "bg-default",
        label: "text-default-foreground",
      },
      soft: {},
    },
  },
  compoundVariants: [
    {
      color: "accent",
      variant: "primary",
      className: { base: "bg-accent", label: "text-accent-foreground" },
    },
    {
      color: "danger",
      variant: "primary",
      className: { base: "bg-danger", label: "text-danger-foreground" },
    },
    {
      color: "default",
      variant: "primary",
      className: { base: "bg-default", label: "text-default-foreground" },
    },
    {
      color: "success",
      variant: "primary",
      className: { base: "bg-success", label: "text-success-foreground" },
    },
    {
      color: "warning",
      variant: "primary",
      className: { base: "bg-warning", label: "text-warning-foreground" },
    },
    { color: "accent", variant: "soft", className: { base: "bg-accent/15", label: "text-accent" } },
    { color: "danger", variant: "soft", className: { base: "bg-danger/15", label: "text-danger" } },
    {
      color: "default",
      variant: "soft",
      className: { base: "bg-default", label: "text-default-foreground" },
    },
    {
      color: "success",
      variant: "soft",
      className: { base: "bg-success/15", label: "text-success" },
    },
    {
      color: "warning",
      variant: "soft",
      className: { base: "bg-warning/15", label: "text-warning" },
    },
  ],
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

interface BadgeContextValue {
  slots: ReturnType<typeof badgeVariants>;
}

const BadgeContext = createContext<BadgeContextValue | null>(null);

export interface BadgeAnchorProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

const BadgeAnchor = forwardRef<View, BadgeAnchorProps>(({ children, className, ...props }, ref) => {
  const slots = badgeVariants();

  return (
    <View className={slots.anchor({ className })} ref={ref} {...props}>
      {children}
    </View>
  );
});

BadgeAnchor.displayName = "PitsiUINative.Badge.Anchor";

export interface BadgeRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  color?: BadgeVariants["color"];
  placement?: BadgeVariants["placement"];
  size?: BadgeVariants["size"];
  variant?: BadgeVariants["variant"];
}

function placementStyle(placement: BadgeVariants["placement"]): StyleProp<ViewStyle> {
  switch (placement) {
    case "bottom-left":
      return { bottom: 0, left: 0, transform: [{ translateX: -4 }, { translateY: 4 }] };
    case "bottom-right":
      return { bottom: 0, right: 0, transform: [{ translateX: 4 }, { translateY: 4 }] };
    case "top-left":
      return { left: 0, top: 0, transform: [{ translateX: -4 }, { translateY: -4 }] };
    default:
      return { right: 0, top: 0, transform: [{ translateX: 4 }, { translateY: -4 }] };
  }
}

const BadgeRoot = forwardRef<View, BadgeRootProps>(
  (
    {
      children,
      className,
      color = "default",
      placement = "top-right",
      size = "md",
      style,
      variant = "primary",
      ...props
    },
    ref,
  ) => {
    const slots = useMemo(
      () => badgeVariants({ color, placement, size, variant }),
      [color, placement, size, variant],
    );
    const content =
      typeof children === "string" || typeof children === "number" ? (
        <BadgeLabel>{children}</BadgeLabel>
      ) : (
        children
      );

    return (
      <BadgeContext.Provider value={{ slots }}>
        <View
          accessibilityRole="text"
          className={slots.base({ className })}
          ref={ref}
          style={[placementStyle(placement), style]}
          {...props}
        >
          {content}
        </View>
      </BadgeContext.Provider>
    );
  },
);

BadgeRoot.displayName = "PitsiUINative.Badge";

export interface BadgeLabelProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const BadgeLabel = forwardRef<React.ElementRef<typeof Text>, BadgeLabelProps>(
  ({ children, className, ...props }, ref) => {
    const context = useContext(BadgeContext);

    return (
      <Text
        className={context?.slots.label({ className }) ?? className}
        numberOfLines={1}
        ref={ref}
        {...props}
      >
        {children}
      </Text>
    );
  },
);

BadgeLabel.displayName = "PitsiUINative.Badge.Label";

export { BadgeAnchor, BadgeLabel, BadgeRoot, badgeVariants };
