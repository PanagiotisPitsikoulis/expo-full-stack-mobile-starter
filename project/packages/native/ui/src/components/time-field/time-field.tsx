import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const timeFieldVariants = tv({
  base: "gap-1.5",
  variants: {
    fullWidth: {
      false: "",
      true: "w-full",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

export type TimeFieldVariants = VariantProps<typeof timeFieldVariants>;

export interface TimeFieldRootProps extends Omit<ViewProps, "children">, TimeFieldVariants {
  children?: ReactNode | ((props: { isDisabled?: boolean; isInvalid?: boolean }) => ReactNode);
  className?: string;
  granularity?: "hour" | "minute" | "second";
  hideTimeZone?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  onChange?: (value: unknown) => void;
  value?: unknown;
}

const TimeFieldRoot = forwardRef<View, TimeFieldRootProps>(
  (
    {
      children,
      className,
      fullWidth,
      granularity: _granularity,
      hideTimeZone: _hideTimeZone,
      isDisabled,
      isInvalid,
      isRequired: _isRequired,
      onChange: _onChange,
      value: _value,
      ...props
    },
    ref,
  ) => {
    return (
      <View
        ref={ref}
        accessibilityState={{ disabled: isDisabled }}
        className={timeFieldVariants({ className, fullWidth })}
        {...props}
      >
        {typeof children === "function" ? children({ isDisabled, isInvalid }) : children}
      </View>
    );
  },
);

TimeFieldRoot.displayName = "PitsiUINative.TimeFieldRoot";

export { TimeFieldRoot };
