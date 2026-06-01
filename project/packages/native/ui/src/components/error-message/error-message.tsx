import { forwardRef, type ReactNode } from "react";
import type { Text as NativeText, TextProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const errorMessageVariants = tv({
  base: "text-xs text-danger",
});

export type ErrorMessageVariants = VariantProps<typeof errorMessageVariants>;

export interface ErrorMessageRootProps extends TextProps, ErrorMessageVariants {
  children?: ReactNode;
  className?: string;
}

const ErrorMessageRoot = forwardRef<NativeText, ErrorMessageRootProps>(
  ({ children, className, ...props }, ref) => {
    if (!children) return null;

    return (
      <Text
        accessibilityLiveRegion="polite"
        className={errorMessageVariants({ className })}
        ref={ref}
        role="alert"
        {...props}
      >
        {children}
      </Text>
    );
  },
);

ErrorMessageRoot.displayName = "PitsiUINative.ErrorMessage";

export { ErrorMessageRoot };
