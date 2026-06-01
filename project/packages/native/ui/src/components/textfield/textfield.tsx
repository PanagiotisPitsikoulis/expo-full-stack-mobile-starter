import { createContext, forwardRef, type ReactNode, useMemo } from "react";
import type { View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  TextField as NativeTextField,
  type TextFieldRootProps as NativeTextFieldRootProps,
} from "../text-field";

export const textFieldVariants = tv({
  base: "",
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

export type TextFieldVariants = VariantProps<typeof textFieldVariants>;

export type TextFieldContextValue = {
  onChange?: (value: string) => void;
  value?: string | number;
  variant?: "primary" | "secondary";
};

export const TextFieldContext = createContext<TextFieldContextValue>({});

export interface TextFieldRootProps
  extends Omit<NativeTextFieldRootProps, "children">,
    TextFieldVariants {
  children?: ReactNode | ((props: TextFieldContextValue) => ReactNode);
  name?: string;
  onChange?: (value: string) => void;
  type?: string;
  value?: string | number;
  variant?: "primary" | "secondary";
}

const TextFieldRoot = forwardRef<View, TextFieldRootProps>(
  (
    {
      children,
      className,
      fullWidth,
      name: _name,
      onChange,
      type: _type,
      value,
      variant,
      ...props
    },
    ref,
  ) => {
    const rootClassName = textFieldVariants({ className, fullWidth });
    const contextValue = useMemo(
      () => ({
        onChange,
        value,
        variant,
      }),
      [onChange, value, variant],
    );

    return (
      <TextFieldContext.Provider value={contextValue}>
        <NativeTextField ref={ref} className={rootClassName} {...props}>
          {typeof children === "function" ? children(contextValue) : children}
        </NativeTextField>
      </TextFieldContext.Provider>
    );
  },
);

TextFieldRoot.displayName = "PitsiUINative.TextFieldRoot";

export { TextFieldRoot };
