import { forwardRef, type ReactNode } from "react";
import { type TextProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { type ColorValue, colorString } from "../color-utils";
import { Text } from "../text";

export type AlphaChannel = "alpha";
export type RGBChannel = "blue" | "green" | "red";
export type HSLHSBSharedChannel = "hue" | "saturation";
export type HSLChannel = HSLHSBSharedChannel | "lightness";
export type HSBChannel = HSLHSBSharedChannel | "brightness";

export const colorSliderVariants = tv({
  slots: {
    output: "text-xs text-muted",
    root: "gap-2",
    thumb: "size-6 rounded-full border-2 border-background bg-white",
    track: "h-3 overflow-hidden rounded-full bg-default",
  },
});

export type ColorSliderVariants = VariantProps<typeof colorSliderVariants>;

export interface ColorSliderRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ColorSliderRoot = forwardRef<View, ColorSliderRootProps>(({ className, ...props }, ref) => {
  const slots = colorSliderVariants();
  return <View ref={ref} className={slots.root({ className })} {...props} />;
});

export interface ColorSliderTrackProps extends ViewProps {
  className?: string;
  color?: ColorValue;
  value?: ColorValue;
}

const ColorSliderTrack = forwardRef<View, ColorSliderTrackProps>(
  ({ className, color, style, value, ...props }, ref) => {
    const slots = colorSliderVariants();
    return (
      <View
        ref={ref}
        className={slots.track({ className })}
        style={[{ backgroundColor: colorString(color ?? value) }, style]}
        {...props}
      />
    );
  },
);

export interface ColorSliderThumbProps extends ViewProps {
  className?: string;
}

const ColorSliderThumb = forwardRef<View, ColorSliderThumbProps>(({ className, ...props }, ref) => {
  const slots = colorSliderVariants();
  return <View ref={ref} className={slots.thumb({ className })} {...props} />;
});

export interface ColorSliderOutputProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const ColorSliderOutput = forwardRef<any, ColorSliderOutputProps>(
  ({ className, ...props }, ref) => {
    const slots = colorSliderVariants();
    return <Text ref={ref} className={slots.output({ className })} {...props} />;
  },
);

export interface ColorSliderChannelProps extends ViewProps {
  className?: string;
}

export { ColorSliderOutput, ColorSliderRoot, ColorSliderThumb, ColorSliderTrack };
