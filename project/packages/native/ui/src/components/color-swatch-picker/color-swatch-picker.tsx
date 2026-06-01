import { forwardRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";
import { ColorSwatchRoot, type ColorSwatchRootProps } from "../color-swatch";
import { type ColorValue, colorString } from "../color-utils";
import { Text } from "../text";

export const colorSwatchPickerVariants = tv({
  slots: {
    indicator: "absolute inset-0 items-center justify-center rounded-full",
    item: "size-10 items-center justify-center rounded-full",
    root: "flex-row flex-wrap gap-2",
  },
});

export type ColorSwatchPickerVariants = VariantProps<typeof colorSwatchPickerVariants>;

export interface ColorSwatchPickerRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ColorSwatchPickerRoot = forwardRef<View, ColorSwatchPickerRootProps>(
  ({ className, ...props }, ref) => {
    const slots = colorSwatchPickerVariants();
    return <View ref={ref} className={slots.root({ className })} {...props} />;
  },
);

export interface ColorSwatchPickerItemProps extends PressableProps {
  children?: ReactNode;
  className?: string;
  color?: ColorValue;
  value?: ColorValue;
}

const ColorSwatchPickerItem = forwardRef<View, ColorSwatchPickerItemProps>(
  ({ children, className, color, value, ...props }, ref) => {
    const slots = colorSwatchPickerVariants();
    return (
      <Pressable ref={ref} className={slots.item({ className })} {...props}>
        {children ?? <ColorSwatchRoot color={colorString(color ?? value)} />}
      </Pressable>
    );
  },
);

export interface ColorSwatchPickerIndicatorProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ColorSwatchPickerIndicator = forwardRef<View, ColorSwatchPickerIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const slots = colorSwatchPickerVariants();
    return (
      <View ref={ref} className={slots.indicator({ className })} {...props}>
        {children ?? <Text className="text-xs text-background">✓</Text>}
      </View>
    );
  },
);

export interface ColorSwatchPickerSwatchProps extends ColorSwatchRootProps {}

const ColorSwatchPickerSwatch = ColorSwatchRoot;

export {
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
};
