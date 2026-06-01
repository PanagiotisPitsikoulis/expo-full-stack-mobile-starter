import type { ComponentProps } from "react";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
} from "./menubar";

export const Menubar = Object.assign(MenubarRoot, {
  Content: MenubarContent,
  Item: MenubarItem,
  Menu: MenubarMenu,
  Root: MenubarRoot,
  Separator: MenubarSeparator,
  Trigger: MenubarTrigger,
});

export type Menubar = {
  ContentProps: ComponentProps<typeof MenubarContent>;
  ItemProps: ComponentProps<typeof MenubarItem>;
  MenuProps: ComponentProps<typeof MenubarMenu>;
  Props: ComponentProps<typeof MenubarRoot>;
  RootProps: ComponentProps<typeof MenubarRoot>;
  SeparatorProps: ComponentProps<typeof MenubarSeparator>;
  TriggerProps: ComponentProps<typeof MenubarTrigger>;
};

export type {
  MenubarContentProps,
  MenubarItemProps,
  MenubarMenuProps,
  MenubarRootProps,
  MenubarRootProps as MenubarProps,
  MenubarSeparatorProps,
  MenubarTriggerProps,
  MenubarVariants,
} from "./menubar";

export {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
  menubarVariants,
} from "./menubar";
