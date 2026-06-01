import type { ComponentProps } from "react";

import { HoverCardContent, HoverCardRoot, HoverCardTrigger } from "./hover-card";

export const HoverCard = Object.assign(HoverCardRoot, {
  Content: HoverCardContent,
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
});

export type HoverCard = {
  ContentProps: ComponentProps<typeof HoverCardContent>;
  Props: ComponentProps<typeof HoverCardRoot>;
  RootProps: ComponentProps<typeof HoverCardRoot>;
  TriggerProps: ComponentProps<typeof HoverCardTrigger>;
};

export type {
  HoverCardContentProps,
  HoverCardRootProps,
  HoverCardRootProps as HoverCardProps,
  HoverCardTriggerProps,
  HoverCardVariants,
} from "./hover-card";

export { HoverCardContent, HoverCardRoot, HoverCardTrigger, hoverCardVariants } from "./hover-card";
