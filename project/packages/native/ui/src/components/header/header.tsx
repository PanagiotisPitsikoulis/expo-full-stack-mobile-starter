import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";

export const headerVariants = tv({
  base: "w-full px-2 pt-1.5 pb-1",
});

export interface HeaderRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const HeaderRoot = forwardRef<View, HeaderRootProps>(({ children, className, ...props }, ref) => {
  return (
    <View className={headerVariants({ className })} ref={ref} {...props}>
      {children}
    </View>
  );
});

HeaderRoot.displayName = "PitsiUINative.Header";

export { HeaderRoot };
