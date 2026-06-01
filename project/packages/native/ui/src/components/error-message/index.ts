import type { ComponentProps } from "react";

import { ErrorMessageRoot } from "./error-message";

export const ErrorMessage = Object.assign(ErrorMessageRoot, {
  Root: ErrorMessageRoot,
});

export type ErrorMessage = {
  Props: ComponentProps<typeof ErrorMessageRoot>;
  RootProps: ComponentProps<typeof ErrorMessageRoot>;
};

export type {
  ErrorMessageRootProps,
  ErrorMessageRootProps as ErrorMessageProps,
  ErrorMessageVariants,
} from "./error-message";
export { ErrorMessageRoot, errorMessageVariants } from "./error-message";
