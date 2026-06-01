import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { IconMinus, IconPlus } from "../icons";
import { Input, type InputProps } from "../input";
import { TextField } from "../text-field";

export const numberFieldVariants = tv({
  slots: {
    root: "gap-1.5",
    group:
      "h-12 flex-row items-center overflow-hidden rounded-2xl border-[1.5px] border-field bg-field",
    input: "min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none",
    button: "h-full w-11 items-center justify-center bg-transparent",
  },
  variants: {
    fullWidth: {
      false: {},
      true: {
        root: "w-full",
        group: "w-full",
      },
    },
    variant: {
      primary: {},
      secondary: {
        group: "border-default bg-default",
      },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: "primary",
  },
});

export type NumberFieldVariants = VariantProps<typeof numberFieldVariants>;

type NumberFieldContextValue = {
  decrement: () => void;
  displayValue: string;
  increment: () => void;
  isDisabled: boolean;
  isInvalid: boolean;
  setTextValue: (value: string) => void;
  slots: ReturnType<typeof numberFieldVariants>;
  variant: NonNullable<NumberFieldVariants["variant"]>;
};

const NumberFieldContext = createContext<NumberFieldContextValue | undefined>(undefined);

function useNumberField() {
  const context = useContext(NumberFieldContext);

  if (!context) {
    throw new Error("NumberField compound components must be rendered inside NumberField.Root.");
  }

  return context;
}

function clampValue(value: number, minValue?: number, maxValue?: number) {
  if (typeof minValue === "number" && value < minValue) return minValue;
  if (typeof maxValue === "number" && value > maxValue) return maxValue;
  return value;
}

function parseInputValue(value: string, formatOptions?: Intl.NumberFormatOptions) {
  const normalized = value.replace(/[^0-9+-.]/g, "");
  if (!normalized || normalized === "-" || normalized === "." || normalized === "+") {
    return undefined;
  }

  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  if (formatOptions?.style === "percent" && value.includes("%")) {
    return parsed / 100;
  }

  return parsed;
}

function formatInputValue(value: number | undefined, formatOptions?: Intl.NumberFormatOptions) {
  if (value === undefined) return "";

  try {
    return new Intl.NumberFormat(undefined, formatOptions).format(value);
  } catch {
    return String(value);
  }
}

export interface NumberFieldRootProps extends Omit<ViewProps, "children">, NumberFieldVariants {
  children?: ReactNode | ((props: { value: number | undefined }) => ReactNode);
  defaultValue?: number;
  formatOptions?: Intl.NumberFormatOptions;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  maxValue?: number;
  minValue?: number;
  name?: string;
  onChange?: (value: number | undefined) => void;
  step?: number;
  value?: number;
}

const NumberFieldRoot = forwardRef<View, NumberFieldRootProps>(
  (
    {
      children,
      className,
      defaultValue,
      formatOptions,
      fullWidth,
      isDisabled = false,
      isInvalid = false,
      isRequired = false,
      maxValue,
      minValue,
      name: _name,
      onChange,
      step = 1,
      value,
      variant = "primary",
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = value ?? internalValue;
    const slots = useMemo(() => numberFieldVariants({ fullWidth, variant }), [fullWidth, variant]);

    const setValue = useCallback(
      (nextValue: number | undefined) => {
        const clamped =
          typeof nextValue === "number" ? clampValue(nextValue, minValue, maxValue) : undefined;
        if (value === undefined) {
          setInternalValue(clamped);
        }
        onChange?.(clamped);
      },
      [minValue, maxValue, value, onChange],
    );

    const contextValue = useMemo<NumberFieldContextValue>(
      () => ({
        decrement: () => setValue((currentValue ?? 0) - step),
        displayValue: formatInputValue(currentValue, formatOptions),
        increment: () => setValue((currentValue ?? 0) + step),
        isDisabled,
        isInvalid,
        setTextValue: (nextText) => setValue(parseInputValue(nextText, formatOptions)),
        slots,
        variant: variant ?? "primary",
      }),
      [currentValue, formatOptions, isDisabled, isInvalid, slots, step, variant, setValue],
    );

    return (
      <NumberFieldContext.Provider value={contextValue}>
        <TextField
          ref={ref}
          className={slots.root({ className })}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          isRequired={isRequired}
          {...props}
        >
          {typeof children === "function" ? children({ value: currentValue }) : children}
        </TextField>
      </NumberFieldContext.Provider>
    );
  },
);

NumberFieldRoot.displayName = "PitsiUINative.NumberFieldRoot";

export interface NumberFieldGroupProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const NumberFieldGroup = forwardRef<View, NumberFieldGroupProps>(
  ({ children, className, ...props }, ref) => {
    const { slots } = useNumberField();

    return (
      <View ref={ref} className={slots.group({ className })} {...props}>
        {children}
      </View>
    );
  },
);

NumberFieldGroup.displayName = "PitsiUINative.NumberFieldGroup";

export interface NumberFieldInputProps extends Omit<InputProps, "onChange"> {
  onChange?: (event: { target: { value: string }; nativeEvent: { text: string } }) => void;
}

const NumberFieldInput = forwardRef<any, NumberFieldInputProps>(
  (
    { className, keyboardType = "numeric", onChange, onChangeText, value, variant, ...props },
    ref,
  ) => {
    const field = useNumberField();

    return (
      <Input
        ref={ref}
        className={field.slots.input({ className })}
        isDisabled={field.isDisabled}
        isInvalid={field.isInvalid}
        keyboardType={keyboardType}
        onChangeText={(nextValue) => {
          field.setTextValue(nextValue);
          onChangeText?.(nextValue);
          onChange?.({ target: { value: nextValue }, nativeEvent: { text: nextValue } });
        }}
        value={value ?? field.displayValue}
        variant={variant ?? field.variant}
        {...props}
      />
    );
  },
);

NumberFieldInput.displayName = "PitsiUINative.NumberFieldInput";

interface NumberFieldButtonProps extends Omit<PressableProps, "children" | "disabled"> {
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
}

export interface NumberFieldIncrementButtonProps extends NumberFieldButtonProps {}

const NumberFieldIncrementButton = forwardRef<View, NumberFieldIncrementButtonProps>(
  ({ children, className, isDisabled, onPress, ...props }, ref) => {
    const field = useNumberField();
    const disabled = isDisabled ?? field.isDisabled;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={field.slots.button({ className })}
        disabled={disabled}
        onPress={(event) => {
          field.increment();
          onPress?.(event);
        }}
        {...props}
      >
        {children ?? <IconPlus />}
      </Pressable>
    );
  },
);

NumberFieldIncrementButton.displayName = "PitsiUINative.NumberFieldIncrementButton";

export interface NumberFieldDecrementButtonProps extends NumberFieldButtonProps {}

const NumberFieldDecrementButton = forwardRef<View, NumberFieldDecrementButtonProps>(
  ({ children, className, isDisabled, onPress, ...props }, ref) => {
    const field = useNumberField();
    const disabled = isDisabled ?? field.isDisabled;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={field.slots.button({ className })}
        disabled={disabled}
        onPress={(event) => {
          field.decrement();
          onPress?.(event);
        }}
        {...props}
      >
        {children ?? <IconMinus />}
      </Pressable>
    );
  },
);

NumberFieldDecrementButton.displayName = "PitsiUINative.NumberFieldDecrementButton";

export {
  NumberFieldDecrementButton,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldInput,
  NumberFieldRoot,
};
