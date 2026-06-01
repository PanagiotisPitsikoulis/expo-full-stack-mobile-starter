import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const toolbarVariants = tv({
  base: "items-center gap-2",
  variants: {
    isAttached: {
      false: "",
      true: "rounded-full bg-surface p-1 shadow-overlay",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
  defaultVariants: {
    isAttached: false,
    orientation: "horizontal",
  },
});

export type ToolbarVariants = VariantProps<typeof toolbarVariants>;

export interface ToolbarRootProps extends ViewProps, ToolbarVariants {
  children?: ReactNode;
  className?: string;
}

const ToolbarRoot = forwardRef<View, ToolbarRootProps>(
  ({ children, className, isAttached = false, orientation = "horizontal", ...props }, ref) => {
    return (
      <View
        accessibilityRole="toolbar"
        className={toolbarVariants({ className, isAttached, orientation })}
        ref={ref}
        {...props}
      >
        {children}
      </View>
    );
  },
);

ToolbarRoot.displayName = "PitsiUINative.Toolbar";

export { ToolbarRoot };
