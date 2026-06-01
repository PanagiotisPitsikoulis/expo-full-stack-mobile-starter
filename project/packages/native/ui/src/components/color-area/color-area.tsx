import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { type ColorValue, colorString } from "../color-utils";

export const colorAreaVariants = tv({
  slots: {
    root: "h-40 w-full overflow-hidden rounded-2xl border border-border bg-default",
    thumb: "size-6 rounded-full border-2 border-background bg-white",
  },
});

export type ColorAreaVariants = VariantProps<typeof colorAreaVariants>;

export interface ColorAreaRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  color?: ColorValue;
  value?: ColorValue;
}

const ColorAreaRoot = forwardRef<View, ColorAreaRootProps>(
  ({ className, color, style, value, ...props }, ref) => {
    const slots = colorAreaVariants();
    return (
      <View
        ref={ref}
        className={slots.root({ className })}
        style={[{ backgroundColor: colorString(color ?? value) }, style]}
        {...props}
      />
    );
  },
);

export interface ColorAreaThumbProps extends ViewProps {
  className?: string;
}

const ColorAreaThumb = forwardRef<View, ColorAreaThumbProps>(({ className, ...props }, ref) => {
  const slots = colorAreaVariants();
  return <View ref={ref} className={slots.thumb({ className })} {...props} />;
});

export { ColorAreaRoot, ColorAreaThumb };
