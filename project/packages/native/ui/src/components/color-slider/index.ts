import type { ComponentProps } from "react";

import {
  ColorSliderOutput,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
} from "./color-slider";

export const ColorSlider = Object.assign(ColorSliderRoot, {
  Output: ColorSliderOutput,
  Root: ColorSliderRoot,
  Thumb: ColorSliderThumb,
  Track: ColorSliderTrack,
});

export type ColorSlider = {
  OutputProps: ComponentProps<typeof ColorSliderOutput>;
  Props: ComponentProps<typeof ColorSliderRoot>;
  RootProps: ComponentProps<typeof ColorSliderRoot>;
  ThumbProps: ComponentProps<typeof ColorSliderThumb>;
  TrackProps: ComponentProps<typeof ColorSliderTrack>;
};

export type {
  AlphaChannel,
  ColorSliderChannelProps,
  ColorSliderOutputProps,
  ColorSliderRootProps,
  ColorSliderRootProps as ColorSliderProps,
  ColorSliderThumbProps,
  ColorSliderTrackProps,
  ColorSliderVariants,
  HSBChannel,
  HSLChannel,
  HSLHSBSharedChannel,
  RGBChannel,
} from "./color-slider";

export {
  ColorSliderOutput,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  colorSliderVariants,
} from "./color-slider";
