import { forwardRef, type ReactNode } from "react";
import { TextInput, type TextInputProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text, type TextProps } from "../text";

export const dateInputGroupVariants = tv({
  slots: {
    input: "min-h-11 min-w-0 flex-1 px-2 text-base text-foreground",
    inputContainer: "min-w-0 flex-1 flex-row items-center",
    prefix: "px-3",
    root: "min-h-11 flex-row items-center overflow-hidden rounded-xl border border-border bg-background",
    segment: "text-base text-foreground",
    suffix: "px-3",
  },
});

export type DateInputGroupVariants = VariantProps<typeof dateInputGroupVariants>;

export interface DateInputGroupRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface DateInputGroupInputProps extends TextInputProps {
  className?: string;
}

export interface DateInputGroupInputContainerProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface DateInputGroupPrefixProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface DateInputGroupSegmentProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export interface DateInputGroupSuffixProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DateInputGroupRoot = forwardRef<View, DateInputGroupRootProps>(
  ({ className, ...props }, ref) => {
    const slots = dateInputGroupVariants();
    return <View ref={ref} className={slots.root({ className })} {...props} />;
  },
);

const DateInputGroupInput = forwardRef<TextInput, DateInputGroupInputProps>(
  ({ className, keyboardType, placeholderTextColor = "#8a8a8a", ...props }, ref) => {
    const slots = dateInputGroupVariants();
    return (
      <TextInput
        ref={ref}
        className={slots.input({ className })}
        keyboardType={keyboardType ?? "numbers-and-punctuation"}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    );
  },
);

const DateInputGroupInputContainer = forwardRef<View, DateInputGroupInputContainerProps>(
  ({ className, ...props }, ref) => {
    const slots = dateInputGroupVariants();
    return <View ref={ref} className={slots.inputContainer({ className })} {...props} />;
  },
);

const DateInputGroupPrefix = forwardRef<View, DateInputGroupPrefixProps>(
  ({ className, ...props }, ref) => {
    const slots = dateInputGroupVariants();
    return <View ref={ref} className={slots.prefix({ className })} {...props} />;
  },
);

function DateInputGroupSegment({ className, ...props }: DateInputGroupSegmentProps) {
  const slots = dateInputGroupVariants();
  return <Text className={slots.segment({ className })} {...props} />;
}

const DateInputGroupSuffix = forwardRef<View, DateInputGroupSuffixProps>(
  ({ className, ...props }, ref) => {
    const slots = dateInputGroupVariants();
    return <View ref={ref} className={slots.suffix({ className })} {...props} />;
  },
);

DateInputGroupRoot.displayName = "PitsiUINative.DateInputGroupRoot";
DateInputGroupInput.displayName = "PitsiUINative.DateInputGroupInput";
DateInputGroupInputContainer.displayName = "PitsiUINative.DateInputGroupInputContainer";
DateInputGroupPrefix.displayName = "PitsiUINative.DateInputGroupPrefix";
DateInputGroupSuffix.displayName = "PitsiUINative.DateInputGroupSuffix";

export {
  DateInputGroupInput,
  DateInputGroupInputContainer,
  DateInputGroupPrefix,
  DateInputGroupRoot,
  DateInputGroupSegment,
  DateInputGroupSuffix,
};
