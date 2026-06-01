import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  type PressableProps,
  ScrollView,
  type ScrollViewProps,
  View,
  type ViewProps,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { IconChevronLeft, IconChevronRight } from "../icons";

export const carouselVariants = tv({
  slots: {
    content: "w-full overflow-hidden",
    item: "min-w-64 shrink-0",
    next: "size-10 items-center justify-center rounded-full bg-default",
    previous: "size-10 items-center justify-center rounded-full bg-default",
    root: "relative gap-3",
  },
  variants: {
    orientation: {
      horizontal: {
        content: "",
      },
      vertical: {
        content: "max-h-80",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type CarouselVariants = VariantProps<typeof carouselVariants>;
export type CarouselApi = {
  scrollNext: () => void;
  scrollPrev: () => void;
};

type CarouselContextValue = CarouselApi & {
  orientation: NonNullable<CarouselVariants["orientation"]>;
  registerScrollView: (view: ScrollView | null) => void;
  slots: ReturnType<typeof carouselVariants>;
};

const CarouselContext = createContext<CarouselContextValue | undefined>(undefined);

function useCarouselContext() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("Carousel compound components must be rendered inside Carousel.Root.");
  }

  return context;
}

export interface CarouselRootProps extends Omit<ViewProps, "onSelect">, CarouselVariants {
  children?: ReactNode;
  className?: string;
  opts?: Record<string, unknown>;
  plugins?: unknown[];
  setApi?: (api: CarouselApi) => void;
}

const CarouselRoot = forwardRef<View, CarouselRootProps>(
  (
    {
      children,
      className,
      opts: _opts,
      orientation = "horizontal",
      plugins: _plugins,
      setApi,
      ...props
    },
    ref,
  ) => {
    const slots = useMemo(() => carouselVariants({ orientation }), [orientation]);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const [offset, setOffset] = useState(0);

    const scrollBy = useCallback(
      (delta: number) => {
        const nextOffset = Math.max(0, offset + delta);
        setOffset(nextOffset);
        scrollViewRef.current?.scrollTo(
          orientation === "horizontal"
            ? { animated: true, x: nextOffset }
            : { animated: true, y: nextOffset },
        );
      },
      [offset, orientation],
    );

    const api = useMemo<CarouselApi>(
      () => ({
        scrollNext: () => scrollBy(280),
        scrollPrev: () => scrollBy(-280),
      }),
      [scrollBy],
    );

    const contextValue = useMemo<CarouselContextValue>(
      () => ({
        ...api,
        orientation: orientation ?? "horizontal",
        registerScrollView: (view) => {
          scrollViewRef.current = view;
        },
        slots,
      }),
      [api, orientation, slots],
    );

    useMemo(() => {
      setApi?.(api);
    }, [api, setApi]);

    return (
      <CarouselContext.Provider value={contextValue}>
        <View ref={ref} className={slots.root({ className })} {...props}>
          {children}
        </View>
      </CarouselContext.Provider>
    );
  },
);

CarouselRoot.displayName = "PitsiUINative.CarouselRoot";

export interface CarouselContentProps extends ScrollViewProps {
  children?: ReactNode;
  className?: string;
}

const CarouselContent = forwardRef<ScrollView, CarouselContentProps>(
  ({ children, className, horizontal, showsHorizontalScrollIndicator = false, ...props }, ref) => {
    const { orientation, registerScrollView, slots } = useCarouselContext();

    return (
      <ScrollView
        ref={(node) => {
          registerScrollView(node);
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={slots.content({ className })}
        horizontal={horizontal ?? orientation === "horizontal"}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        {...props}
      >
        {children}
      </ScrollView>
    );
  },
);

CarouselContent.displayName = "PitsiUINative.CarouselContent";

export interface CarouselItemProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const CarouselItem = forwardRef<View, CarouselItemProps>(
  ({ children, className, ...props }, ref) => {
    const { slots } = useCarouselContext();

    return (
      <Pressable ref={ref} className={slots.item({ className })} {...props}>
        {children}
      </Pressable>
    );
  },
);

CarouselItem.displayName = "PitsiUINative.CarouselItem";

export interface CarouselPreviousProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const CarouselPrevious = forwardRef<View, CarouselPreviousProps>(
  ({ children, className, onPress, ...props }, ref) => {
    const { scrollPrev, slots } = useCarouselContext();

    return (
      <Pressable
        ref={ref}
        accessibilityLabel="Previous slide"
        accessibilityRole="button"
        className={slots.previous({ className })}
        onPress={(event) => {
          onPress?.(event);
          scrollPrev();
        }}
        {...props}
      >
        {children ?? <IconChevronLeft className="text-foreground" />}
      </Pressable>
    );
  },
);

CarouselPrevious.displayName = "PitsiUINative.CarouselPrevious";

export interface CarouselNextProps extends PressableProps {
  children?: ReactNode;
  className?: string;
}

const CarouselNext = forwardRef<View, CarouselNextProps>(
  ({ children, className, onPress, ...props }, ref) => {
    const { scrollNext, slots } = useCarouselContext();

    return (
      <Pressable
        ref={ref}
        accessibilityLabel="Next slide"
        accessibilityRole="button"
        className={slots.next({ className })}
        onPress={(event) => {
          onPress?.(event);
          scrollNext();
        }}
        {...props}
      >
        {children ?? <IconChevronRight className="text-foreground" />}
      </Pressable>
    );
  },
);

CarouselNext.displayName = "PitsiUINative.CarouselNext";

export { CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselRoot };
