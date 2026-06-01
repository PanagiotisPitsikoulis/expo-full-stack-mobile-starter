import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { DangerIcon, InfoIcon, SuccessIcon, WarningIcon } from "../icons";
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

type AlertDialogStatus = "accent" | "danger" | "default" | "success" | "warning";

export const alertDialogVariants = tv({
  slots: {
    icon: "size-10 items-center justify-center rounded-full bg-danger-soft",
  },
  variants: {
    status: {
      accent: {
        icon: "bg-accent-soft",
      },
      danger: {
        icon: "bg-danger-soft",
      },
      default: {
        icon: "bg-default",
      },
      success: {
        icon: "bg-success-soft",
      },
      warning: {
        icon: "bg-warning-soft",
      },
    },
  },
  defaultVariants: {
    status: "danger",
  },
});

export type AlertDialogVariants = VariantProps<typeof alertDialogVariants>;

export type AlertDialogRootProps = ModalRootProps;
export type AlertDialogTriggerProps = ModalTriggerProps;
export type AlertDialogContainerProps = ModalContainerProps;
export type AlertDialogDialogProps = ModalDialogProps;
export type AlertDialogHeaderProps = ModalHeaderProps;
export type AlertDialogHeadingProps = ModalHeadingProps;
export type AlertDialogBodyProps = ModalBodyProps;
export type AlertDialogFooterProps = ModalFooterProps;
export type AlertDialogCloseTriggerProps = ModalCloseTriggerProps;

export interface AlertDialogBackdropProps extends ModalBackdropProps {
  isKeyboardDismissDisabled?: boolean;
}

export interface AlertDialogIconProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  status?: AlertDialogStatus;
}

const AlertDialogRoot = ModalRoot;
const AlertDialogTrigger = ModalTrigger;
const AlertDialogContainer = ModalContainer;
const AlertDialogDialog = ModalDialog;
const AlertDialogHeader = ModalHeader;
const AlertDialogHeading = ModalHeading;
const AlertDialogBody = ModalBody;
const AlertDialogFooter = ModalFooter;
const AlertDialogCloseTrigger = ModalCloseTrigger;

function AlertDialogBackdrop({
  isDismissable = false,
  isKeyboardDismissDisabled: _isKeyboardDismissDisabled,
  ...props
}: AlertDialogBackdropProps) {
  return <ModalBackdrop isDismissable={isDismissable} {...props} />;
}

AlertDialogBackdrop.displayName = "PitsiUINative.AlertDialogBackdrop";

function getDefaultIcon(status: AlertDialogStatus) {
  switch (status) {
    case "success":
      return <SuccessIcon />;
    case "warning":
      return <WarningIcon />;
    case "accent":
    case "default":
      return <InfoIcon />;
    default:
      return <DangerIcon />;
  }
}

const AlertDialogIcon = forwardRef<View, AlertDialogIconProps>(
  ({ children, className, status = "danger", ...props }, ref) => {
    const slots = alertDialogVariants({ status });

    return (
      <View ref={ref} className={slots.icon({ className })} {...props}>
        {children ?? getDefaultIcon(status)}
      </View>
    );
  },
);

AlertDialogIcon.displayName = "PitsiUINative.AlertDialogIcon";

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
};
