import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const menuSectionVariants = tv({
  slots: {
    heading: "px-3 py-1 text-xs font-medium text-muted",
    root: "gap-1 py-1",
  },
});

export type MenuSectionVariants = VariantProps<typeof menuSectionVariants>;

export interface MenuSectionRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  heading?: ReactNode;
  title?: ReactNode;
}

const MenuSectionRoot = forwardRef<View, MenuSectionRootProps>(
  ({ children, className, heading, title, ...props }, ref) => {
    const slots = menuSectionVariants();
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

MenuSectionRoot.displayName = "PitsiUINative.MenuSectionRoot";

export { MenuSectionRoot };
