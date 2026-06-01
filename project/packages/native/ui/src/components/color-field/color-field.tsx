import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import type { ColorValue } from "../color-utils";

export const colorFieldVariants = tv({
  base: "gap-1.5",
});

export type ColorFieldVariants = VariantProps<typeof colorFieldVariants>;

export interface ColorFieldRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  defaultValue?: ColorValue;
  onChange?: (value: ColorValue) => void;
  value?: ColorValue;
}

const ColorFieldRoot = forwardRef<View, ColorFieldRootProps>(
  (
    { className, defaultValue: _defaultValue, onChange: _onChange, value: _value, ...props },
    ref,
  ) => <View ref={ref} className={colorFieldVariants({ className })} {...props} />,
);

ColorFieldRoot.displayName = "PitsiUINative.ColorFieldRoot";

export { ColorFieldRoot };
