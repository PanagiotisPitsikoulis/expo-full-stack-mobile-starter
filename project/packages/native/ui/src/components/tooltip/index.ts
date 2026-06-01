import type { ComponentProps } from "react";

import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from "./tooltip";

export const Tooltip = Object.assign(TooltipRoot, {
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
});

export type Tooltip = {
  ArrowProps: ComponentProps<typeof TooltipArrow>;
  ContentProps: ComponentProps<typeof TooltipContent>;
  Props: ComponentProps<typeof TooltipRoot>;
  RootProps: ComponentProps<typeof TooltipRoot>;
  TriggerProps: ComponentProps<typeof TooltipTrigger>;
};

export type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipRootProps,
  TooltipRootProps as TooltipProps,
  TooltipTriggerProps,
  TooltipVariants,
} from "./tooltip";
export {
  TooltipArrow,
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
  tooltipVariants,
} from "./tooltip";
