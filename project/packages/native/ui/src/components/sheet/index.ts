import type { ComponentProps } from "react";

import {
  SheetBackdrop,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetDialog,
  SheetFooter,
  SheetHeader,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export const Sheet = Object.assign(SheetRoot, {
  Backdrop: SheetBackdrop,
  Body: SheetBody,
  Close: SheetClose,
  Content: SheetContent,
  Description: SheetDescription,
  Dialog: SheetDialog,
  Footer: SheetFooter,
  Header: SheetHeader,
  Root: SheetRoot,
  Title: SheetTitle,
  Trigger: SheetTrigger,
});

export type Sheet = {
  BackdropProps: ComponentProps<typeof SheetBackdrop>;
  BodyProps: ComponentProps<typeof SheetBody>;
  CloseProps: ComponentProps<typeof SheetClose>;
  ContentProps: ComponentProps<typeof SheetContent>;
  DescriptionProps: ComponentProps<typeof SheetDescription>;
  DialogProps: ComponentProps<typeof SheetDialog>;
  FooterProps: ComponentProps<typeof SheetFooter>;
  HeaderProps: ComponentProps<typeof SheetHeader>;
  Props: ComponentProps<typeof SheetRoot>;
  RootProps: ComponentProps<typeof SheetRoot>;
  TitleProps: ComponentProps<typeof SheetTitle>;
  TriggerProps: ComponentProps<typeof SheetTrigger>;
};

export type {
  SheetBackdropProps,
  SheetBodyProps,
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetDialogProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetRootProps,
  SheetRootProps as SheetProps,
  SheetTitleProps,
  SheetTriggerProps,
  SheetVariants,
} from "./sheet";
export {
  SheetBackdrop,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetDialog,
  SheetFooter,
  SheetHeader,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
  sheetVariants,
} from "./sheet";
