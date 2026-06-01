import React, { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import {
  type LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
  type ViewProps,
} from "react-native";
import Animated, {
  type AnimatedProps,
  Easing,
  type EasingFunction,
  type EntryOrExitLayoutType,
  type SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";

import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type { Animation, AnimationRoot } from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";

import LinearGradientComponent from "./linear-gradient";
import {
  SkeletonAnimationProvider,
  useSkeletonAnimation,
  useSkeletonPulseAnimation,
  useSkeletonRootAnimation,
  useSkeletonShimmerAnimation,
} from "./skeleton.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display name constants for the Skeleton component
 */
export const DISPLAY_NAME = {
  SKELETON: "PitsiUINative.Skeleton",
  LINEAR_GRADIENT: "PitsiUINative.Skeleton.LinearGradient",
};

/**
 * Default shimmer animation duration in milliseconds
 */
export const DEFAULT_SHIMMER_DURATION = 1500;

/**
 * Default pulse animation duration in milliseconds
 */
export const DEFAULT_PULSE_DURATION = 1000;

/**
 * Default easing function for animations
 */
export const DEFAULT_EASING = Easing.linear;

/**
 * Default minimum opacity for pulse animation
 */
export const DEFAULT_PULSE_MIN_OPACITY = 0.5;

/**
 * Default maximum opacity for pulse animation
 */
export const DEFAULT_PULSE_MAX_OPACITY = 1;

/**
 * Default animation speed multiplier
 */
export const DEFAULT_SPEED = 1;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Skeleton animation type - defines the animation style
 */
export type SkeletonAnimation = "shimmer" | "pulse" | "none";

/**
 * Shimmer animation configuration for Skeleton root component
 */
export type SkeletonShimmerAnimation = Animation<{
  /**
   * Animation duration in milliseconds
   * @default 1500
   */
  duration?: number;
  /**
   * Speed multiplier for the animation
   * @default 1
   */
  speed?: number;
  /**
   * Highlight color for the shimmer effect
   */
  highlightColor?: string;
  /**
   * Easing function for the animation
   */
  easing?: EasingFunction;
}>;

/**
 * Pulse animation configuration for Skeleton root component
 */
export type SkeletonPulseAnimation = Animation<{
  /**
   * Animation duration in milliseconds
   * @default 1000
   */
  duration?: number;
  /**
   * Minimum opacity value
   * @default 0.5
   */
  minOpacity?: number;
  /**
   * Maximum opacity value
   * @default 1
   */
  maxOpacity?: number;
  /**
   * Easing function for the animation
   */
  easing?: EasingFunction;
}>;

/**
 * Animation configuration for Skeleton root component
 */
export type SkeletonRootAnimation = AnimationRoot<{
  entering?: Animation<{
    /**
     * Custom entering animation for skeleton
     */
    value?: EntryOrExitLayoutType;
  }>;
  /**
   * Exiting animation for the skeleton
   */
  exiting?: Animation<{
    /**
     * Custom exiting animation for skeleton
     */
    value?: EntryOrExitLayoutType;
  }>;
  /**
   * Shimmer animation configuration
   */
  shimmer?: SkeletonShimmerAnimation;
  /**
   * Pulse animation configuration
   */
  pulse?: SkeletonPulseAnimation;
  /**
   * Entering animation for the skeleton
   */
}>;

/**
 * Props for the main Skeleton component
 */
export interface SkeletonProps extends AnimatedProps<ViewProps> {
  /**
   * Child components to show when not loading
   */
  children?: React.ReactNode;

  /**
   * Whether the skeleton is currently loading
   * @default true
   */
  isLoading?: boolean;

  /**
   * Animation variant
   * @default 'shimmer'
   */
  variant?: SkeletonAnimation;

  /**
   * Animation configuration
   */
  animation?: SkeletonRootAnimation;

  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;

  /**
   * Additional CSS classes for styling
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `opacity` - Animated for pulse variant transitions (min: 0.5, max: 1)
   *
   * The shimmer variant uses an internal overlay with `transform` (translateX) animation, which doesn't affect the className prop.
   *
   * To customize these properties, use the `animation` prop:
   * ```tsx
   * <Skeleton
   *   variant="pulse"
   *   animation={{
   *     pulse: { minOpacity: 0.5, maxOpacity: 1, duration: 1000, easing: Easing.inOut(Easing.ease) }
   *   }}
   * />
   * ```
   *
   * For shimmer variant:
   * ```tsx
   * <Skeleton
   *   variant="shimmer"
   *   animation={{
   *     shimmer: { duration: 1500, speed: 1, highlightColor: '#ffffff', easing: Easing.linear }
   *   }}
   * />
   * ```
   *
   * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
   */
  className?: string;
}

/**
 * Context value for skeleton animation provider
 */
export interface SkeletonAnimationContextValue {
  /**
   * Whether the skeleton is currently loading
   */
  isLoading: boolean;
  /**
   * Animation variant
   */
  variant: SkeletonAnimation;
  /**
   * Shared animation progress value
   */
  progress: SharedValue<number>;
  /**
   * Component width for shimmer calculation
   */
  componentWidth: number;
  /**
   * Component offset for shimmer calculation
   */
  offset: number;
  /**
   * Screen width for animation calculation
   */
  screenWidth: number;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property is animated and cannot be overridden using Tailwind classes:
 * - `opacity` - Animated for pulse variant transitions (min: 0.5, max: 1)
 *
 * Note: The shimmer variant uses an internal overlay with `transform` (translateX) animation, which doesn't affect the className prop.
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "bg-muted/30 overflow-hidden",
});

export const skeletonClassNames = combineStyles({
  root,
});

export const skeletonStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Skeleton
 * -----------------------------------------------------------------------------------------------*/

const ShimmerAnimation: React.FC<{
  animation: SkeletonProps["animation"];
  isAnimatedStyleActive?: boolean;
}> = ({ animation, isAnimatedStyleActive = true }) => {
  const { rContainerStyle, gradientColors } = useSkeletonShimmerAnimation({
    animation,
  });

  const shimmerStyle = isAnimatedStyleActive
    ? [StyleSheet.absoluteFill, skeletonStyleSheet.borderCurve, rContainerStyle]
    : [StyleSheet.absoluteFill, skeletonStyleSheet.borderCurve];

  return (
    <Animated.View style={shimmerStyle}>
      <LinearGradientComponent colors={gradientColors} />
    </Animated.View>
  );
};

// --------------------------------------------------

const PulseAnimation: React.FC<
  PropsWithChildren<{
    animation: SkeletonProps["animation"];
    isAnimatedStyleActive?: boolean;
  }>
> = ({ children, animation, isAnimatedStyleActive = true }) => {
  const { variant } = useSkeletonAnimation();

  const { rContainerStyle } = useSkeletonPulseAnimation({
    animation,
  });

  if (variant === "pulse") {
    const pulseStyle = isAnimatedStyleActive ? rContainerStyle : undefined;
    return <Animated.View style={pulseStyle}>{children}</Animated.View>;
  }

  return children;
};

// --------------------------------------------------

const Skeleton: React.FC<SkeletonProps> = (props) => {
  const {
    children,
    isLoading = true,
    variant = "shimmer",
    animation,
    isAnimatedStyleActive = true,
    className,
    style,
    ...restProps
  } = props;

  const [componentWidth, setComponentWidth] = useState(0);
  const [offset, setOffset] = useState(0);

  const progress = useSharedValue(0);

  const { width: screenWidth } = useWindowDimensions();

  const { isAllAnimationsDisabled, entering, exiting } = useSkeletonRootAnimation({
    animation,
    isLoading,
    variant,
    progress,
  });

  const rootClassName = skeletonClassNames.root({ className });

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (componentWidth === 0) {
        const { width, x } = event.nativeEvent.layout;
        setComponentWidth(width);
        setOffset(x);
      }
    },
    [componentWidth],
  );

  const animationContextValue = useMemo(
    () => ({
      isLoading,
      variant,
      progress,
      componentWidth,
      offset,
      screenWidth,
    }),
    [isLoading, variant, progress, componentWidth, offset, screenWidth],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  if (!isLoading) {
    return (
      <Animated.View key="content" entering={entering} exiting={exiting}>
        {children}
      </Animated.View>
    );
  }

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <SkeletonAnimationProvider value={animationContextValue}>
        <PulseAnimation animation={animation} isAnimatedStyleActive={isAnimatedStyleActive}>
          <Animated.View
            key="skeleton"
            entering={entering}
            exiting={exiting}
            onLayout={handleLayout}
            style={[skeletonStyleSheet.borderCurve, style]}
            className={rootClassName}
            {...restProps}
          >
            {variant === "shimmer" && componentWidth > 0 && (
              <ShimmerAnimation
                animation={animation}
                isAnimatedStyleActive={isAnimatedStyleActive}
              />
            )}
          </Animated.View>
        </PulseAnimation>
      </SkeletonAnimationProvider>
    </AnimationSettingsProvider>
  );
};

// --------------------------------------------------

Skeleton.displayName = DISPLAY_NAME.SKELETON;

/**
 * Skeleton component for displaying loading placeholders
 *
 * @component Skeleton - Animated loading placeholder that can display shimmer or pulse effects.
 * Shows skeleton state when isLoading is true, otherwise displays children content.
 * Supports customizable animations through the animation prop with shimmer and pulse configurations.
 * Shape and size are controlled via className for maximum flexibility.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/skeleton
 */
export { Skeleton };
export default Skeleton;
