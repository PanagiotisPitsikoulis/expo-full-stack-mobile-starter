import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const dateFieldVariants = tv({
  base: "gap-2",
});

export type DateFieldVariants = VariantProps<typeof dateFieldVariants>;

export interface DateFieldRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DateFieldRoot = forwardRef<View, DateFieldRootProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={dateFieldVariants({ className })} {...props} />
));

DateFieldRoot.displayName = "PitsiUINative.DateFieldRoot";

export { DateFieldRoot };
