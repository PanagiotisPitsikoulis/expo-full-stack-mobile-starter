import { forwardRef, type ReactNode } from "react";
import { TextInput, type TextInputProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const colorInputGroupVariants = tv({
  slots: {
    input: "min-h-11 min-w-0 flex-1 px-3 text-base text-foreground",
    prefix: "px-3",
    root: "min-h-11 flex-row items-center overflow-hidden rounded-xl border border-border bg-background",
    suffix: "px-3",
  },
});

export type ColorInputGroupVariants = VariantProps<typeof colorInputGroupVariants>;

export interface ColorInputGroupRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ColorInputGroupRoot = forwardRef<View, ColorInputGroupRootProps>(
  ({ className, ...props }, ref) => {
    const slots = colorInputGroupVariants();
    return <View ref={ref} className={slots.root({ className })} {...props} />;
  },
);

export interface ColorInputGroupInputProps extends TextInputProps {
  className?: string;
}

const ColorInputGroupInput = forwardRef<TextInput, ColorInputGroupInputProps>(
  ({ className, placeholderTextColor = "#8a8a8a", ...props }, ref) => {
    const slots = colorInputGroupVariants();
    return (
      <TextInput
        ref={ref}
        className={slots.input({ className })}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    );
  },
);

export interface ColorInputGroupPrefixProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ColorInputGroupPrefix = forwardRef<View, ColorInputGroupPrefixProps>(
  ({ className, ...props }, ref) => {
    const slots = colorInputGroupVariants();
    return <View ref={ref} className={slots.prefix({ className })} {...props} />;
  },
);

export interface ColorInputGroupSuffixProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ColorInputGroupSuffix = forwardRef<View, ColorInputGroupSuffixProps>(
  ({ className, ...props }, ref) => {
    const slots = colorInputGroupVariants();
    return <View ref={ref} className={slots.suffix({ className })} {...props} />;
  },
);

export { ColorInputGroupInput, ColorInputGroupPrefix, ColorInputGroupRoot, ColorInputGroupSuffix };
