import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { ScrollView, type ScrollViewProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const scrollAreaVariants = tv({
  slots: {
    root: "",
    viewport: "",
  },
  variants: {
    orientation: {
      both: {},
      horizontal: {},
      vertical: {},
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export type ScrollAreaVariants = VariantProps<typeof scrollAreaVariants>;

type ScrollAreaContextValue = {
  slots: ReturnType<typeof scrollAreaVariants>;
};

const ScrollAreaContext = createContext<ScrollAreaContextValue | undefined>(undefined);

export interface ScrollAreaRootProps extends ScrollViewProps, ScrollAreaVariants {
  children?: ReactNode;
  className?: string;
  contentContainerClassName?: string;
}

const ScrollAreaRoot = forwardRef<ScrollView, ScrollAreaRootProps>(
  (
    {
      children,
      className,
      contentContainerClassName,
      horizontal,
      orientation = "vertical",
      showsHorizontalScrollIndicator = false,
      showsVerticalScrollIndicator = false,
      ...props
    },
    ref,
  ) => {
    const slots = useMemo(() => scrollAreaVariants({ orientation }), [orientation]);
    const isHorizontal = horizontal ?? orientation === "horizontal";

    return (
      <ScrollAreaContext.Provider value={{ slots }}>
        <ScrollView
          ref={ref}
          className={slots.root({ className })}
          contentContainerClassName={contentContainerClassName}
          horizontal={isHorizontal}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          {...props}
        >
          {children}
        </ScrollView>
      </ScrollAreaContext.Provider>
    );
  },
);

ScrollAreaRoot.displayName = "PitsiUINative.ScrollAreaRoot";

export interface ScrollAreaViewportProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ScrollAreaViewport = forwardRef<View, ScrollAreaViewportProps>(
  ({ children, className, ...props }, ref) => {
    const context = useContext(ScrollAreaContext);

    return (
      <View ref={ref} className={context?.slots.viewport({ className }) ?? className} {...props}>
        {children}
      </View>
    );
  },
);

ScrollAreaViewport.displayName = "PitsiUINative.ScrollAreaViewport";

export { ScrollAreaRoot, ScrollAreaViewport };
