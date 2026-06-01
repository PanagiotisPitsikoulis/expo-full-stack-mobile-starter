import type { ComponentProps } from "react";

import {
  ColorInputGroupInput,
  ColorInputGroupPrefix,
  ColorInputGroupRoot,
  ColorInputGroupSuffix,
} from "../color-input-group";
import type { ColorValue } from "../color-utils";
import { ColorFieldRoot } from "./color-field";

export const ColorField = Object.assign(ColorFieldRoot, {
  Group: ColorInputGroupRoot,
  Input: ColorInputGroupInput,
  Prefix: ColorInputGroupPrefix,
  Root: ColorFieldRoot,
  Suffix: ColorInputGroupSuffix,
});

export type ColorField = {
  GroupProps: ComponentProps<typeof ColorInputGroupRoot>;
  InputProps: ComponentProps<typeof ColorInputGroupInput>;
  PrefixProps: ComponentProps<typeof ColorInputGroupPrefix>;
  Props: ComponentProps<typeof ColorFieldRoot>;
  RootProps: ComponentProps<typeof ColorFieldRoot>;
  SuffixProps: ComponentProps<typeof ColorInputGroupSuffix>;
};

export type {
  ColorFieldRootProps,
  ColorFieldRootProps as ColorFieldProps,
  ColorFieldVariants,
} from "./color-field";
export { ColorFieldRoot, colorFieldVariants } from "./color-field";
export type { ColorValue };
