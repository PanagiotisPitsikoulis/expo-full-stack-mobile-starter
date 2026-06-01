import type { ComponentProps } from "react";

import { LinkIcon, LinkRoot } from "./link";

export const Link = Object.assign(LinkRoot, {
  Icon: LinkIcon,
  Root: LinkRoot,
});

export type Link = {
  IconProps: ComponentProps<typeof LinkIcon>;
  Props: ComponentProps<typeof LinkRoot>;
  RootProps: ComponentProps<typeof LinkRoot>;
};

export type {
  LinkIconProps,
  LinkRootProps,
  LinkRootProps as LinkProps,
  LinkVariants,
} from "./link";
export { LinkIcon, LinkRoot, linkVariants } from "./link";
