import type { ComponentProps } from "react";

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubmenuIndicator,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  ItemIndicator: ContextMenuItemIndicator,
  Root: ContextMenuRoot,
  Separator: ContextMenuSeparator,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
  SubmenuIndicator: ContextMenuSubmenuIndicator,
  Trigger: ContextMenuTrigger,
});

export type ContextMenu = {
  ContentProps: ComponentProps<typeof ContextMenuContent>;
  ItemIndicatorProps: ComponentProps<typeof ContextMenuItemIndicator>;
  ItemProps: ComponentProps<typeof ContextMenuItem>;
  Props: ComponentProps<typeof ContextMenuRoot>;
  RootProps: ComponentProps<typeof ContextMenuRoot>;
  SeparatorProps: ComponentProps<typeof ContextMenuSeparator>;
  SubContentProps: ComponentProps<typeof ContextMenuSubContent>;
  SubProps: ComponentProps<typeof ContextMenuSub>;
  SubTriggerProps: ComponentProps<typeof ContextMenuSubTrigger>;
  SubmenuIndicatorProps: ComponentProps<typeof ContextMenuSubmenuIndicator>;
  TriggerProps: ComponentProps<typeof ContextMenuTrigger>;
};

export type {
  ContextMenuContentProps,
  ContextMenuItemIndicatorProps,
  ContextMenuItemProps,
  ContextMenuRootProps,
  ContextMenuRootProps as ContextMenuProps,
  ContextMenuSeparatorProps,
  ContextMenuSubContentProps,
  ContextMenuSubmenuIndicatorProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
  ContextMenuVariants,
} from "./context-menu";

export {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubmenuIndicator,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  contextMenuVariants,
} from "./context-menu";
