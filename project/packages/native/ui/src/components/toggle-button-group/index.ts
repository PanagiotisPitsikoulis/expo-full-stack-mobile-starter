import type { ComponentProps } from "react";

import { ToggleButtonGroupRoot, ToggleButtonGroupSeparator } from "./toggle-button-group";

export const ToggleButtonGroup = Object.assign(ToggleButtonGroupRoot, {
  Root: ToggleButtonGroupRoot,
  Separator: ToggleButtonGroupSeparator,
});

export type ToggleButtonGroup = {
  Props: ComponentProps<typeof ToggleButtonGroupRoot>;
  RootProps: ComponentProps<typeof ToggleButtonGroupRoot>;
  SeparatorProps: ComponentProps<typeof ToggleButtonGroupSeparator>;
};

export type {
  ToggleButtonGroupContextValue,
  ToggleButtonGroupRootProps,
  ToggleButtonGroupRootProps as ToggleButtonGroupProps,
  ToggleButtonGroupSeparatorProps,
  ToggleButtonGroupVariants,
  ToggleButtonKey,
} from "./toggle-button-group";
export {
  TOGGLE_BUTTON_GROUP_CHILD,
  ToggleButtonGroupContext,
  ToggleButtonGroupRoot,
  ToggleButtonGroupSeparator,
  toggleButtonGroupVariants,
} from "./toggle-button-group";
