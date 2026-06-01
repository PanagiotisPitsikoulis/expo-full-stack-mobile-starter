import { forwardRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const colorPickerVariants = tv({
  slots: {
    popover: "gap-3 rounded-2xl border border-border bg-background p-3",
    root: "relative gap-2",
    trigger: "min-h-10 flex-row items-center gap-2 rounded-xl border border-border px-3 py-2",
  },
});

export type ColorPickerVariants = VariantProps<typeof colorPickerVariants>;

export interface ColorPickerRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ColorPickerRoot = forwardRef<View, ColorPickerRootProps>(({ className, ...props }, ref) => {
  const slots = colorPickerVariants();
  return <View ref={ref} className={slots.root({ className })} {...props} />;
});

export interface ColorPickerTriggerProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const ColorPickerTrigger = forwardRef<View, ColorPickerTriggerProps>(
  ({ className, ...props }, ref) => {
    const slots = colorPickerVariants();
    return <Pressable ref={ref} className={slots.trigger({ className })} {...props} />;
  },
);

export interface ColorPickerPopoverProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ColorPickerPopover = forwardRef<View, ColorPickerPopoverProps>(
  ({ className, ...props }, ref) => {
    const slots = colorPickerVariants();
    return <View ref={ref} className={slots.popover({ className })} {...props} />;
  },
);

export { ColorPickerPopover, ColorPickerRoot, ColorPickerTrigger };
