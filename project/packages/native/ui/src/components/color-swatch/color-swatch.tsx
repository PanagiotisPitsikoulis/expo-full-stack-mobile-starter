import { forwardRef } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { type ColorValue, colorString } from "../color-utils";

export const colorSwatchVariants = tv({
  base: "size-8 rounded-full border border-border",
});

export type ColorSwatchVariants = VariantProps<typeof colorSwatchVariants>;

export interface ColorSwatchRootProps extends ViewProps {
  className?: string;
  color?: ColorValue;
  value?: ColorValue;
}

const ColorSwatchRoot = forwardRef<View, ColorSwatchRootProps>(
  ({ className, color, style, value, ...props }, ref) => (
    <View
      ref={ref}
      className={colorSwatchVariants({ className })}
      style={[{ backgroundColor: colorString(color ?? value) }, style]}
      {...props}
    />
  ),
);

ColorSwatchRoot.displayName = "PitsiUINative.ColorSwatchRoot";

export { ColorSwatchRoot };
