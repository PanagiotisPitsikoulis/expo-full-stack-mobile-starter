import type { ComponentProps } from "react";

import {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  AlertDialogRoot,
  AlertDialogTrigger,
} from "./alert-dialog";

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Backdrop: AlertDialogBackdrop,
  Body: AlertDialogBody,
  CloseTrigger: AlertDialogCloseTrigger,
  Container: AlertDialogContainer,
  Dialog: AlertDialogDialog,
  Footer: AlertDialogFooter,
  Header: AlertDialogHeader,
  Heading: AlertDialogHeading,
  Icon: AlertDialogIcon,
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
});

export type AlertDialog = {
  BackdropProps: ComponentProps<typeof AlertDialogBackdrop>;
  BodyProps: ComponentProps<typeof AlertDialogBody>;
  CloseTriggerProps: ComponentProps<typeof AlertDialogCloseTrigger>;
  ContainerProps: ComponentProps<typeof AlertDialogContainer>;
  DialogProps: ComponentProps<typeof AlertDialogDialog>;
  FooterProps: ComponentProps<typeof AlertDialogFooter>;
  HeaderProps: ComponentProps<typeof AlertDialogHeader>;
  HeadingProps: ComponentProps<typeof AlertDialogHeading>;
  IconProps: ComponentProps<typeof AlertDialogIcon>;
  Props: ComponentProps<typeof AlertDialogRoot>;
  RootProps: ComponentProps<typeof AlertDialogRoot>;
  TriggerProps: ComponentProps<typeof AlertDialogTrigger>;
};

export type {
  AlertDialogBackdropProps,
  AlertDialogBodyProps,
  AlertDialogCloseTriggerProps,
  AlertDialogContainerProps,
  AlertDialogDialogProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogHeadingProps,
  AlertDialogIconProps,
  AlertDialogRootProps,
  AlertDialogRootProps as AlertDialogProps,
  AlertDialogTriggerProps,
  AlertDialogVariants,
} from "./alert-dialog";
export {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  AlertDialogRoot,
  AlertDialogTrigger,
  alertDialogVariants,
} from "./alert-dialog";
