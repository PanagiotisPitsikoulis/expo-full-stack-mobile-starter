import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const tooltipVariants = tv({
  slots: {
    arrow: "h-2 w-2 rotate-45 bg-overlay",
    base: "max-w-xs rounded-xl bg-overlay px-2 py-1 shadow-overlay",
    root: "self-start",
    trigger: "self-start",
  },
});

export type TooltipVariants = VariantProps<typeof tooltipVariants>;

type TooltipContextValue = {
  setVisible: (visible: boolean) => void;
  slots: ReturnType<typeof tooltipVariants>;
  toggle: () => void;
  visible: boolean;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

export interface TooltipRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CONTENT_MARKER = "__pitsiTooltipContent";
const TRIGGER_MARKER = "__pitsiTooltipTrigger";

const TooltipRoot = forwardRef<View, TooltipRootProps>(
  ({ children, className, defaultOpen = false, isOpen, onOpenChange, ...props }, ref) => {
    const [internalVisible, setInternalVisible] = useState(defaultOpen);
    const visible = isOpen ?? internalVisible;
    const slots = useMemo(() => tooltipVariants(), []);
    const setVisible = useCallback(
      (next: boolean) => {
        if (isOpen === undefined) setInternalVisible(next);
        onOpenChange?.(next);
      },
      [isOpen, onOpenChange],
    );
    const context = useMemo(
      () => ({ setVisible, slots, toggle: () => setVisible(!visible), visible }),
      [setVisible, slots, visible],
    );
    let hasExplicitTrigger = false;

    const wrappedChildren = Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child;
      const type = child.type as unknown as Record<string, unknown>;
      if (type[TRIGGER_MARKER]) {
        hasExplicitTrigger = true;
        return child;
      }
      if (type[CONTENT_MARKER] || hasExplicitTrigger || index !== 0) return child;

      const triggerChild = child as ReactElement<{ onPress?: PressableProps["onPress"] }>;

      return cloneElement(triggerChild, {
        onPress: (event) => {
          triggerChild.props.onPress?.(event);
          context.toggle();
        },
      });
    });

    return (
      <TooltipContext.Provider value={context}>
        <View className={slots.root({ className })} ref={ref} {...props}>
          {wrappedChildren}
        </View>
      </TooltipContext.Provider>
    );
  },
);

TooltipRoot.displayName = "PitsiUINative.Tooltip";

export interface TooltipTriggerProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const TooltipTrigger = forwardRef<View, TooltipTriggerProps>(
  ({ children, className, onPress, ...props }, ref) => {
    const context = useContext(TooltipContext);

    return (
      <Pressable
        accessibilityRole="button"
        className={context?.slots.trigger({ className }) ?? className}
        onPress={(event) => {
          onPress?.(event);
          context?.toggle();
        }}
        ref={ref}
        {...props}
      >
        {children}
      </Pressable>
    );
  },
) as React.ForwardRefExoticComponent<TooltipTriggerProps & React.RefAttributes<View>> & {
  [TRIGGER_MARKER]?: boolean;
};

TooltipTrigger[TRIGGER_MARKER] = true;
TooltipTrigger.displayName = "PitsiUINative.Tooltip.Trigger";

export interface TooltipContentProps extends ViewProps, TooltipVariants {
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
}

const TooltipContent = forwardRef<View, TooltipContentProps>(
  ({ children, className, showArrow = false, ...props }, ref) => {
    const context = useContext(TooltipContext);
    if (!context?.visible) return null;

    return (
      <View className="mt-2 items-start">
        {showArrow ? <TooltipArrow /> : null}
        <View className={context.slots.base({ className })} ref={ref} {...props}>
          {typeof children === "string" || typeof children === "number" ? (
            <Text className="text-xs text-foreground">{children}</Text>
          ) : (
            children
          )}
        </View>
      </View>
    );
  },
) as React.ForwardRefExoticComponent<TooltipContentProps & React.RefAttributes<View>> & {
  [CONTENT_MARKER]?: boolean;
};

TooltipContent[CONTENT_MARKER] = true;
TooltipContent.displayName = "PitsiUINative.Tooltip.Content";

export interface TooltipArrowProps extends ViewProps {
  className?: string;
}

const TooltipArrow = forwardRef<View, TooltipArrowProps>(({ className, ...props }, ref) => {
  const context = useContext(TooltipContext);

  return (
    <View
      accessibilityElementsHidden
      className={context?.slots.arrow({ className }) ?? className}
      ref={ref}
      {...props}
    />
  );
});

TooltipArrow.displayName = "PitsiUINative.Tooltip.Arrow";

export { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger };
