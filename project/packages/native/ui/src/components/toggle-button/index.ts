import type { ComponentProps } from "react";

import { ToggleButtonRoot } from "./toggle-button";

export const ToggleButton = Object.assign(ToggleButtonRoot, {
  Root: ToggleButtonRoot,
});

export type ToggleButton = {
  Props: ComponentProps<typeof ToggleButtonRoot>;
  RootProps: ComponentProps<typeof ToggleButtonRoot>;
};

export type {
  ToggleButtonRootProps,
  ToggleButtonRootProps as ToggleButtonProps,
  ToggleButtonVariants,
} from "./toggle-button";
export { ToggleButtonRoot, toggleButtonVariants } from "./toggle-button";
