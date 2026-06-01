import type { ComponentProps } from "react";

import {
  ColorInputGroupInput,
  ColorInputGroupPrefix,
  ColorInputGroupRoot,
  ColorInputGroupSuffix,
} from "./color-input-group";

export const ColorInputGroup = Object.assign(ColorInputGroupRoot, {
  Input: ColorInputGroupInput,
  Prefix: ColorInputGroupPrefix,
  Root: ColorInputGroupRoot,
  Suffix: ColorInputGroupSuffix,
});

export type ColorInputGroup = {
  InputProps: ComponentProps<typeof ColorInputGroupInput>;
  PrefixProps: ComponentProps<typeof ColorInputGroupPrefix>;
  Props: ComponentProps<typeof ColorInputGroupRoot>;
  RootProps: ComponentProps<typeof ColorInputGroupRoot>;
  SuffixProps: ComponentProps<typeof ColorInputGroupSuffix>;
};

export type {
  ColorInputGroupInputProps,
  ColorInputGroupPrefixProps,
  ColorInputGroupRootProps,
  ColorInputGroupRootProps as ColorInputGroupProps,
  ColorInputGroupSuffixProps,
  ColorInputGroupVariants,
} from "./color-input-group";

export {
  ColorInputGroupInput,
  ColorInputGroupPrefix,
  ColorInputGroupRoot,
  ColorInputGroupSuffix,
  colorInputGroupVariants,
} from "./color-input-group";
