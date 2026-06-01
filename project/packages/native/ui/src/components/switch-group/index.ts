import type { ComponentProps } from "react";

import { SwitchGroupRoot } from "./switch-group";

export const SwitchGroup = Object.assign(SwitchGroupRoot, {
  Root: SwitchGroupRoot,
});

export type SwitchGroup = {
  Props: ComponentProps<typeof SwitchGroupRoot>;
  RootProps: ComponentProps<typeof SwitchGroupRoot>;
};

export type {
  SwitchGroupRootProps,
  SwitchGroupRootProps as SwitchGroupProps,
  SwitchGroupVariants,
} from "./switch-group";
export { SwitchGroupRoot, switchGroupVariants } from "./switch-group";
