import type { ComponentProps } from "react";

import { ToggleRoot } from "./toggle";

export const Toggle = Object.assign(ToggleRoot, {
  Root: ToggleRoot,
});

export type Toggle = {
  Props: ComponentProps<typeof ToggleRoot>;
  RootProps: ComponentProps<typeof ToggleRoot>;
};

export type { ToggleRootProps, ToggleRootProps as ToggleProps, ToggleVariants } from "./toggle";
export { ToggleRoot, toggleVariants } from "./toggle";
