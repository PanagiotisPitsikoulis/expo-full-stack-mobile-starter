import { forwardRef, type ReactNode } from "react";
import { type StyleProp, View, type ViewProps, type ViewStyle } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const resizableVariants = tv({
  slots: {
    group: "min-h-0 min-w-0",
    handle: "shrink-0 items-center justify-center bg-transparent",
    grip: "rounded-full bg-foreground/30",
    panel: "min-h-0 min-w-0",
  },
  variants: {
    orientation: {
      horizontal: {
        group: "flex-row",
        handle: "w-3",
        grip: "h-24 w-1",
      },
      vertical: {
        group: "flex-col",
        handle: "h-3",
        grip: "h-1 w-24",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type ResizableVariants = VariantProps<typeof resizableVariants>;

type ResizableOrientation = "horizontal" | "vertical";
type SizeValue = number | string;

export interface ResizablePanelGroupProps extends ViewProps, ResizableVariants {
  children?: ReactNode;
  className?: string;
  direction?: ResizableOrientation;
}

const ResizablePanelGroup = forwardRef<View, ResizablePanelGroupProps>(
  ({ children, className, direction, orientation = "horizontal", ...props }, ref) => {
    const resolvedOrientation = orientation ?? direction ?? "horizontal";
    const slots = resizableVariants({ orientation: resolvedOrientation });

    return (
      <View ref={ref} className={slots.group({ className })} {...props}>
        {children}
      </View>
    );
  },
);

ResizablePanelGroup.displayName = "PitsiUINative.ResizablePanelGroup";

function toFlex(value: SizeValue | undefined) {
  if (typeof value === "number") {
    return Math.max(0, value);
  }

  if (typeof value === "string") {
    const numeric = Number.parseFloat(value);
    return Number.isFinite(numeric) ? Math.max(0, numeric) : undefined;
  }

  return undefined;
}

export interface ResizablePanelProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  defaultSize?: SizeValue;
  maxSize?: SizeValue;
  minSize?: SizeValue;
}

const ResizablePanel = forwardRef<View, ResizablePanelProps>(
  (
    { children, className, defaultSize, maxSize: _maxSize, minSize: _minSize, style, ...props },
    ref,
  ) => {
    const slots = resizableVariants();
    const flex = toFlex(defaultSize) ?? 1;
    const panelStyle: StyleProp<ViewStyle> = [
      { flexGrow: flex, flexShrink: 1, flexBasis: 0 },
      style,
    ];

    return (
      <View ref={ref} className={slots.panel({ className })} style={panelStyle} {...props}>
        {children}
      </View>
    );
  },
);

ResizablePanel.displayName = "PitsiUINative.ResizablePanel";

export interface ResizableHandleProps extends ViewProps {
  className?: string;
  orientation?: ResizableOrientation;
  withHandle?: boolean;
}

const ResizableHandle = forwardRef<View, ResizableHandleProps>(
  ({ children, className, orientation = "horizontal", withHandle, ...props }, ref) => {
    const slots = resizableVariants({ orientation });

    return (
      <View ref={ref} className={slots.handle({ className })} {...props}>
        {children ?? (withHandle ? <View className={slots.grip()} /> : null)}
      </View>
    );
  },
);

ResizableHandle.displayName = "PitsiUINative.ResizableHandle";

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
