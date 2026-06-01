import type { ComponentProps } from "react";

import {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./navigation-menu";

export const NavigationMenu = Object.assign(NavigationMenuRoot, {
  Content: NavigationMenuContent,
  Indicator: NavigationMenuIndicator,
  Item: NavigationMenuItem,
  Link: NavigationMenuLink,
  List: NavigationMenuList,
  Root: NavigationMenuRoot,
  Trigger: NavigationMenuTrigger,
  Viewport: NavigationMenuViewport,
});

export type NavigationMenu = {
  ContentProps: ComponentProps<typeof NavigationMenuContent>;
  IndicatorProps: ComponentProps<typeof NavigationMenuIndicator>;
  ItemProps: ComponentProps<typeof NavigationMenuItem>;
  LinkProps: ComponentProps<typeof NavigationMenuLink>;
  ListProps: ComponentProps<typeof NavigationMenuList>;
  Props: ComponentProps<typeof NavigationMenuRoot>;
  RootProps: ComponentProps<typeof NavigationMenuRoot>;
  TriggerProps: ComponentProps<typeof NavigationMenuTrigger>;
  ViewportProps: ComponentProps<typeof NavigationMenuViewport>;
};

export type {
  NavigationMenuContentProps,
  NavigationMenuIndicatorProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuRootProps,
  NavigationMenuRootProps as NavigationMenuProps,
  NavigationMenuTriggerProps,
  NavigationMenuVariants,
  NavigationMenuViewportProps,
} from "./navigation-menu";

export {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuVariants,
} from "./navigation-menu";
