import type { ComponentProps } from "react";

import { MenuItemIndicator, MenuItemRoot, MenuItemSubmenuIndicator } from "./menu-item";

export const MenuItem = Object.assign(MenuItemRoot, {
  Indicator: MenuItemIndicator,
  Root: MenuItemRoot,
  SubmenuIndicator: MenuItemSubmenuIndicator,
});

export type MenuItem = {
  IndicatorProps: ComponentProps<typeof MenuItemIndicator>;
  Props: ComponentProps<typeof MenuItemRoot>;
  RootProps: ComponentProps<typeof MenuItemRoot>;
  SubmenuIndicatorProps: ComponentProps<typeof MenuItemSubmenuIndicator>;
};

export type {
  MenuItemIndicatorProps,
  MenuItemRenderProps,
  MenuItemRootProps,
  MenuItemRootProps as MenuItemProps,
  MenuItemSubmenuIndicatorProps,
  MenuItemVariants,
} from "./menu-item";

export {
  MenuItemIndicator,
  MenuItemRoot,
  MenuItemSubmenuIndicator,
  menuItemVariants,
} from "./menu-item";
