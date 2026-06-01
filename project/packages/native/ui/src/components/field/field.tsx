import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { type Text as NativeText, type TextProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

const fieldVariants = tv({
  defaultVariants: {
    disabled: false,
    invalid: false,
    required: false,
  },
  slots: {
    base: "flex-col gap-1.5",
    control: "flex-col gap-1.5",
    description: "text-xs text-muted",
    error: "text-xs text-danger",
    label: "text-sm font-medium text-foreground",
  },
  variants: {
    disabled: {
      false: {},
      true: {
        base: "opacity-disabled",
      },
    },
    invalid: {
      false: {},
      true: {
        label: "text-danger",
      },
    },
    required: {
      false: {},
      true: {},
    },
  },
});

export type FieldVariants = VariantProps<typeof fieldVariants>;

interface FieldContextValue {
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  slots: ReturnType<typeof fieldVariants>;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return useContext(FieldContext);
}

export interface FieldRootProps extends ViewProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}

const FieldRoot = forwardRef<View, FieldRootProps>(
  ({ children, className, disabled = false, invalid = false, required = false, ...props }, ref) => {
    const slots = useMemo(
      () => fieldVariants({ disabled, invalid, required }),
      [disabled, invalid, required],
    );
    const context = useMemo(
      () => ({ disabled, invalid, required, slots }),
      [disabled, invalid, required, slots],
    );

    return (
      <FieldContext.Provider value={context}>
        <View
          accessibilityState={{ disabled }}
          className={slots.base({ className })}
          ref={ref}
          {...props}
        >
          {children}
        </View>
      </FieldContext.Provider>
    );
  },
);

FieldRoot.displayName = "PitsiUINative.Field";

export interface FieldLabelProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const FieldLabel = forwardRef<NativeText, FieldLabelProps>(
  ({ children, className, ...props }, ref) => {
    const context = useFieldContext();

    return (
      <Text className={context?.slots.label({ className }) ?? className} ref={ref} {...props}>
        {children}
        {context?.required ? <Text className="text-danger"> *</Text> : null}
      </Text>
    );
  },
);

FieldLabel.displayName = "PitsiUINative.Field.Label";

export interface FieldControlProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const FieldControl = forwardRef<View, FieldControlProps>(
  ({ children, className, ...props }, ref) => {
    const context = useFieldContext();

    return (
      <View className={context?.slots.control({ className }) ?? className} ref={ref} {...props}>
        {children}
      </View>
    );
  },
);

FieldControl.displayName = "PitsiUINative.Field.Control";

export interface FieldDescriptionProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const FieldDescription = forwardRef<NativeText, FieldDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    const context = useFieldContext();

    return (
      <Text className={context?.slots.description({ className }) ?? className} ref={ref} {...props}>
        {children}
      </Text>
    );
  },
);

FieldDescription.displayName = "PitsiUINative.Field.Description";

export interface FieldErrorProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const FieldError = forwardRef<NativeText, FieldErrorProps>(
  ({ children, className, ...props }, ref) => {
    const context = useFieldContext();

    if (!context?.invalid && !children) return null;

    return (
      <Text
        accessibilityLiveRegion="polite"
        className={context?.slots.error({ className }) ?? className}
        ref={ref}
        role="alert"
        {...props}
      >
        {children}
      </Text>
    );
  },
);

FieldError.displayName = "PitsiUINative.Field.Error";

export { FieldControl, FieldDescription, FieldError, FieldLabel, FieldRoot, fieldVariants };
