import type { ComponentProps } from "react";

import { ButtonGroupRoot, ButtonGroupSeparator } from "./button-group";

export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Root: ButtonGroupRoot,
  Separator: ButtonGroupSeparator,
});

export type ButtonGroup = {
  Props: ComponentProps<typeof ButtonGroupRoot>;
  RootProps: ComponentProps<typeof ButtonGroupRoot>;
  SeparatorProps: ComponentProps<typeof ButtonGroupSeparator>;
};

export type {
  ButtonGroupRootProps,
  ButtonGroupRootProps as ButtonGroupProps,
  ButtonGroupSeparatorProps,
  ButtonGroupVariants,
} from "./button-group";
export { BUTTON_GROUP_CHILD, ButtonGroupContext, buttonGroupVariants } from "./button-group";
export { ButtonGroupRoot, ButtonGroupSeparator };
