import { Children, forwardRef, useMemo } from "react";
import { StyleSheet, type View, type ViewStyle } from "react-native";
import Animated, {
  type AnimatedProps,
  Easing,
  type EntryOrExitLayoutType,
  FadeIn,
  FadeOut,
  LinearTransition,
  type WithSpringConfig,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { ChevronDownIcon } from "../../helpers/internal/components";
import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type {
  Animation,
  AnimationRoot,
  AnimationValue,
  ElementSlots,
  LayoutTransition,
  ViewRef,
} from "../../helpers/internal/types";
import { combineStyles, createContext } from "../../helpers/internal/utils";
import type {
  ContentProps as PrimitiveContentProps,
  IndicatorProps as PrimitiveIndicatorProps,
  ItemProps as PrimitiveItemProps,
  RootProps as PrimitiveRootProps,
  TriggerProps as PrimitiveTriggerProps,
} from "../../primitives/accordion";
import * as AccordionPrimitive from "../../primitives/accordion";
import {
  AccordionAnimationProvider,
  useAccordionAnimation,
  useAccordionContentAnimation,
  useAccordionIndicatorAnimation,
  useAccordionRootAnimation,
} from "./accordion.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Accordion components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Accordion.Root",
  ITEM: "PitsiUINative.Accordion.Item",
  TRIGGER: "PitsiUINative.Accordion.Trigger",
  INDICATOR: "PitsiUINative.Accordion.Indicator",
  CONTENT: "PitsiUINative.Accordion.Content",
  CHEVRON_DOWN_ICON: "PitsiUINative.Accordion.ChevronDownIcon",
} as const;

/**
 * Default layout transition for accordion animations
 */
export const ACCORDION_LAYOUT_TRANSITION = LinearTransition.springify()
  .damping(140)
  .stiffness(1600)
  .mass(4);

/**
 * Default icon size for the indicator
 */
export const DEFAULT_ICON_SIZE = 16;

/**
 * Rotation values for indicator animation
 */
export const INDICATOR_ROTATION = {
  COLLAPSED: "0deg",
  EXPANDED: "180deg",
};

/**
 * Spring configuration for indicator animation
 */
export const INDICATOR_SPRING_CONFIG = {
  damping: 140,
  stiffness: 1000,
  mass: 4,
};

/**
 * Default entering animation for accordion content
 */
export const DEFAULT_CONTENT_ENTERING = FadeIn.duration(200).easing(Easing.out(Easing.ease));

/**
 * Default exiting animation for accordion content
 */
