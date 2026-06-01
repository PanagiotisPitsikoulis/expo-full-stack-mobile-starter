import { Children, createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { IconChevronLeft, IconChevronRight } from "../icons";
import { Text } from "../text";

export const paginationVariants = tv({
  slots: {
    root: "w-full gap-3",
    summary: "flex-row items-center gap-2",
    content: "flex-row flex-wrap items-center gap-1",
    item: "flex-row",
    link: "h-9 min-w-9 flex-row items-center justify-center gap-1.5 rounded-3xl px-3",
    linkLabel: "text-sm font-medium text-foreground",
    ellipsis: "h-9 min-w-9 text-center text-sm text-muted",
  },
  variants: {
    size: {
      lg: {
        link: "h-10 min-w-10 px-3.5",
        linkLabel: "text-base",
        ellipsis: "h-10 min-w-10 text-base",
      },
      md: {},
      sm: {
        link: "h-8 min-w-8 px-2.5",
        linkLabel: "text-xs",
        ellipsis: "h-8 min-w-8 text-xs",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type PaginationVariants = VariantProps<typeof paginationVariants>;

type PaginationContextValue = {
  slots: ReturnType<typeof paginationVariants>;
};

const PaginationContext = createContext<PaginationContextValue | undefined>(undefined);

function usePaginationSlots() {
  return useContext(PaginationContext)?.slots ?? paginationVariants();
}

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }

    return child;
  });
}

export interface PaginationRootProps extends ViewProps, PaginationVariants {
  children: ReactNode;
  className?: string;
}

const PaginationRoot = forwardRef<View, PaginationRootProps>(
  ({ children, className, size, ...props }, ref) => {
    const slots = useMemo(() => paginationVariants({ size }), [size]);

    return (
      <PaginationContext.Provider value={{ slots }}>
        <View
          ref={ref}
          accessibilityRole="summary"
          className={slots.root({ className })}
          {...props}
        >
          {children}
        </View>
      </PaginationContext.Provider>
    );
  },
);

PaginationRoot.displayName = "PitsiUINative.PaginationRoot";

export interface PaginationSummaryProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

const PaginationSummary = forwardRef<View, PaginationSummaryProps>(
  ({ children, className, ...props }, ref) => {
    const slots = usePaginationSlots();

    return (
      <View ref={ref} className={slots.summary({ className })} {...props}>
        {renderTextChildren(children, "text-sm text-muted")}
      </View>
    );
  },
);

PaginationSummary.displayName = "PitsiUINative.PaginationSummary";

export interface PaginationContentProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

const PaginationContent = forwardRef<View, PaginationContentProps>(
  ({ children, className, ...props }, ref) => {
    const slots = usePaginationSlots();

    return (
      <View ref={ref} className={slots.content({ className })} {...props}>
        {children}
      </View>
    );
  },
);

PaginationContent.displayName = "PitsiUINative.PaginationContent";

export interface PaginationItemProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

const PaginationItem = forwardRef<View, PaginationItemProps>(
  ({ children, className, ...props }, ref) => {
    const slots = usePaginationSlots();

    return (
      <View ref={ref} className={slots.item({ className })} {...props}>
        {children}
      </View>
    );
  },
);

PaginationItem.displayName = "PitsiUINative.PaginationItem";

type PaginationButtonProps = Omit<PressableProps, "children" | "disabled"> & {
  children: ReactNode;
  className?: string;
  isDisabled?: boolean;
};

export interface PaginationLinkProps extends PaginationButtonProps {
  isActive?: boolean;
}

const PaginationLink = forwardRef<View, PaginationLinkProps>(
  ({ children, className, isActive = false, isDisabled = false, ...props }, ref) => {
    const slots = usePaginationSlots();

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, selected: isActive }}
        className={slots.link({
          className: `${isActive ? "bg-default" : "bg-transparent"} ${className ?? ""}`,
        })}
        disabled={isDisabled}
        {...props}
      >
        {renderTextChildren(children, slots.linkLabel())}
      </Pressable>
    );
  },
);

PaginationLink.displayName = "PitsiUINative.PaginationLink";

export interface PaginationPreviousProps extends PaginationButtonProps {}

const PaginationPrevious = forwardRef<View, PaginationPreviousProps>(
  ({ children, className, isDisabled = false, ...props }, ref) => {
    const slots = usePaginationSlots();

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        className={slots.link({ className })}
        disabled={isDisabled}
        {...props}
      >
        {renderTextChildren(children, slots.linkLabel())}
      </Pressable>
    );
  },
);

PaginationPrevious.displayName = "PitsiUINative.PaginationPrevious";

export interface PaginationNextProps extends PaginationButtonProps {}

const PaginationNext = forwardRef<View, PaginationNextProps>(
  ({ children, className, isDisabled = false, ...props }, ref) => {
    const slots = usePaginationSlots();

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        className={slots.link({ className })}
        disabled={isDisabled}
        {...props}
      >
        {renderTextChildren(children, slots.linkLabel())}
      </Pressable>
    );
  },
);

PaginationNext.displayName = "PitsiUINative.PaginationNext";

export interface PaginationPreviousIconProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const PaginationPreviousIcon = forwardRef<View, PaginationPreviousIconProps>(
  ({ children, className, ...props }, ref) => (
    <View
      ref={ref}
      accessibilityElementsHidden
      className={className}
      importantForAccessibility="no"
      {...props}
    >
      {children ?? <IconChevronLeft />}
    </View>
  ),
);

PaginationPreviousIcon.displayName = "PitsiUINative.PaginationPreviousIcon";

export interface PaginationNextIconProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const PaginationNextIcon = forwardRef<View, PaginationNextIconProps>(
  ({ children, className, ...props }, ref) => (
    <View
      ref={ref}
      accessibilityElementsHidden
      className={className}
      importantForAccessibility="no"
      {...props}
    >
      {children ?? <IconChevronRight />}
    </View>
  ),
);

PaginationNextIcon.displayName = "PitsiUINative.PaginationNextIcon";

export interface PaginationEllipsisProps extends ViewProps {
  className?: string;
}

const PaginationEllipsis = forwardRef<View, PaginationEllipsisProps>(
  ({ className, ...props }, ref) => {
    const slots = usePaginationSlots();

    return (
      <View ref={ref} className="items-center justify-center" {...props}>
        <Text className={slots.ellipsis({ className })}>...</Text>
      </View>
    );
  },
);

PaginationEllipsis.displayName = "PitsiUINative.PaginationEllipsis";

export {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationRoot,
  PaginationSummary,
};
