import type { ComponentProps } from "react";

import { TextAreaRoot } from "./textarea";

export const TextArea = Object.assign(TextAreaRoot, {
  Root: TextAreaRoot,
});

export type TextArea = {
  Props: ComponentProps<typeof TextAreaRoot>;
  RootProps: ComponentProps<typeof TextAreaRoot>;
};

export type {
  TextAreaRootProps,
  TextAreaRootProps as TextAreaProps,
  TextAreaVariants,
} from "./textarea";
export { TextAreaRoot, textAreaVariants } from "./textarea";
