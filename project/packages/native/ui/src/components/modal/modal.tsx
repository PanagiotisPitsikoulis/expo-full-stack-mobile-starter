import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import {
  Dialog,
  type DialogCloseProps,
  type DialogContentProps,
  type DialogOverlayProps,
  type DialogPortalProps,
  type DialogRootProps,
  type DialogTitleProps,
  type DialogTriggerProps,
} from "../dialog";
import { Text } from "../text";

type ModalPlacement = "auto" | "top" | "center" | "bottom";

export const modalVariants = tv({
  slots: {
    backdrop: "absolute inset-0 bg-backdrop",
    body: "min-h-0 flex-1 text-sm leading-relaxed text-muted",
    closeTrigger: "absolute right-4 top-4",
    container: "absolute inset-0 items-center justify-center p-4",
    dialog: "relative w-full rounded-3xl bg-overlay p-6 shadow-overlay",
    footer: "mt-6 flex-row items-center justify-end gap-2",
    header: "mb-3 gap-3",
    heading: "text-base font-medium text-foreground",
    icon: "size-10 items-center justify-center rounded-full bg-default",
    trigger: "",
  },
  variants: {
    placement: {
      auto: {},
      bottom: {
        container: "justify-end",
      },
      center: {
        container: "justify-center",
      },
      top: {
        container: "justify-start",
      },
    },
    scroll: {
      inside: {},
      outside: {},
    },
    size: {
      cover: {
        dialog: "h-full w-full",
      },
      full: {
        container: "p-0",
        dialog: "h-full w-full rounded-none shadow-none",
      },
      lg: {
        dialog: "max-w-lg",
      },
      md: {
        dialog: "max-w-md",
      },
      sm: {
        dialog: "max-w-sm",
      },
      xs: {
        dialog: "max-w-xs",
      },
    },
    variant: {
      blur: {
        backdrop: "bg-backdrop",
      },
      opaque: {
        backdrop: "bg-backdrop",
      },
      transparent: {
        backdrop: "bg-transparent",
      },
    },
  },
  defaultVariants: {
    placement: "auto",
    scroll: "inside",
    size: "md",
    variant: "opaque",
  },
});

export type ModalVariants = VariantProps<typeof modalVariants>;

type OverlayState = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export interface ModalRootProps extends Omit<DialogRootProps, "isOpen" | "onOpenChange"> {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  state?: OverlayState;
}

const ModalRoot = forwardRef<any, ModalRootProps>(
  ({ defaultOpen, isDefaultOpen, isOpen, onOpenChange, state, ...props }, ref) => (
    <Dialog
      ref={ref}
      isDefaultOpen={isDefaultOpen ?? defaultOpen}
      isOpen={state?.isOpen ?? isOpen}
      onOpenChange={state?.setOpen ?? onOpenChange}
      {...props}
    />
  ),
);

ModalRoot.displayName = "PitsiUINative.ModalRoot";

export interface ModalTriggerProps extends DialogTriggerProps {
  className?: string;
}

const ModalTrigger = forwardRef<any, ModalTriggerProps>(({ className, ...props }, ref) => {
  const slots = modalVariants();

  return <Dialog.Trigger ref={ref} className={slots.trigger({ className })} {...props} />;
});

ModalTrigger.displayName = "PitsiUINative.ModalTrigger";

export interface ModalBackdropProps extends Omit<DialogPortalProps, "children"> {
  children?: ReactNode;
  className?: string;
  isDismissable?: boolean;
  overlayProps?: Omit<DialogOverlayProps, "children">;
  variant?: ModalVariants["variant"];
}

function ModalBackdrop({
  children,
  className,
  isDismissable = true,
  overlayProps,
  variant,
  ...props
}: ModalBackdropProps) {
  const slots = modalVariants({ variant });

  return (
    <Dialog.Portal {...props}>
      <Dialog.Overlay
        className={slots.backdrop({ className })}
        isCloseOnPress={isDismissable}
        {...overlayProps}
      />
      {children}
    </Dialog.Portal>
  );
}

ModalBackdrop.displayName = "PitsiUINative.ModalBackdrop";

export interface ModalContainerProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  placement?: ModalPlacement;
  scroll?: ModalVariants["scroll"];
  size?: ModalVariants["size"];
}

const ModalContainer = forwardRef<View, ModalContainerProps>(
  ({ children, className, placement = "auto", scroll, size, ...props }, ref) => {
    const slots = modalVariants({ placement, scroll, size });

    return (
      <View
        ref={ref}
        className={slots.container({ className })}
        pointerEvents="box-none"
        {...props}
      >
        {children}
      </View>
    );
  },
);

ModalContainer.displayName = "PitsiUINative.ModalContainer";

export interface ModalDialogProps extends DialogContentProps {
  className?: string;
  placement?: ModalPlacement;
  size?: ModalVariants["size"];
}

const ModalDialog = forwardRef<any, ModalDialogProps>(
  ({ className, placement = "auto", size, ...props }, ref) => {
    const slots = modalVariants({ placement, size });

    return <Dialog.Content ref={ref} className={slots.dialog({ className })} {...props} />;
  },
);

ModalDialog.displayName = "PitsiUINative.ModalDialog";

export interface ModalHeaderProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ModalHeader = forwardRef<View, ModalHeaderProps>(({ className, ...props }, ref) => {
  const slots = modalVariants();

  return <View ref={ref} className={slots.header({ className })} {...props} />;
});

ModalHeader.displayName = "PitsiUINative.ModalHeader";

export interface ModalBodyProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ModalBody = forwardRef<View, ModalBodyProps>(({ children, className, ...props }, ref) => {
  const slots = modalVariants();

  return (
    <View ref={ref} className={slots.body({ className })} {...props}>
      {typeof children === "string" || typeof children === "number" ? (
        <Text className="text-sm leading-relaxed text-muted">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
});

ModalBody.displayName = "PitsiUINative.ModalBody";

export interface ModalFooterProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ModalFooter = forwardRef<View, ModalFooterProps>(({ className, ...props }, ref) => {
  const slots = modalVariants();

  return <View ref={ref} className={slots.footer({ className })} {...props} />;
});

ModalFooter.displayName = "PitsiUINative.ModalFooter";

export interface ModalHeadingProps extends DialogTitleProps {
  className?: string;
}

const ModalHeading = forwardRef<any, ModalHeadingProps>(({ className, ...props }, ref) => {
  const slots = modalVariants();

  return <Dialog.Title ref={ref} className={slots.heading({ className })} {...props} />;
});

ModalHeading.displayName = "PitsiUINative.ModalHeading";

export interface ModalIconProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ModalIcon = forwardRef<View, ModalIconProps>(({ className, ...props }, ref) => {
  const slots = modalVariants();

  return <View ref={ref} className={slots.icon({ className })} {...props} />;
});

ModalIcon.displayName = "PitsiUINative.ModalIcon";

export type ModalCloseTriggerProps = DialogCloseProps & {
  className?: string;
  children?: ReactNode;
};

const ModalCloseTrigger = forwardRef<any, ModalCloseTriggerProps>(
  ({ className, ...props }, ref) => {
    const slots = modalVariants();

    return <Dialog.Close ref={ref} className={slots.closeTrigger({ className })} {...props} />;
  },
);

ModalCloseTrigger.displayName = "PitsiUINative.ModalCloseTrigger";

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
};
