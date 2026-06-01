import type { ComponentProps } from "react";

import { ColorSwatchRoot } from "./color-swatch";

export const ColorSwatch = Object.assign(ColorSwatchRoot, {
  Root: ColorSwatchRoot,
});

export type ColorSwatch = {
  Props: ComponentProps<typeof ColorSwatchRoot>;
  RootProps: ComponentProps<typeof ColorSwatchRoot>;
};

export type {
  ColorSwatchRootProps,
  ColorSwatchRootProps as ColorSwatchProps,
  ColorSwatchVariants,
} from "./color-swatch";

export { ColorSwatchRoot, colorSwatchVariants } from "./color-swatch";
