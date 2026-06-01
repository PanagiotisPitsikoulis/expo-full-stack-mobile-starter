import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const listboxSectionVariants = tv({
  slots: {
    heading: "px-3 py-1 text-xs font-medium text-muted",
    root: "gap-1 py-1",
  },
});

export type ListBoxSectionVariants = VariantProps<typeof listboxSectionVariants>;

export interface ListBoxSectionRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  heading?: ReactNode;
  title?: ReactNode;
}

const ListBoxSectionRoot = forwardRef<View, ListBoxSectionRootProps>(
  ({ children, className, heading, title, ...props }, ref) => {
    const slots = listboxSectionVariants();
    const resolvedHeading = heading ?? title;

    return (
      <View ref={ref} className={slots.root({ className })} {...props}>
        {typeof resolvedHeading === "string" || typeof resolvedHeading === "number" ? (
          <Text className={slots.heading()}>{resolvedHeading}</Text>
        ) : (
          resolvedHeading
        )}
        {children}
      </View>
    );
  },
);

ListBoxSectionRoot.displayName = "PitsiUINative.ListBoxSectionRoot";

export { ListBoxSectionRoot };
