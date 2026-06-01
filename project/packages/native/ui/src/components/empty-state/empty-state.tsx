import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text, type TextProps } from "../text";

export const emptyStateVariants = tv({
  slots: {
    root: "min-w-0 flex-1 items-center justify-center gap-6 rounded-2xl border border-dashed border-border p-6",
    header: "max-w-sm items-center gap-2 text-center",
    media: "mb-2 shrink-0 items-center justify-center",
    title: "text-center text-base font-medium text-foreground",
    description: "text-center text-sm leading-relaxed text-muted",
    content: "w-full max-w-sm min-w-0 items-center gap-2",
  },
  variants: {
    media: {
      default: {},
      icon: {
        media: "size-10 rounded-xl bg-default",
      },
    },
  },
  defaultVariants: {
    media: "default",
  },
});

export type EmptyStateVariants = VariantProps<typeof emptyStateVariants>;

export interface EmptyStateRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const EmptyStateRoot = forwardRef<View, EmptyStateRootProps>(
  ({ children, className, ...props }, ref) => {
    const slots = emptyStateVariants();

    return (
      <View ref={ref} className={slots.root({ className })} {...props}>
        {children}
      </View>
    );
  },
);

EmptyStateRoot.displayName = "PitsiUINative.EmptyStateRoot";

export interface EmptyStateHeaderProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const EmptyStateHeader = forwardRef<View, EmptyStateHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const slots = emptyStateVariants();

    return (
      <View ref={ref} className={slots.header({ className })} {...props}>
        {children}
      </View>
    );
  },
);

EmptyStateHeader.displayName = "PitsiUINative.EmptyStateHeader";

export interface EmptyStateMediaProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  variant?: EmptyStateVariants["media"];
}

const EmptyStateMedia = forwardRef<View, EmptyStateMediaProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    const slots = emptyStateVariants({ media: variant });

    return (
      <View ref={ref} className={slots.media({ className })} {...props}>
        {children}
      </View>
    );
  },
);

EmptyStateMedia.displayName = "PitsiUINative.EmptyStateMedia";

export interface EmptyStateTitleProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const EmptyStateTitle = forwardRef<any, EmptyStateTitleProps>(
  ({ children, className, ...props }, ref) => {
    const slots = emptyStateVariants();

    return (
      <Text ref={ref} className={slots.title({ className })} {...props}>
        {children}
      </Text>
    );
  },
);

EmptyStateTitle.displayName = "PitsiUINative.EmptyStateTitle";

export interface EmptyStateDescriptionProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const EmptyStateDescription = forwardRef<any, EmptyStateDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    const slots = emptyStateVariants();

    return (
      <Text ref={ref} className={slots.description({ className })} {...props}>
        {children}
      </Text>
    );
  },
);

EmptyStateDescription.displayName = "PitsiUINative.EmptyStateDescription";

export interface EmptyStateContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const EmptyStateContent = forwardRef<View, EmptyStateContentProps>(
  ({ children, className, ...props }, ref) => {
    const slots = emptyStateVariants();

    return (
      <View ref={ref} className={slots.content({ className })} {...props}>
        {children}
      </View>
    );
  },
);

EmptyStateContent.displayName = "PitsiUINative.EmptyStateContent";

export {
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateRoot,
  EmptyStateTitle,
};
