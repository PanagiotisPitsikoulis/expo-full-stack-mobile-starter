import type { ComponentProps } from "react";

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDialog,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerHeading,
  DrawerRoot,
  DrawerTrigger,
} from "./drawer";

export const Drawer = Object.assign(DrawerRoot, {
  Backdrop: DrawerBackdrop,
  Body: DrawerBody,
  CloseTrigger: DrawerCloseTrigger,
  Content: DrawerContent,
  Dialog: DrawerDialog,
  Footer: DrawerFooter,
  Handle: DrawerHandle,
  Header: DrawerHeader,
  Heading: DrawerHeading,
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
});

export type Drawer = {
  BackdropProps: ComponentProps<typeof DrawerBackdrop>;
  BodyProps: ComponentProps<typeof DrawerBody>;
  CloseTriggerProps: ComponentProps<typeof DrawerCloseTrigger>;
  ContentProps: ComponentProps<typeof DrawerContent>;
  DialogProps: ComponentProps<typeof DrawerDialog>;
  FooterProps: ComponentProps<typeof DrawerFooter>;
  HandleProps: ComponentProps<typeof DrawerHandle>;
  HeaderProps: ComponentProps<typeof DrawerHeader>;
  HeadingProps: ComponentProps<typeof DrawerHeading>;
  Props: ComponentProps<typeof DrawerRoot>;
  RootProps: ComponentProps<typeof DrawerRoot>;
  TriggerProps: ComponentProps<typeof DrawerTrigger>;
};

export type {
  DrawerBackdropProps,
  DrawerBodyProps,
  DrawerCloseTriggerProps,
  DrawerContentProps,
  DrawerDialogProps,
  DrawerFooterProps,
  DrawerHandleProps,
  DrawerHeaderProps,
  DrawerHeadingProps,
  DrawerRootProps,
  DrawerRootProps as DrawerProps,
  DrawerTriggerProps,
  DrawerVariants,
} from "./drawer";
export {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDialog,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerHeading,
  DrawerRoot,
  DrawerTrigger,
  drawerVariants,
} from "./drawer";
