import type { ComponentProps } from "react";

import { ToolbarRoot } from "./toolbar";

export const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
});

export type Toolbar = {
  Props: ComponentProps<typeof ToolbarRoot>;
  RootProps: ComponentProps<typeof ToolbarRoot>;
};

export type {
  ToolbarRootProps,
  ToolbarRootProps as ToolbarProps,
  ToolbarVariants,
} from "./toolbar";
export { ToolbarRoot, toolbarVariants } from "./toolbar";