export const DEFAULT_CONTENT_EXITING = FadeOut.duration(200).easing(Easing.in(Easing.ease));

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  slots: {
    container: "flex-col overflow-hidden",
    separator: "h-hairline bg-separator",
  },
  variants: {
    variant: {
      default: {
        container: "",
        separator: "",
      },
      surface: {
        container: "bg-surface rounded-3xl border border-surface shadow-surface",
        separator: "mx-3",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const item = tv({
  base: "flex-col overflow-hidden",
});

const trigger = tv({
  base: "flex-row items-center justify-between py-4 px-3 gap-4 bg-transparent z-10",
  variants: {
    variant: {
      default: "",
      surface: "px-5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const indicator = tv({
  base: "items-center justify-center",
});

const content = tv({
  base: "px-3 pb-4 bg-transparent",
  variants: {
    variant: {
      default: "",
      surface: "px-5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionClassNames = combineStyles({
  root,
  item,
  trigger,
  indicator,
  content,
});

export const accordionStyleSheet = StyleSheet.create({
  root: {
    borderCurve: "continuous",
  },
});

export type RootSlots = keyof ReturnType<typeof root>;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Variant types for the Accordion component
 */
export type AccordionVariant = "default" | "surface";

/**
 * Icon props for the Accordion.Indicator component
 */
export interface AccordionIndicatorIconProps {
  /** @default 16 */
  size?: number;
  /** @default foreground */
  color?: string;
}

/**
 * Animation configuration for accordion root component
 */
export type AccordionRootAnimation = AnimationRoot<{
  layout?: AnimationValue<{
    value?: LayoutTransition;
  }>;
}>;

/**
 * Props for the Accordion root component
 */
export type AccordionRootProps = Omit<AnimatedProps<PrimitiveRootProps>, "layout"> & {
  children?: React.ReactNode;
  /** @default 'default' */
  variant?: AccordionVariant;
  /** @default false */
  hideSeparator?: boolean;
  className?: string;
  classNames?: ElementSlots<RootSlots>;
  styles?: Partial<Record<RootSlots, ViewStyle>>;
  animation?: AccordionRootAnimation;
};

/**
 * Render function props for accordion item children
 */
export type AccordionItemRenderProps = {
  isExpanded: boolean;
  value: string;
};

/**
 * Props for the Accordion.Item component
 */
export interface AccordionItemProps extends Omit<AnimatedProps<PrimitiveItemProps>, "children"> {
  children?: React.ReactNode | ((props: AccordionItemRenderProps) => React.ReactNode);
  className?: string;
}

/**
 * Props for the Accordion.Trigger component
 */
export interface AccordionTriggerProps extends PrimitiveTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Animation configuration for accordion indicator component
 */
export type AccordionIndicatorAnimation = Animation<{
  rotation?: AnimationValue<{
    value?: [number, number];
    springConfig?: WithSpringConfig;
  }>;
}>;

/**
 * Props for the Accordion.Indicator component
 */
export interface AccordionIndicatorProps extends AnimatedProps<PrimitiveIndicatorProps> {
  children?: React.ReactNode;
  className?: string;
  iconProps?: AccordionIndicatorIconProps;
  animation?: AccordionIndicatorAnimation;
  isAnimatedStyleActive?: boolean;
}

/**
 * Animation configuration for accordion content component
 */
export type AccordionContentAnimation = Animation<{
  entering?: AnimationValue<{
    value?: EntryOrExitLayoutType;
  }>;
  exiting?: AnimationValue<{
    value?: EntryOrExitLayoutType;
  }>;
}>;

/**
 * Props for the Accordion.Content component
 */
export interface AccordionContentProps extends PrimitiveContentProps {
  children?: React.ReactNode;
  className?: string;
  animation?: AccordionContentAnimation;
}

/**
 * Context values shared between Accordion components
 */
export interface AccordionContextValue {
  variant: AccordionVariant;
}

/**
 * Context value for accordion animation state
 */
export interface AccordionAnimationContextValue {
  layoutTransition?: LayoutTransition;
}

/* -------------------------------------------------------------------------------------------------
 * Animated views
 * -----------------------------------------------------------------------------------------------*/
const AnimatedRootView = Animated.createAnimatedComponent(AccordionPrimitive.Root);

const AnimatedItemView = Animated.createAnimatedComponent(AccordionPrimitive.Item);

const AnimatedIndicator = Animated.createAnimatedComponent(AccordionPrimitive.Indicator);

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const [AccordionInnerProvider, useAccordionInnerContext] = createContext<AccordionContextValue>({
  name: "AccordionInnerContext",
});

const useAccordion = AccordionPrimitive.useRootContext;
const useAccordionItem = AccordionPrimitive.useItemContext;

/* -------------------------------------------------------------------------------------------------
 * Accordion.Root
 * -----------------------------------------------------------------------------------------------*/
const Root = forwardRef<View, AccordionRootProps>((props, ref) => {
  const {
    children,
    variant = "default",
    hideSeparator = false,
    className,
    classNames,
    styles,
    style,
    animation,
    ...restProps
  } = props;

  const { container, separator } = accordionClassNames.root({ variant });

  const containerClassName = container({
    className: [className, classNames?.container],
  });

  const separatorClassName = separator({ className: classNames?.separator });

  const { layoutTransition, isAllAnimationsDisabled } = useAccordionRootAnimation({
    animation,
  });

  const contextValue: AccordionContextValue = useMemo(
    () => ({
      variant,
    }),
    [variant],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const animationContextValue = useMemo(
    () => ({
      layoutTransition,
    }),
    [layoutTransition],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <AccordionAnimationProvider value={animationContextValue}>
        <AccordionInnerProvider value={contextValue}>
          <AnimatedRootView
            ref={ref}
            className={containerClassName}
            style={[accordionStyleSheet.root, style, styles?.container]}
            layout={layoutTransition}
            {...restProps}
          >
            {Children.map(children, (child, index) => (
              <>
                {child}
                {!hideSeparator && index < Children.count(children) - 1 && (
                  <Animated.View
                    className={separatorClassName}
                    style={styles?.separator}
                    layout={layoutTransition}
                  />
                )}
              </>
            ))}
          </AnimatedRootView>
        </AccordionInnerProvider>
      </AccordionAnimationProvider>
    </AnimationSettingsProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Accordion.Item
 * -----------------------------------------------------------------------------------------------*/
const Item = forwardRef<View, AccordionItemProps>((props, ref) => {
  const {
    children,
    value,
    layout: layoutProp,
    className,
    isDisabled: isDisabledProp,
    ...restProps
  } = props;

  const itemClassName = accordionClassNames.item({ className });

  const { layoutTransition } = useAccordionAnimation();
  const { value: rootValue } = useAccordion();

  const itemValue = value as string;

  const isExpanded = Array.isArray(rootValue)
    ? rootValue.includes(itemValue)
    : rootValue === itemValue;

  const renderProps: AccordionItemRenderProps = useMemo(
    () => ({
      isExpanded,
      value: itemValue,
    }),
    [isExpanded, itemValue],
  );

  const content = typeof children === "function" ? children(renderProps) : children;

  return (
    <AnimatedItemView
      ref={ref}
      layout={layoutProp || layoutTransition}
      value={value}
      className={itemClassName}
      isDisabled={isDisabledProp}
      {...restProps}
    >
      {content}
    </AnimatedItemView>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Accordion.Trigger
 * -----------------------------------------------------------------------------------------------*/
const Trigger = forwardRef<View, AccordionTriggerProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const { variant } = useAccordionInnerContext();

  const triggerClassName = accordionClassNames.trigger({
    variant,
    className,
  });

  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger ref={ref} className={triggerClassName} {...restProps}>
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Accordion.Indicator
 * -----------------------------------------------------------------------------------------------*/
const Indicator = forwardRef<ViewRef, AccordionIndicatorProps>((props, ref) => {
  const {
    children,
    className,
    iconProps,
    animation,
    isAnimatedStyleActive = true,
    style,
    ...restProps
  } = props;

  const { isExpanded } = useAccordionItem();

  const themeColorForeground = useThemeColor("foreground");

  const indicatorClassName = accordionClassNames.indicator({ className });

  const { rContainerStyle } = useAccordionIndicatorAnimation({
    animation,
    isExpanded,
  });

  const indicatorStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

  if (children) {
    return (
      <AnimatedIndicator ref={ref} className={indicatorClassName} style={style} {...restProps}>
        {children}
      </AnimatedIndicator>
    );
  }

  return (
    <AnimatedIndicator
      ref={ref}
      className={indicatorClassName}
      style={indicatorStyle}
      {...restProps}
    >
      <ChevronDownIcon
        size={iconProps?.size ?? DEFAULT_ICON_SIZE}
        color={iconProps?.color ?? themeColorForeground}
      />
    </AnimatedIndicator>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Accordion.Content
 * -----------------------------------------------------------------------------------------------*/
const Content = forwardRef<View, AccordionContentProps>((props, ref) => {
  const { children, className, animation, ...restProps } = props;

  const { variant } = useAccordionInnerContext();

  const { isExpanded } = useAccordionItem();

  const contentClassName = accordionClassNames.content({ variant, className });

  const { entering: animatedEntering, exiting: animatedExiting } = useAccordionContentAnimation({
    animation,
  });

  if (!isExpanded) {
    return null;
  }

  return (
    <Animated.View entering={animatedEntering} exiting={animatedExiting}>
      <AccordionPrimitive.Content ref={ref} className={contentClassName} {...restProps}>
        {children}
      </AccordionPrimitive.Content>
    </Animated.View>
  );
});

Root.displayName = DISPLAY_NAME.ROOT;
Item.displayName = DISPLAY_NAME.ITEM;
Trigger.displayName = DISPLAY_NAME.TRIGGER;
Indicator.displayName = DISPLAY_NAME.INDICATOR;
Content.displayName = DISPLAY_NAME.CONTENT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Accordion - Main container managing accordion state and behavior.
 * @component Accordion.Item - Container for individual accordion items.
 * @component Accordion.Trigger - Interactive element that toggles item expansion.
 * @component Accordion.Indicator - Optional visual indicator (defaults to chevron).
 * @component Accordion.Content - Container for expandable content with animations.
 *
 * @see https://pitsiui.com/docs/native/components/accordion
 * -----------------------------------------------------------------------------------------------*/
const Accordion = Object.assign(Root, {
  /** @required Container for individual accordion items */
  Item,
  /** @required Interactive trigger element */
  Trigger,
  /** @optional Visual indicator showing expansion state (defaults to chevron) */
  Indicator,
  /** @required Container for expandable content with animations */
  Content,
});

export default Accordion;
export { Accordion, useAccordion, useAccordionItem };
