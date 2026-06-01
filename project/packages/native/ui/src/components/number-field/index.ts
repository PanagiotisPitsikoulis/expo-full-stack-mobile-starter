import type { ComponentProps } from "react";

import {
  NumberFieldDecrementButton,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldInput,
  NumberFieldRoot,
} from "./number-field";

export const NumberField = Object.assign(NumberFieldRoot, {
  DecrementButton: NumberFieldDecrementButton,
  Group: NumberFieldGroup,
  IncrementButton: NumberFieldIncrementButton,
  Input: NumberFieldInput,
  Root: NumberFieldRoot,
});

export type NumberField = {
  DecrementButtonProps: ComponentProps<typeof NumberFieldDecrementButton>;
  GroupProps: ComponentProps<typeof NumberFieldGroup>;
  IncrementButtonProps: ComponentProps<typeof NumberFieldIncrementButton>;
  InputProps: ComponentProps<typeof NumberFieldInput>;
  Props: ComponentProps<typeof NumberFieldRoot>;
  RootProps: ComponentProps<typeof NumberFieldRoot>;
};

export type {
  NumberFieldDecrementButtonProps,
  NumberFieldGroupProps,
  NumberFieldIncrementButtonProps,
  NumberFieldInputProps,
  NumberFieldRootProps,
  NumberFieldRootProps as NumberFieldProps,
  NumberFieldVariants,
} from "./number-field";
export {
  NumberFieldDecrementButton,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldInput,
  NumberFieldRoot,
  numberFieldVariants,
} from "./number-field";
