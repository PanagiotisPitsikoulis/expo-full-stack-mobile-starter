import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const switchGroupVariants = tv({
  slots: {
    root: "gap-3",
    items: "gap-4",
    label: "text-sm font-medium text-foreground",
  },
  variants: {
    orientation: {
      horizontal: {
        items: "flex-row items-center",
      },
      vertical: {
        items: "flex-col",
      },
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export type SwitchGroupVariants = VariantProps<typeof switchGroupVariants>;

export interface SwitchGroupRootProps extends ViewProps, SwitchGroupVariants {
  children?: ReactNode;
  className?: string;
  label?: ReactNode;
}

const SwitchGroupRoot = forwardRef<View, SwitchGroupRootProps>(
  ({ children, className, label, orientation = "vertical", ...props }, ref) => {
    const slots = switchGroupVariants({ orientation });

    return (
      <View ref={ref} className={slots.root({ className })} {...props}>
        {label ? (
          typeof label === "string" || typeof label === "number" ? (
            <Text className={slots.label()}>{label}</Text>
          ) : (
            label
          )
        ) : null}
        <View className={slots.items()}>{children}</View>
      </View>
    );
  },
);

SwitchGroupRoot.displayName = "PitsiUINative.SwitchGroupRoot";

export { SwitchGroupRoot };
