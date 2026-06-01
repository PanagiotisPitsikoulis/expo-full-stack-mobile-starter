import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type LayoutChangeEvent,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  useWindowDimensions,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  type AnimatedProps,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";

import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type {
  Animation,
  AnimationRootDisableAll,
  AnimationValue,
} from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";
import * as TabsPrimitives from "../../primitives/tabs";
import type * as TabsPrimitivesTypes from "../../primitives/tabs/tabs.types";
import {
  useTabsIndicatorAnimation,
  useTabsRootAnimation,
  useTabsSeparatorAnimation,
} from "./tabs.animation";
import { MeasurementsContext, useTabsMeasurements } from "./tabs.context";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Tabs.Root",
  LIST: "PitsiUINative.Tabs.List",
  SCROLL_VIEW: "PitsiUINative.Tabs.ScrollView",
  TRIGGER: "PitsiUINative.Tabs.Trigger",
  LABEL: "PitsiUINative.Tabs.Label",
  INDICATOR: "PitsiUINative.Tabs.Indicator",
  SEPARATOR: "PitsiUINative.Tabs.Separator",
  CONTENT: "PitsiUINative.Tabs.Content",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the Tabs root component
 */
export interface TabsProps extends TabsPrimitivesTypes.RootProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  animation?: AnimationRootDisableAll;
}

/**
 * Props for the TabsList component
 */
export interface TabsListProps extends TabsPrimitivesTypes.ListProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Props for the TabsScrollView component
 */
export interface TabsScrollViewProps extends ScrollViewProps {
  className?: string;
  contentContainerClassName?: string;
  children?: React.ReactNode;
  scrollAlign?: "start" | "center" | "end" | "none";
}

/**
 * Render function props for TabsTrigger children
 */
export interface TabsTriggerRenderProps {
  isSelected: boolean;
  value: string;
  isDisabled: boolean;
}

/**
 * Props for the TabsTrigger component
 */
export interface TabsTriggerProps extends Omit<TabsPrimitivesTypes.TriggerProps, "children"> {
  value: string;
  isDisabled?: boolean;
  className?: string;
  children?: React.ReactNode | ((props: TabsTriggerRenderProps) => React.ReactNode);
}

/**
 * Props for the TabsLabel component
 */
export interface TabsLabelProps extends TabsPrimitivesTypes.LabelProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Spring animation value for tabs indicator properties
 */
type TabsIndicatorSpringAnimationValue = AnimationValue<{
  type: "spring";
  config?: WithSpringConfig;
}>;

/**
 * Timing animation value for tabs indicator properties
 */
type TabsIndicatorTimingAnimationValue = AnimationValue<{
  type: "timing";
  config?: WithTimingConfig;
}>;

/**
 * Animation value for tabs indicator properties (width, height, translateX)
 */
type TabsIndicatorPropertyAnimationValue =
  | TabsIndicatorSpringAnimationValue
  | TabsIndicatorTimingAnimationValue;

/**
 * Animation configuration for tabs indicator component
 */
export type TabsIndicatorAnimation = Animation<{
  width?: TabsIndicatorPropertyAnimationValue;
  height?: TabsIndicatorPropertyAnimationValue;
  translateX?: TabsIndicatorPropertyAnimationValue;
}>;

/**
 * Props for the TabsIndicator component
 */
export interface TabsIndicatorProps extends TabsPrimitivesTypes.IndicatorProps {
  className?: string;
  children?: React.ReactNode;
  animation?: TabsIndicatorAnimation;
  isAnimatedStyleActive?: boolean;
}

/**
 * Animation configuration for tabs separator component
 */
