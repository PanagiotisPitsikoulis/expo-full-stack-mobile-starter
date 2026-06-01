import { forwardRef, type ReactNode, useState } from "react";
import { Pressable, type PressableProps, type View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const toggleButtonVariants = tv({
  base: "flex-row items-center justify-center gap-2 rounded-3xl",
  variants: {
    isIconOnly: {
      false: "",
      true: "px-0",
    },
    isSelected: {
      false: "",
      true: "bg-accent-soft",
    },
    size: {
      lg: "h-11 px-5",
      md: "h-10 px-4",
      sm: "h-9 px-3",
    },
    variant: {
      default: "bg-default",
      ghost: "bg-transparent",
    },
  },
  compoundVariants: [
    { isIconOnly: true, size: "lg", className: "w-11" },
    { isIconOnly: true, size: "md", className: "w-10" },
    { isIconOnly: true, size: "sm", className: "w-9" },
  ],
  defaultVariants: {
    isIconOnly: false,
    isSelected: false,
    size: "md",
    variant: "default",
  },
});

export type ToggleButtonVariants = VariantProps<typeof toggleButtonVariants>;

export interface ToggleButtonRenderProps {
  isSelected: boolean;
}

export interface ToggleButtonRootProps
  extends Omit<PressableProps, "children" | "disabled" | "id">,
    ToggleButtonVariants {
  children?: ReactNode | ((props: ToggleButtonRenderProps) => ReactNode);
  className?: string;
  defaultSelected?: boolean;
  id?: string | number;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  isSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  value?: string | number;
}

const ToggleButtonRoot = forwardRef<View, ToggleButtonRootProps>(
  (
    {
      children,
      className,
      defaultSelected = false,
      id: _id,
      isDisabled = false,
      isIconOnly = false,
      isSelected,
      onChange,
      onPress,
      size = "md",
      value: _value,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const [internalSelected, setInternalSelected] = useState(defaultSelected);
    const selected = isSelected ?? internalSelected;
    const styles = toggleButtonVariants({
      className,
      isIconOnly,
      isSelected: selected,
      size,
      variant,
    });

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, selected }}
        className={styles}
        disabled={isDisabled}
        onPress={(event) => {
          const next = !selected;
          if (isSelected === undefined) setInternalSelected(next);
          onChange?.(next);
          onPress?.(event);
        }}
        ref={ref}
        {...props}
      >
        {typeof children === "function" ? (
          children({ isSelected: selected })
        ) : typeof children === "string" || typeof children === "number" ? (
          <Text className="text-sm font-medium text-foreground">{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  },
);

ToggleButtonRoot.displayName = "PitsiUINative.ToggleButton";

export { ToggleButtonRoot };
