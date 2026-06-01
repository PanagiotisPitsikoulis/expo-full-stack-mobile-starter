import { createContext, forwardRef, type ReactNode, useContext } from "react";
import type { View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  ModalBackdrop,
  type ModalBackdropProps,
  ModalBody,
  type ModalBodyProps,
  ModalCloseTrigger,
  type ModalCloseTriggerProps,
  ModalContainer,
  type ModalContainerProps,
  ModalDialog,
  type ModalDialogProps,
  ModalFooter,
  type ModalFooterProps,
  ModalHeader,
  type ModalHeaderProps,
  ModalHeading,
  type ModalHeadingProps,
  ModalRoot,
  type ModalRootProps,
  ModalTrigger,
  type ModalTriggerProps,
} from "../modal";
import { Text, type TextProps } from "../text";

type SheetSide = "bottom" | "left" | "right" | "top";

export const sheetVariants = tv({
  slots: {
    content: "absolute inset-0 p-0",
    description: "text-sm leading-5 text-muted",
    dialog: "bg-background",
  },
  variants: {
    side: {
      bottom: {
        content: "justify-end",
        dialog: "w-full rounded-b-none rounded-t-3xl",
      },
      left: {
        content: "items-stretch justify-start",
        dialog: "h-full w-80 rounded-l-none rounded-r-3xl",
      },
      right: {
        content: "items-stretch justify-end",
        dialog: "h-full w-80 rounded-l-3xl rounded-r-none",
      },
      top: {
        content: "justify-start",
        dialog: "w-full rounded-b-3xl rounded-t-none",
      },
    },
    variant: {
      blur: {},
      opaque: {},
      transparent: {},
    },
  },
  defaultVariants: {
    side: "right",
    variant: "opaque",
  },
});

export type SheetVariants = VariantProps<typeof sheetVariants>;

const SheetSideContext = createContext<SheetSide>("right");

export type SheetRootProps = ModalRootProps;
export type SheetTriggerProps = ModalTriggerProps;
export type SheetBackdropProps = ModalBackdropProps;
export type SheetHeaderProps = ModalHeaderProps;
export type SheetTitleProps = ModalHeadingProps;
export type SheetBodyProps = ModalBodyProps;
export type SheetFooterProps = ModalFooterProps;
export type SheetCloseProps = ModalCloseTriggerProps;

export interface SheetContentProps extends Omit<ModalContainerProps, "placement"> {
  side?: SheetSide;
}

export interface SheetDialogProps extends ModalDialogProps {
  side?: SheetSide;
}

export interface SheetDescriptionProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const SheetRoot = ModalRoot;
const SheetTrigger = ModalTrigger;
const SheetBackdrop = ModalBackdrop;
const SheetHeader = ModalHeader;
const SheetTitle = ModalHeading;
const SheetBody = ModalBody;
const SheetFooter = ModalFooter;
const SheetClose = ModalCloseTrigger;

const SheetContent = forwardRef<View, SheetContentProps>(
  ({ children, className, side = "right", ...props }, ref) => {
    const slots = sheetVariants({ side });
    const placement = side === "top" ? "top" : side === "bottom" ? "bottom" : "center";

    return (
      <SheetSideContext.Provider value={side}>
        <ModalContainer
          ref={ref}
          className={slots.content({ className })}
          placement={placement}
          {...props}
        >
          {children}
        </ModalContainer>
      </SheetSideContext.Provider>
    );
  },
);

SheetContent.displayName = "PitsiUINative.SheetContent";

const SheetDialog = forwardRef<any, SheetDialogProps>(
  ({ className, side: sideProp, ...props }, ref) => {
    const contextSide = useContext(SheetSideContext);
    const side = sideProp ?? contextSide;
    const slots = sheetVariants({ side });

    return <ModalDialog ref={ref} className={slots.dialog({ className })} {...props} />;
  },
);

SheetDialog.displayName = "PitsiUINative.SheetDialog";

const SheetDescription = forwardRef<any, SheetDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    const slots = sheetVariants();

    return (
      <Text ref={ref} className={slots.description({ className })} {...props}>
        {children}
      </Text>
    );
  },
);

SheetDescription.displayName = "PitsiUINative.SheetDescription";

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
};
