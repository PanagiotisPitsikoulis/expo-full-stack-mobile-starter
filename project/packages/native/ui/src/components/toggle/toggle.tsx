import { forwardRef, type ReactNode, useState } from "react";
import { Pressable, type PressableProps, type View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const toggleVariants = tv({
  base: "h-9 flex-row items-center justify-center gap-2 rounded-md px-3",
  variants: {
    isSelected: {
      false: "bg-transparent",
      true: "bg-default",
    },
    size: {
      default: "h-9 px-3",
      lg: "h-10 px-4",
      sm: "h-8 px-2",
    },
    variant: {
      default: "",
      outline: "border border-border",
    },
  },
  defaultVariants: {
    isSelected: false,
    size: "default",
    variant: "default",
  },
});

export type ToggleVariants = VariantProps<typeof toggleVariants>;

export interface ToggleRenderProps {
  isSelected: boolean;
}

export interface ToggleRootProps
  extends Omit<PressableProps, "children" | "disabled">,
    ToggleVariants {
  children?: ReactNode | ((props: ToggleRenderProps) => ReactNode);
  className?: string;
  defaultPressed?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  onPressedChange?: (pressed: boolean) => void;
  pressed?: boolean;
}

const ToggleRoot = forwardRef<View, ToggleRootProps>(
  (
    {
      children,
      className,
      defaultPressed,
      defaultSelected,
      isDisabled = false,
      isSelected,
      onChange,
      onPress,
      onPressedChange,
      pressed,
      size = "default",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const controlled = pressed ?? isSelected;
    const [internalSelected, setInternalSelected] = useState(
      defaultPressed ?? defaultSelected ?? false,
    );
    const selected = controlled ?? internalSelected;
    const styles = toggleVariants({ className, isSelected: selected, size, variant });

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, selected }}
        className={styles}
        disabled={isDisabled}
        onPress={(event) => {
          const next = !selected;
          if (controlled === undefined) setInternalSelected(next);
          onChange?.(next);
          onPressedChange?.(next);
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

ToggleRoot.displayName = "PitsiUINative.Toggle";

export { ToggleRoot };
