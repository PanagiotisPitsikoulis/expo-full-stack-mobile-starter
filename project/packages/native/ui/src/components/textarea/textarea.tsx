import { forwardRef, useContext } from "react";
import type { TextInput as TextInputType } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  TextArea as NativeTextArea,
  type TextAreaProps as NativeTextAreaProps,
} from "../text-area";
import { TextFieldContext } from "../textfield";

export const textAreaVariants = tv({
  base: "",
  variants: {
    fullWidth: {
      false: "",
      true: "w-full",
    },
    variant: {
      primary: "",
      secondary: "",
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: "primary",
  },
});

export type TextAreaVariants = VariantProps<typeof textAreaVariants>;

export interface TextAreaRootProps extends Omit<NativeTextAreaProps, "onChange">, TextAreaVariants {
  onChange?: (event: { target: { value: string }; nativeEvent: { text: string } }) => void;
  rows?: number;
}

const TextAreaRoot = forwardRef<TextInputType, TextAreaRootProps>(
  (
    {
      className,
      fullWidth,
      onChange,
      onChangeText,
      rows,
      style,
      value,
      variant: variantProp,
      ...props
    },
    ref,
  ) => {
    const textField = useContext(TextFieldContext);
    const resolvedVariant = variantProp ?? textField.variant;
    const resolvedValue =
      value ?? (typeof textField.value === "string" ? textField.value : undefined);
    const rootClassName = textAreaVariants({
      className,
      fullWidth,
      variant: resolvedVariant,
    });
    const rowStyle = rows ? { minHeight: Math.max(1, rows) * 24 + 24 } : undefined;

    return (
      <NativeTextArea
        ref={ref}
        className={rootClassName}
        onChangeText={(nextValue) => {
          textField.onChange?.(nextValue);
          onChangeText?.(nextValue);
          onChange?.({ target: { value: nextValue }, nativeEvent: { text: nextValue } });
        }}
        style={[rowStyle, style]}
        value={resolvedValue}
        variant={resolvedVariant}
        {...props}
      />
    );
  },
);

TextAreaRoot.displayName = "PitsiUINative.TextAreaRoot";

export { TextAreaRoot };
