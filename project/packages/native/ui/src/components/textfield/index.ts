import type { ComponentProps } from "react";

import { TextFieldRoot } from "./textfield";

export const TextField = Object.assign(TextFieldRoot, {
  Root: TextFieldRoot,
});

export type TextField = {
  Props: ComponentProps<typeof TextFieldRoot>;
  RootProps: ComponentProps<typeof TextFieldRoot>;
};

export type {
  TextFieldRootProps,
  TextFieldRootProps as TextFieldProps,
  TextFieldVariants,
} from "./textfield";
export { TextFieldContext, TextFieldRoot, textFieldVariants } from "./textfield";
