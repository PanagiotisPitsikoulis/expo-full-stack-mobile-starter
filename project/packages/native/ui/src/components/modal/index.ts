import type { ComponentProps } from "react";

import {
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ModalIcon,
  ModalRoot,
  ModalTrigger,
} from "./modal";

export const Modal = Object.assign(ModalRoot, {
  Backdrop: ModalBackdrop,
  Body: ModalBody,
  CloseTrigger: ModalCloseTrigger,
  Container: ModalContainer,
  Dialog: ModalDialog,
  Footer: ModalFooter,
  Header: ModalHeader,
  Heading: ModalHeading,
  Icon: ModalIcon,
  Root: ModalRoot,
  Trigger: ModalTrigger,
});

export type Modal = {
  BackdropProps: ComponentProps<typeof ModalBackdrop>;
  BodyProps: ComponentProps<typeof ModalBody>;
  CloseTriggerProps: ComponentProps<typeof ModalCloseTrigger>;
  ContainerProps: ComponentProps<typeof ModalContainer>;
  DialogProps: ComponentProps<typeof ModalDialog>;
  FooterProps: ComponentProps<typeof ModalFooter>;
  HeaderProps: ComponentProps<typeof ModalHeader>;
  HeadingProps: ComponentProps<typeof ModalHeading>;
  IconProps: ComponentProps<typeof ModalIcon>;
  Props: ComponentProps<typeof ModalRoot>;
  RootProps: ComponentProps<typeof ModalRoot>;
  TriggerProps: ComponentProps<typeof ModalTrigger>;
};

export type {
  ModalBackdropProps,
  ModalBodyProps,
  ModalCloseTriggerProps,
  ModalContainerProps,
  ModalDialogProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalHeadingProps,
  ModalIconProps,
  ModalRootProps,
  ModalRootProps as ModalProps,
  ModalTriggerProps,
  ModalVariants,
} from "./modal";
export {
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ModalIcon,
  ModalRoot,
  ModalTrigger,
  modalVariants,
} from "./modal";
