import type { ComponentProps } from "react";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarRoot,
  SidebarSeparator,
  SidebarTrigger,
  sidebarMenuButtonVariants,
  useSidebar,
} from "../native-parity";

export const Sidebar = Object.assign(SidebarRoot, {
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  GroupLabel: SidebarGroupLabel,
  Header: SidebarHeader,
  Input: SidebarInput,
  Inset: SidebarInset,
  Menu: SidebarMenu,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuButton: SidebarMenuButton,
  MenuItem: SidebarMenuItem,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSub,
  MenuSubButton: SidebarMenuSubButton,
  MenuSubItem: SidebarMenuSubItem,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Root: SidebarRoot,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
});

export type Sidebar = {
  ContentProps: ComponentProps<typeof SidebarContent>;
  FooterProps: ComponentProps<typeof SidebarFooter>;
  GroupActionProps: ComponentProps<typeof SidebarGroupAction>;
  GroupContentProps: ComponentProps<typeof SidebarGroupContent>;
  GroupLabelProps: ComponentProps<typeof SidebarGroupLabel>;
  GroupProps: ComponentProps<typeof SidebarGroup>;
  HeaderProps: ComponentProps<typeof SidebarHeader>;
  InputProps: ComponentProps<typeof SidebarInput>;
  InsetProps: ComponentProps<typeof SidebarInset>;
  MenuActionProps: ComponentProps<typeof SidebarMenuAction>;
  MenuBadgeProps: ComponentProps<typeof SidebarMenuBadge>;
  MenuButtonProps: ComponentProps<typeof SidebarMenuButton>;
  MenuItemProps: ComponentProps<typeof SidebarMenuItem>;
  MenuProps: ComponentProps<typeof SidebarMenu>;
  MenuSkeletonProps: ComponentProps<typeof SidebarMenuSkeleton>;
  MenuSubButtonProps: ComponentProps<typeof SidebarMenuSubButton>;
  MenuSubItemProps: ComponentProps<typeof SidebarMenuSubItem>;
  MenuSubProps: ComponentProps<typeof SidebarMenuSub>;
  Props: ComponentProps<typeof SidebarRoot>;
  ProviderProps: ComponentProps<typeof SidebarProvider>;
  RailProps: ComponentProps<typeof SidebarRail>;
  RootProps: ComponentProps<typeof SidebarRoot>;
  SeparatorProps: ComponentProps<typeof SidebarSeparator>;
  TriggerProps: ComponentProps<typeof SidebarTrigger>;
};

export type { SidebarContextProps, SidebarMenuButtonProps } from "../native-parity";

export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarRoot,
  SidebarSeparator,
  SidebarTrigger,
  sidebarMenuButtonVariants,
  useSidebar,
};
