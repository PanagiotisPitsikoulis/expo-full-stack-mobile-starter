import type { ComponentProps } from "react";

import { MenuSectionRoot } from "./menu-section";

export const MenuSection = MenuSectionRoot;

export type MenuSection = {
  Props: ComponentProps<typeof MenuSectionRoot>;
};

export type {
  MenuSectionRootProps,
  MenuSectionRootProps as MenuSectionProps,
  MenuSectionVariants,
} from "./menu-section";

export { MenuSectionRoot, menuSectionVariants } from "./menu-section";
