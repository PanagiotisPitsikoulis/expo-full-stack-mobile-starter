import type { ComponentProps } from "react";

import { ColorAreaRoot, ColorAreaThumb } from "./color-area";

export const ColorArea = Object.assign(ColorAreaRoot, {
  Root: ColorAreaRoot,
  Thumb: ColorAreaThumb,
});

export type ColorArea = {
  Props: ComponentProps<typeof ColorAreaRoot>;
  RootProps: ComponentProps<typeof ColorAreaRoot>;
  ThumbProps: ComponentProps<typeof ColorAreaThumb>;
};

export type {
  ColorAreaRootProps,
  ColorAreaRootProps as ColorAreaProps,
  ColorAreaThumbProps,
  ColorAreaVariants,
} from "./color-area";

export { ColorAreaRoot, ColorAreaThumb, colorAreaVariants } from "./color-area";
