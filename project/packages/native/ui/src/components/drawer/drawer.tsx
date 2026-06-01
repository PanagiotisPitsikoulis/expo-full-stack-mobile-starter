import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  SheetBackdrop,
  type SheetBackdropProps,
  SheetBody,
  type SheetBodyProps,
  SheetClose,
  type SheetCloseProps,
  SheetContent,
  type SheetContentProps,
  SheetDialog,
  type SheetDialogProps,
  SheetFooter,
  type SheetFooterProps,
  SheetHeader,
  type SheetHeaderProps,
  SheetRoot,
  type SheetRootProps,
  SheetTitle,
  type SheetTitleProps,
  SheetTrigger,
  type SheetTriggerProps,
  sheetVariants,
} from "../sheet";

type DrawerPlacement = "bottom" | "left" | "right" | "top";

export const drawerVariants = tv({
  slots: {
    handle: "items-center justify-center pb-2",
    handleBar: "h-1 w-9 rounded-full bg-separator",
  },
  variants: {
    placement: {
      bottom: {},
      left: {},
      right: {},
      top: {},
    },
    variant: {
      blur: {},
      opaque: {},
      transparent: {},
    },
  },
  defaultVariants: {
    placement: "bottom",
    variant: "opaque",
  },
});

export type DrawerVariants = VariantProps<typeof drawerVariants>;

export type DrawerRootProps = SheetRootProps;
export type DrawerTriggerProps = SheetTriggerProps;
export type DrawerBackdropProps = SheetBackdropProps;
export type DrawerContentProps = Omit<SheetContentProps, "side"> & {
  placement?: DrawerPlacement;
};
export type DrawerDialogProps = Omit<SheetDialogProps, "side"> & {
  placement?: DrawerPlacement;
};
export type DrawerHeaderProps = SheetHeaderProps;
export type DrawerHeadingProps = SheetTitleProps;
export type DrawerBodyProps = SheetBodyProps;
export type DrawerFooterProps = SheetFooterProps;
export type DrawerCloseTriggerProps = SheetCloseProps;

export interface DrawerHandleProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DrawerRoot = SheetRoot;
const DrawerTrigger = SheetTrigger;
const DrawerBackdrop = SheetBackdrop;
const DrawerHeader = SheetHeader;
const DrawerHeading = SheetTitle;
const DrawerBody = SheetBody;
const DrawerFooter = SheetFooter;
const DrawerCloseTrigger = SheetClose;

const DrawerContent = forwardRef<View, DrawerContentProps>(
  ({ placement = "bottom", ...props }, ref) => (
    <SheetContent ref={ref} side={placement} {...props} />
  ),
);

DrawerContent.displayName = "PitsiUINative.DrawerContent";

const DrawerDialog = forwardRef<any, DrawerDialogProps>(
  ({ className, placement = "bottom", ...props }, ref) => {
    const slots = sheetVariants({ side: placement });

    return (
      <SheetDialog ref={ref} className={slots.dialog({ className })} side={placement} {...props} />
    );
  },
);

DrawerDialog.displayName = "PitsiUINative.DrawerDialog";

const DrawerHandle = forwardRef<View, DrawerHandleProps>(
  ({ children, className, ...props }, ref) => {
    const slots = drawerVariants();

    return (
      <View ref={ref} className={slots.handle({ className })} {...props}>
        {children ?? <View className={slots.handleBar()} />}
      </View>
    );
  },
);

DrawerHandle.displayName = "PitsiUINative.DrawerHandle";

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
};