export type TabsSeparatorAnimation = Animation<{
  opacity?: AnimationValue<{
    value?: [number, number];
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Props for the TabsSeparator component
 */
export interface TabsSeparatorProps extends AnimatedProps<ViewProps> {
  betweenValues: string[];
  isAlwaysVisible?: boolean;
  animation?: TabsSeparatorAnimation;
  isAnimatedStyleActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Props for the TabsContent component
 */
export interface TabsContentProps extends TabsPrimitivesTypes.ContentProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Measurements for a tab item
 */
export type ItemMeasurements = {
  width: number;
  height: number;
  x: number;
};

/**
 * Context value for tab measurements
 */
export type MeasurementsContextValue = {
  measurements: Record<string, ItemMeasurements>;
  setMeasurements: (key: string, measurements: ItemMeasurements) => void;
  variant: "primary" | "secondary";
  isScrollView: boolean;
  setIsScrollView: (isScrollView: boolean) => void;
};

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "flex-col gap-2",
});

const list = tv({
  base: "self-start flex-row items-center gap-1",
  variants: {
    variant: {
      primary: "p-[3px] rounded-3xl bg-default",
      secondary: "p-0 border-b border-border",
    },
  },
  defaultVariants: {
    variant: "primary",
    isScrollView: false,
  },
});

const scrollView = tv({
  base: "",
  variants: {
    variant: {
      primary: "-my-[3px] rounded-3xl",
      secondary: "",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const scrollViewContentContainer = tv({
  base: "",
  variants: {
    variant: {
      primary: "py-[3px] px-px",
      secondary: "",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const trigger = tv({
  base: "flex-row items-center justify-center px-3 py-1.5 gap-1.5",
  variants: {
    isDisabled: {
      true: "disabled:opacity-disabled disabled:pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

const label = tv({
  base: "text-base font-medium",
  variants: {
    isSelected: {
      true: "text-segment-foreground",
      false: "text-muted",
    },
  },
});

const indicator = tv({
  base: "absolute left-0",
  variants: {
    variant: {
      primary: "rounded-3xl shadow-sm shadow-surface/25 bg-segment",
      secondary: "bottom-0 border-b-2 border-accent",
    },
    isScrollView: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      isScrollView: true,
      className: "top-[3px]",
    },
  ],
  defaultVariants: {
    variant: "primary",
    isScrollView: false,
  },
});

const separator = tv({
  base: "w-px h-3/5 bg-separator/30 self-center",
});

const content = tv({
  base: "",
});

export const tabsClassNames = combineStyles({
  root,
  list,
  scrollView,
  scrollViewContentContainer,
  trigger,
  label,
  indicator,
  separator,
  content,
});

export const tabsStyleSheet = StyleSheet.create({
  listRoot: {
    borderCurve: "continuous",
  },
  triggerRoot: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Tabs components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedIndicator = Animated.createAnimatedComponent(TabsPrimitives.Indicator);

const useTabs = TabsPrimitives.useRootContext;
const useTabsTrigger = TabsPrimitives.useTriggerContext;

// --------------------------------------------------

const TabsRoot = forwardRef<TabsPrimitivesTypes.RootRef, TabsProps>((props, ref) => {
  const {
    children,
    value,
    onValueChange,
    className,
    variant = "primary",
    animation,
    ...restProps
  } = props;

  const [measurements, setMeasurementsState] = useState<Record<string, ItemMeasurements>>({});
  const [isScrollView, setIsScrollView] = useState(false);

  const setMeasurements = useCallback((key: string, newMeasurements: ItemMeasurements) => {
    setMeasurementsState((prev) => ({
      ...prev,
      [key]: newMeasurements,
    }));
  }, []);

  const { isAllAnimationsDisabled } = useTabsRootAnimation({ animation });

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const rootClassName = tabsClassNames.root({ className });

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <MeasurementsContext.Provider
        value={{
          measurements,
          setMeasurements,
          variant,
          isScrollView,
          setIsScrollView,
        }}
      >
        <TabsPrimitives.Root
          ref={ref}
          value={value}
          onValueChange={onValueChange}
          className={rootClassName}
          {...restProps}
        >
          {children}
        </TabsPrimitives.Root>
      </MeasurementsContext.Provider>
    </AnimationSettingsProvider>
  );
});

// --------------------------------------------------

const TabsList = forwardRef<TabsPrimitivesTypes.ListRef, TabsListProps>((props, ref) => {
  const { children, className, style, ...restProps } = props;

  const { variant, setIsScrollView } = useTabsMeasurements();

  const handleLayout = useCallback(() => {
    const childrenArray = Children.toArray(children);
    const hasScrollView =
      childrenArray.length === 1 &&
      isValidElement(childrenArray[0]) &&
      (childrenArray[0].type as any)?.displayName === DISPLAY_NAME.SCROLL_VIEW;
    setIsScrollView(hasScrollView);
  }, [children, setIsScrollView]);

  const listClassName = tabsClassNames.list({ variant, className });

  return (
    <TabsPrimitives.List
      ref={ref}
      className={listClassName}
      style={[tabsStyleSheet.listRoot, style]}
      onLayout={handleLayout}
      {...restProps}
    >
      {children}
    </TabsPrimitives.List>
  );
});

// --------------------------------------------------

const TabsScrollView = forwardRef<ScrollView, TabsScrollViewProps>((props, ref) => {
  const {
    children,
    className,
    contentContainerClassName,
    showsHorizontalScrollIndicator = false,
    scrollAlign = "center",
    ...restProps
  } = props;

  const { value } = useTabs();
  const { measurements, variant } = useTabsMeasurements();
  const { width: screenWidth } = useWindowDimensions();

  const scrollViewClassName = tabsClassNames.scrollView({
    variant,
    className,
  });
  const contentContainerClassNameValue = tabsClassNames.scrollViewContentContainer({
    variant,
    className: contentContainerClassName,
  });

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollAlign === "none" || !measurements[value]) return;

    const itemMeasurement = measurements[value];
    let scrollToX = 0;

    if (scrollAlign === "start") {
      scrollToX = itemMeasurement.x;
    } else if (scrollAlign === "center") {
      const itemCenter = itemMeasurement.x + itemMeasurement.width / 2;
      scrollToX = itemCenter - screenWidth / 2;
    } else if (scrollAlign === "end") {
      scrollToX = itemMeasurement.x + itemMeasurement.width - screenWidth;
    }

    scrollRef.current?.scrollTo({
      x: Math.max(0, scrollToX),
      animated: true,
    });
  }, [value, measurements, scrollAlign, screenWidth]);

  return (
    <ScrollView
      ref={(instance) => {
        scrollRef.current = instance;
        if (typeof ref === "function") {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      }}
      horizontal
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      className={scrollViewClassName}
      contentContainerClassName={contentContainerClassNameValue}
      {...restProps}
    >
      {children}
    </ScrollView>
  );
});

// --------------------------------------------------

const TabsTrigger = forwardRef<TabsPrimitivesTypes.TriggerRef, TabsTriggerProps>((props, ref) => {
  const { children, value, isDisabled = false, className, style, ...restProps } = props;
  const { setMeasurements } = useTabsMeasurements();
  const { value: rootValue } = useTabs();

  const isSelected = rootValue === value;

  const triggerClassName = tabsClassNames.trigger({ isDisabled, className });

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height, x } = event.nativeEvent.layout;
      setMeasurements(value, { width, height, x });
    },
    [value, setMeasurements],
  );

  const renderProps: TabsTriggerRenderProps = {
    isSelected,
    value,
    isDisabled,
  };

  const content = typeof children === "function" ? children(renderProps) : children;

  return (
    <TabsPrimitives.Trigger
      ref={ref}
      value={value}
      disabled={isDisabled}
      className={triggerClassName}
      style={[tabsStyleSheet.triggerRoot, style as ViewStyle]}
      onLayout={handleLayout}
      {...restProps}
    >
      {content}
    </TabsPrimitives.Trigger>
  );
});

// --------------------------------------------------

const TabsLabel = forwardRef<TabsPrimitivesTypes.LabelRef, TabsLabelProps>((props, ref) => {
  const { children, className, ...restProps } = props;
  const { isSelected } = useTabsTrigger();

  const labelClassName = tabsClassNames.label({ isSelected, className });

  return (
    <TabsPrimitives.Label ref={ref} className={labelClassName} {...restProps}>
      {children}
    </TabsPrimitives.Label>
  );
});

// --------------------------------------------------

const TabsIndicator = forwardRef<TabsPrimitivesTypes.IndicatorRef, TabsIndicatorProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      animation,
      isAnimatedStyleActive = true,
      ...restProps
    } = props;

    const { variant, isScrollView } = useTabsMeasurements();

    const { rContainerStyle } = useTabsIndicatorAnimation({
      animation,
    });

    const indicatorClassName = tabsClassNames.indicator({
      variant,
      isScrollView,
      className,
    });

    const indicatorStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

    return (
      <AnimatedIndicator
        ref={ref}
        className={indicatorClassName}
        style={indicatorStyle}
        {...restProps}
      >
        {children}
      </AnimatedIndicator>
    );
  },
);

// --------------------------------------------------

const TabsSeparator = forwardRef<Animated.View, TabsSeparatorProps>((props, ref) => {
  const {
    betweenValues,
    isAlwaysVisible = false,
    animation,
    isAnimatedStyleActive = true,
    className,
    style,
    ...restProps
  } = props;

  const { rContainerStyle } = useTabsSeparatorAnimation({
    animation,
    betweenValues,
    isAlwaysVisible,
  });

  const separatorClassName = tabsClassNames.separator({ className });

  const separatorStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

  return (
    <Animated.View ref={ref} className={separatorClassName} style={separatorStyle} {...restProps} />
  );
});

// --------------------------------------------------

const TabsContent = forwardRef<TabsPrimitivesTypes.ContentRef, TabsContentProps>((props, ref) => {
  const { children, value, className, ...restProps } = props;

  const contentClassName = tabsClassNames.content({ className });

  return (
    <TabsPrimitives.Content ref={ref} value={value} className={contentClassName} {...restProps}>
      {children}
    </TabsPrimitives.Content>
  );
});

// --------------------------------------------------

TabsRoot.displayName = DISPLAY_NAME.ROOT;
TabsList.displayName = DISPLAY_NAME.LIST;
TabsScrollView.displayName = DISPLAY_NAME.SCROLL_VIEW;
TabsTrigger.displayName = DISPLAY_NAME.TRIGGER;
TabsLabel.displayName = DISPLAY_NAME.LABEL;
TabsIndicator.displayName = DISPLAY_NAME.INDICATOR;
TabsSeparator.displayName = DISPLAY_NAME.SEPARATOR;
TabsContent.displayName = DISPLAY_NAME.CONTENT;

/**
 * Compound Tabs component with sub-components
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/tabs
 */
const Tabs = Object.assign(TabsRoot, {
  /** Container for tab triggers */
  List: TabsList,
  /** Scrollable wrapper for tab triggers */
  ScrollView: TabsScrollView,
  /** Individual tab button */
  Trigger: TabsTrigger,
  /** Label text for tab triggers */
  Label: TabsLabel,
  /** Visual indicator for active tab */
  Indicator: TabsIndicator,
  /** Visual separator between tabs */
  Separator: TabsSeparator,
  /** Content panel for each tab */
  Content: TabsContent,
});

export { Tabs, useTabs, useTabsMeasurements, useTabsTrigger };
export default Tabs;
