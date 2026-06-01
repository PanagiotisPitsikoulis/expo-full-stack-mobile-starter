import type { ComponentProps } from "react";

import { BadgeAnchor, BadgeLabel, BadgeRoot } from "./badge";

export const Badge = Object.assign(BadgeRoot, {
  Anchor: BadgeAnchor,
  Label: BadgeLabel,
  Root: BadgeRoot,
});

export type Badge = {
  AnchorProps: ComponentProps<typeof BadgeAnchor>;
  LabelProps: ComponentProps<typeof BadgeLabel>;
  Props: ComponentProps<typeof BadgeRoot>;
  RootProps: ComponentProps<typeof BadgeRoot>;
};

export type {
  BadgeAnchorProps,
  BadgeLabelProps,
  BadgeRootProps,
  BadgeRootProps as BadgeProps,
  BadgeVariants,
} from "./badge";
export { BadgeAnchor, BadgeLabel, BadgeRoot, badgeVariants } from "./badge";
