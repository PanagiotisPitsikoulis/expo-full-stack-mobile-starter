import type { ComponentProps } from "react";

import {
  FieldControl,
  FieldDescription,
  FieldError as FieldInlineError,
  FieldLabel,
  FieldRoot,
} from "./field";

export const Field = Object.assign(FieldRoot, {
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldInlineError,
  Label: FieldLabel,
  Root: FieldRoot,
});

export type Field = {
  ControlProps: ComponentProps<typeof FieldControl>;
  DescriptionProps: ComponentProps<typeof FieldDescription>;
  ErrorProps: ComponentProps<typeof FieldInlineError>;
  LabelProps: ComponentProps<typeof FieldLabel>;
  Props: ComponentProps<typeof FieldRoot>;
  RootProps: ComponentProps<typeof FieldRoot>;
};

export type {
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorProps as FieldInlineErrorProps,
  FieldLabelProps,
  FieldRootProps,
  FieldRootProps as FieldProps,
  FieldVariants,
} from "./field";
export {
  FieldControl,
  FieldDescription,
  FieldError as FieldInlineError,
  FieldLabel,
  FieldRoot,
  fieldVariants,
  useFieldContext,
} from "./field";
