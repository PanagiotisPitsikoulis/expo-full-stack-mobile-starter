import type { ComponentProps } from "react";

import {
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
} from "./color-swatch-picker";

export const ColorSwatchPicker = Object.assign(ColorSwatchPickerRoot, {
  Indicator: ColorSwatchPickerIndicator,
  Item: ColorSwatchPickerItem,
  Root: ColorSwatchPickerRoot,
  Swatch: ColorSwatchPickerSwatch,
});

export type ColorSwatchPicker = {
  IndicatorProps: ComponentProps<typeof ColorSwatchPickerIndicator>;
  ItemProps: ComponentProps<typeof ColorSwatchPickerItem>;
  Props: ComponentProps<typeof ColorSwatchPickerRoot>;
  RootProps: ComponentProps<typeof ColorSwatchPickerRoot>;
  SwatchProps: ComponentProps<typeof ColorSwatchPickerSwatch>;
};

export type {
  ColorSwatchPickerIndicatorProps,
  ColorSwatchPickerItemProps,
  ColorSwatchPickerRootProps,
  ColorSwatchPickerRootProps as ColorSwatchPickerProps,
  ColorSwatchPickerSwatchProps,
  ColorSwatchPickerVariants,
} from "./color-swatch-picker";

export {
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
  colorSwatchPickerVariants,
} from "./color-swatch-picker";
