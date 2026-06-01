import { createContext, forwardRef, type ReactNode, useContext, useMemo, useState } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const hoverCardVariants = tv({
  slots: {
    content: "min-w-56 gap-2 rounded-2xl border border-border bg-background p-4 shadow-sm",
    root: "relative gap-2",
    trigger: "self-start",
  },
});

export type HoverCardVariants = VariantProps<typeof hoverCardVariants>;

type HoverCardContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  slots: ReturnType<typeof hoverCardVariants>;
};

const HoverCardContext = createContext<HoverCardContextValue | undefined>(undefined);

function useHoverCardContext() {
  const context = useContext(HoverCardContext);

  if (!context) {
    throw new Error("HoverCard compound components must be rendered inside HoverCard.Root.");
  }

  return context;
}

export interface HoverCardRootProps extends Omit<ViewProps, "children"> {
  children?: ReactNode;
  className?: string;
  closeDelay?: number;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  openDelay?: number;
}

const HoverCardRoot = forwardRef<View, HoverCardRootProps>(
  (
    {
      children,
      className,
      closeDelay: _closeDelay,
      defaultOpen = false,
      onOpenChange,
      open,
      openDelay: _openDelay,
      ...props
    },
    ref,
  ) => {
    const slots = useMemo(() => hoverCardVariants(), []);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const currentOpen = open ?? internalOpen;

    const setOpen = (nextOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    };

    return (
      <HoverCardContext.Provider value={{ open: currentOpen, setOpen, slots }}>
        <View ref={ref} className={slots.root({ className })} {...props}>
          {children}
        </View>
      </HoverCardContext.Provider>
    );
  },
);

HoverCardRoot.displayName = "PitsiUINative.HoverCardRoot";

export interface HoverCardTriggerProps extends Omit<PressableProps, "children"> {
  children?: ReactNode;
  className?: string;
}

const HoverCardTrigger = forwardRef<View, HoverCardTriggerProps>(
  ({ children, className, onBlur, onFocus, onPress, ...props }, ref) => {
    const { open, setOpen, slots } = useHoverCardContext();

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className={slots.trigger({ className })}
        onBlur={(event) => {
          onBlur?.(event);
          setOpen(false);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          setOpen(true);
        }}
        onPress={(event) => {
          onPress?.(event);
          setOpen(!open);
        }}
        {...props}
      >
        {children}
      </Pressable>
    );
  },
);

HoverCardTrigger.displayName = "PitsiUINative.HoverCardTrigger";

export interface HoverCardContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  offset?: number;
  placement?: "bottom" | "left" | "right" | "top";
}

const HoverCardContent = forwardRef<View, HoverCardContentProps>(
  ({ children, className, offset: _offset, placement: _placement, ...props }, ref) => {
    const { open, slots } = useHoverCardContext();

    if (!open) {
      return null;
    }

    return (
      <View ref={ref} className={slots.content({ className })} {...props}>
        {children}
      </View>
    );
  },
);

HoverCardContent.displayName = "PitsiUINative.HoverCardContent";

export { HoverCardContent, HoverCardRoot, HoverCardTrigger };
