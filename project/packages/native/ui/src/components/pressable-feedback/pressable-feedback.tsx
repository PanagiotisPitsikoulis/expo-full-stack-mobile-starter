/**
 * Display names for PressableFeedback components
 */

import { forwardRef, useCallback, useMemo, useRef } from "react";
import type { PressableProps, ViewProps, ViewStyle } from "react-native";
/* eslint-disable prettier/prettier */
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import type { AnimatedProps, SharedValue, WithTimingConfig } from "react-native-reanimated";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { useUniwind } from "uniwind";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type {
  Animation,
  AnimationRoot,
  AnimationValue,
  ElementSlots,
  PressableRef,
  ViewRef,
} from "../../helpers/internal/types";
import {
  combineStyles,
  createContext,
  getAnimationState,
  getAnimationValueMergedConfig,
  getAnimationValueProperty,
  getIsAnimationDisabledValue,
  getRootAnimationState,
} from "../../helpers/internal/utils";
import * as Slot from "../../primitives/slot";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.PressableFeedback.Root",
  SCALE: "PitsiUINative.PressableFeedback.Scale",
  HIGHLIGHT: "PitsiUINative.PressableFeedback.Highlight",
  RIPPLE: "PitsiUINative.PressableFeedback.Ripple",
} as const;

export const BASE_RIPPLE_PROGRESS_DURATION = 1000;
export const BASE_RIPPLE_PROGRESS_DURATION_MIN = 750;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Scale animation configuration shared by the root's built-in scale and the PressableFeedback.Scale compound part.
 *
 * Supports the standard Animation control flow:
 * - `true` or `undefined`: Use default scale animation
 * - `false` or `"disabled"`: Disable scale animation
 * - `object`: Custom scale configuration (value, timingConfig, ignoreScaleCoefficient)
 */
export type PressableFeedbackScaleAnimation = Animation<{
  /**
   * Scale value when pressed
   * @default 0.985
   *
   * Note: The actual scale is automatically adjusted based on the container's width
   * using a scale coefficient. This ensures the scale effect feels consistent across different
   * container sizes:
   * - Base width: 300px
   * - If container width > 300px: scale adjustment decreases (less noticeable scale down)
   * - If container width < 300px: scale adjustment increases (more noticeable scale down)
   * - Example: 600px width → 0.5x coefficient → adjustedScale = 1 - (1 - 0.98) * 0.5 = 0.99
   * - Example: 150px width → 2x coefficient → adjustedScale = 1 - (1 - 0.98) * 2 = 0.96
   *
   * This automatic scaling creates the same visual feel on different sized containers
   * by adjusting the scale effect relative to the container size.
   */
  value?: number;
  /**
   * Animation timing configuration
   * @default { duration: 300, easing: Easing.out(Easing.ease) }
   */
  timingConfig?: WithTimingConfig;
  /**
   * Ignore the scale coefficient and use the scale value directly
   *
   * When set to true, the scale coefficient will return 1, meaning the actual scale
   * will always equal the value regardless of the container's width.
   *
   * @default false
   */
  ignoreScaleCoefficient?: boolean;
}>;

/**
 * Animation configuration for PressableFeedback highlight overlay
 */
export type PressableFeedbackHighlightAnimation = Animation<{
  /**
   * Opacity animation for the highlight overlay
   */
  opacity?: AnimationValue<{
    /**
     * Opacity values [unpressed, pressed]
     * @default [0, 0.1]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 200 }
     */
    timingConfig?: WithTimingConfig;
  }>;
  /**
   * Background color of the highlight overlay
   */
  backgroundColor?: AnimationValue<{
    /**
     * Background color value
     * @default Computed based on theme (brighten for dark, darken for light)
     */
    value?: string;
  }>;
}>;

/**
 * Animation configuration for PressableFeedback ripple effect
 */
export type PressableFeedbackRippleAnimation = Animation<{
  /**
   * Background color of the ripple effect
   */
  backgroundColor?: AnimationValue<{
    /**
     * Background color value
     * @default Computed based on theme (brighten for dark, darken for light)
     */
    value?: string;
  }>;
  /**
   * Progress animation configuration for the ripple effect
   *
   * This controls how the ripple progresses over time from the center to the edges.
   * The progress is represented as a shared value that animates from 0 to 2:
   * - 0 to 1: Initial expansion phase (press begins)
   * - 1 to 2: Final expansion and fade out phase (press ends)
   */
  progress?: AnimationValue<{
    /**
     * Base duration for the ripple progress animation in milliseconds
     *
     * This value controls how fast the ripple progresses across the container.
     * Lower values mean faster ripple expansion, higher values mean slower expansion.
     *
     * @default 750
     *
     * Note: The actual duration is automatically adjusted based on the container's diagonal size
     * using a durationCoefficient. This ensures the ripple feels consistent across different
     * container sizes:
     * - Base diagonal: 450px
     * - If container diagonal > 450px: duration increases proportionally (max 2x baseDuration)
     * - If container diagonal < 450px: duration decreases proportionally
     * - Example: 900px diagonal → 2x coefficient → duration = baseDuration * 2 (capped at 2x)
     * - Example: 225px diagonal → 0.5x coefficient → duration = baseDuration * 0.5
     *
     * This automatic scaling creates the same visual feel on different sized containers
     * by making the ripple travel at a consistent speed relative to the container size.
     */
    baseDuration?: number;
    /**
     * Minimum base duration for the ripple progress animation in milliseconds
     *
     * This sets a lower bound for the calculated duration after applying the duration coefficient.
     * Useful for preventing the ripple animation from being too fast on small containers.
     *
     * @default undefined (no minimum)
     */
    minBaseDuration?: number;
    /**
     * Ignore the duration coefficient and use the base duration directly
     *
     * When set to true, the durationCoefficient will return 1, meaning the actual duration
     * will always equal baseDuration regardless of the container's diagonal size.
     *
     * @default false
     */
    ignoreDurationCoefficient?: boolean;
  }>;
  /**
   * Opacity animation for the ripple effect
   */
  opacity?: AnimationValue<{
    /**
     * Opacity values [start, peak, end] for ripple animation
     * @default [0, 0.1, 0]
     */
    value?: [number, number, number];
    /**
     * Animation timing configuration
     * Note: Timing configs are applied to interpolated values. It's not recommended
     * to keep duration higher than 80ms as the ripple effect will be weak.
     * @default { duration: 30 }
     */
    timingConfig?: WithTimingConfig;
  }>;
  /**
   * Scale animation for the ripple effect
   */
  scale?: AnimationValue<{
    /**
     * Scale values [start, peak, end] for ripple animation
     * @default [0, 1, 1]
     */
    value?: [number, number, number];
    /**
     * Animation timing configuration
     * Note: Timing configs are applied to interpolated values. It's not recommended
     * to keep duration higher than 80ms as the ripple effect will be weak.
     * @default { duration: 30 }
     */
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Animation configuration for PressableFeedback root component.
 *
 * Supports the standard AnimationRoot control flow:
 * - `true` or `undefined`: Use the default built-in scale animation
 * - `false` or `"disabled"`: Disable the root's built-in scale (use this when applying scale
 *   via PressableFeedback.Scale instead)
 * - `"disable-all"`: Cascade-disable all animations including the built-in scale and children
 *   (Scale, Highlight, Ripple)
 * - `object`: Custom configuration for the built-in scale
 *   - `scale`: Customize the built-in scale animation (value, timingConfig, etc.)
 *   - `state`: Control animation state while keeping configuration (e.g. for runtime toggling)
 */
export type PressableFeedbackRootAnimation = AnimationRoot<{
  /**
   * Customize the built-in scale animation on the root component.
   * Accepts the same `PressableFeedbackScaleAnimation` configuration as the Scale compound part.
   */
  scale?: PressableFeedbackScaleAnimation;
}>;

/**
 * Props for PressableFeedback root component
 */
export interface PressableFeedbackProps extends Omit<AnimatedProps<PressableProps>, "disabled"> {
  /**
   * Whether the pressable component is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Children elements
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Animation configuration for the root component.
   *
   * - Leave `undefined` or `true` for the default built-in scale animation.
   * - Provide an object with `scale` to customize the built-in scale:
   *   ```tsx
   *   <PressableFeedback animation={{ scale: { value: 0.97 } }}>
   *     {content}
   *   </PressableFeedback>
   *   ```
   * - Set to `false` or `"disabled"` to disable the built-in scale (use when applying
   *   scale via `PressableFeedback.Scale` on a specific child instead).
   * - Set to `'disable-all'` to cascade-disable all animations including children.
   */
  animation?: PressableFeedbackRootAnimation;
  /**
   * Whether the root's built-in animated styles (react-native-reanimated) are active.
   * When `false`, the animated scale style is not applied and you can implement custom logic.
   * @default true
   */
  isAnimatedStyleActive?: boolean;
  /**
   * When `true`, merges press behavior and animated scale onto the single child (Slot pattern).
   * The child must be one React element. Uses `Animated.createAnimatedComponent(Slot.Pressable)` internally.
   * @default false
   */
  asChild?: boolean;
}

/**
 * Props for PressableFeedback.Scale compound part
 */
export interface PressableFeedbackScaleProps extends AnimatedProps<ViewProps> {
  /**
   * Additional CSS classes
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `transform` (specifically `scale`) - Animated for press feedback transitions
   *   (unpressed: 1, pressed: adjusted scale based on container width, default: 0.985)
   *
   * To customize this property, use the `animation` prop:
   * ```tsx
   * <PressableFeedback.Scale
   *   animation={{ value: 0.985, timingConfig: { duration: 300, easing: Easing.out(Easing.ease) } }}
   * />
   * ```
   *
   * To completely disable animated styles and use your own via className or style prop,
   * set `isAnimatedStyleActive={false}`.
   */
  className?: string;
  /**
   * Animation configuration for the scale effect
   */
  animation?: PressableFeedbackScaleAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Props for PressableFeedback highlight component
 */
export interface PressableFeedbackHighlightProps extends AnimatedProps<ViewProps> {
  /**
   * Additional CSS classes
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `backgroundColor` - Animated for highlight background color transitions (default: theme-aware gray)
   * - `opacity` - Animated for highlight visibility transitions (unpressed: 0, pressed: 0.1, default duration: 200ms)
   *
   * To customize these properties, use the `animation` prop:
   * ```tsx
   * <PressableFeedback.Highlight
   *   animation={{
   *     backgroundColor: { value: '#3f3f46' },
   *     opacity: { value: [0, 0.2], timingConfig: { duration: 300 } }
   *   }}
   * />
   * ```
   *
   * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
   */
  className?: string;
  /**
   * Animation configuration for the highlight overlay
   */
  animation?: PressableFeedbackHighlightAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Props for PressableFeedback ripple component
 */
export interface PressableFeedbackRippleProps extends ViewProps {
  /**
   * Additional CSS classes for the container slot
   *
   * Applied to the container slot (`absolute inset-0`). The container handles touch events and positioning.
   * Container styles can be fully customized via className or the `classNames.container` prop.
   */
  className?: string;
  /**
   * Additional CSS classes for the slots
   *
   * - `container`: Outer container slot (`absolute inset-0`) - styles can be fully customized
   * - `ripple`: Inner ripple slot (`absolute top-0 left-0 rounded-full`) - has animated properties that cannot be set via className
   *
   * @note The following style properties on the `ripple` slot are occupied by animations and cannot be set via className:
   * - `width`, `height`, `borderRadius` - Animated for ripple circle size calculations (based on container diagonal)
   * - `opacity` - Animated for ripple visibility transitions (unpressed: 0, expanding: 0.1, fading: 0)
   * - `transform` (specifically `translateX`, `translateY`, `scale`) - Animated for ripple position and expansion from touch point
   *
   * To customize these properties, use the `animation` prop:
   * ```tsx
   * <PressableFeedback.Ripple
   *   animation={{
   *     opacity: { value: [0, 0.1, 0], timingConfig: { duration: 400 } },
   *     scale: { value: [0, 1, 1] },
   *     backgroundColor: { value: '#3f3f46' }
   *   }}
   * />
   * ```
   *
   * Touch handlers (`onTouchStart`, `onTouchEnd`, `onTouchCancel`) can be customized via props and will be called alongside animation handlers.
   *
   * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
   */
  classNames?: ElementSlots<RippleSlots>;
  /**
   * Styles for different parts of the ripple overlay
   */
  styles?: Partial<Record<RippleSlots, ViewStyle>>;
  /**
   * Animation configuration for the ripple overlay
   */
  animation?: PressableFeedbackRippleAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Context value for PressableFeedback root animation state
 */
export interface PressableFeedbackRootAnimationContextValue {
  /** Shared value tracking if component is pressed (for scale animation) */
  isPressed: SharedValue<boolean>;
  /** Shared value tracking the container width (for scale coefficient calculation) */
  containerWidth: SharedValue<number>;
  /** Shared value tracking the container height (for scale coefficient calculation) */
  containerHeight: SharedValue<number>;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "overflow-hidden",
});

/**
 * PressableFeedback highlight style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following properties are animated and cannot be overridden using Tailwind classes:
 * - `backgroundColor` - Animated for highlight background color transitions (default: theme-aware gray)
 * - `opacity` - Animated for highlight visibility transitions (unpressed: 0, pressed: 0.1, default duration: 200ms)
 *
 * To customize these properties, use the `animation` prop on `PressableFeedback.Highlight`:
 * ```tsx
 * <PressableFeedback.Highlight
 *   animation={{
 *     backgroundColor: { value: '#3f3f46' },
 *     opacity: { value: [0, 0.2], timingConfig: { duration: 300 } }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `PressableFeedback.Highlight`.
 */
const highlight = tv({
  base: "absolute inset-0",
});

/**
 * PressableFeedback ripple style definition
 *
 * Contains two slots:
 * - `container`: Outer container (`absolute inset-0`) that handles touch events and positioning - styles can be fully customized
 * - `ripple`: Inner ripple element (`absolute top-0 left-0 rounded-full`) that contains animated styles
 *
 * @note ANIMATED PROPERTIES (cannot be set via className on the `ripple` slot only):
 * The following properties on the `ripple` slot are animated and cannot be overridden using Tailwind classes:
 * - `width`, `height`, `borderRadius` - Animated for ripple circle size calculations (based on container diagonal)
 * - `opacity` - Animated for ripple visibility transitions (unpressed: 0, expanding: 0.1, fading: 0)
 * - `transform` (specifically `translateX`, `translateY`, `scale`) - Animated for ripple position and expansion from touch point
 *
 * The `container` slot styles can be fully customized via className or `classNames.container`.
 *
 * To customize the animated properties on the `ripple` slot, use the `animation` prop on `PressableFeedback.Ripple`:
 * ```tsx
 * <PressableFeedback.Ripple
 *   animation={{
 *     opacity: { value: [0, 0.1, 0], timingConfig: { duration: 400 } },
 *     scale: { value: [0, 1, 1] },
 *     backgroundColor: { value: '#3f3f46' }
 *   }}
 * />
 * ```
 *
 * Touch handlers (`onTouchStart`, `onTouchEnd`, `onTouchCancel`) can be customized via props and will be called alongside animation handlers.
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `PressableFeedback.Ripple`.
 */
const ripple = tv({
  slots: {
    container: "absolute inset-0",
    ripple: "absolute top-0 left-0 rounded-full",
  },
});

export const pressableFeedbackClassNames = combineStyles({
  root,
  highlight,
  ripple,
});

export const pressableFeedbackStyleSheet = StyleSheet.create({
  root: {
    borderCurve: "continuous",
  },
});

export type RippleSlots = keyof ReturnType<typeof ripple>;

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/
const [PressableFeedbackRootAnimationProvider, usePressableFeedbackRootAnimationContext] =
  createContext<PressableFeedbackRootAnimationContextValue>({
    name: "PressableFeedbackRootAnimationContext",
  });

export { PressableFeedbackRootAnimationProvider, usePressableFeedbackRootAnimationContext };

// --------------------------------------------------

/**
 * Shared hook that produces an animated scale style from press state and container width.
 * Reused by both the root's built-in scale and the PressableFeedback.Scale compound part.
 *
 * @param options.isPressed        - Shared value tracking whether the component is pressed
 * @param options.containerWidth   - Shared value tracking the container width (for scale coefficient)
 * @param options.animation        - Scale animation configuration (value, timingConfig, ignoreScaleCoefficient)
 * @param options.isAnimationDisabledValue - Final resolved boolean: true when scale should be disabled
 */
function useScaleAnimatedStyle(options: {
  isPressed: SharedValue<boolean>;
  containerWidth: SharedValue<number>;
  animation?: PressableFeedbackScaleAnimation;
  isAnimationDisabledValue: boolean;
}) {
  const { isPressed, containerWidth, animation, isAnimationDisabledValue } = options;

  const { animationConfig } = getAnimationState(animation);

  const scaleValue = getAnimationValueProperty({
    animationValue: animationConfig,
    property: "value",
    defaultValue: 0.985,
  });

  const scaleTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: "timingConfig",
    defaultValue: { duration: 300, easing: Easing.out(Easing.ease) },
  });

  const ignoreScaleCoefficient = getAnimationValueProperty({
    animationValue: animationConfig,
    property: "ignoreScaleCoefficient",
    defaultValue: false,
  });

  const adjustedScaleValue = useDerivedValue(() => {
    const coefficient = ignoreScaleCoefficient
      ? 1
      : containerWidth.get() > 0
        ? 300 / containerWidth.get()
        : 1;
    return 1 - (1 - scaleValue) * coefficient;
  });

  const rScaleStyle = useAnimatedStyle(() => {
    if (isAnimationDisabledValue) {
      return {
        transform: [{ scale: 1 }],
      };
    }

    return {
      transform: [
        {
          scale: withTiming(isPressed.get() ? adjustedScaleValue.get() : 1, scaleTimingConfig),
        },
      ],
    };
  });

  return { rScaleStyle };
}

// --------------------------------------------------

/**
 * Animation hook for PressableFeedback root component.
 * Manages press state and container dimensions for child compound parts.
 * Produces the built-in scale animated style by default.
 * Use `animation.scale` to customize, or `animation={false}` to disable.
 */
export function usePressableFeedbackRootAnimation(options: {
  animation?: PressableFeedbackRootAnimation;
}) {
  const { animation } = options;

  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);

  const isPressed = useSharedValue(false);
  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(0);

  const animationOnPressIn = useCallback(() => {
    isPressed.set(true);
  }, [isPressed]);

  const animationOnPressOut = useCallback(() => {
    isPressed.set(false);
  }, [isPressed]);

  // Extract root-level config to check for built-in scale
  const { animationConfig: rootConfig, isAnimationDisabled: isRootDisabled } =
    getRootAnimationState(animation);

  const scaleAnimation = rootConfig?.scale;
  const hasRootScale = scaleAnimation !== undefined;

  // Resolve scale-specific disabled state (root disabled OR scale's own disabled OR cascade)
  const { isAnimationDisabled: isScaleOwnDisabled } = getAnimationState(scaleAnimation);

  const isScaleDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled: isRootDisabled || isScaleOwnDisabled,
    isAllAnimationsDisabled,
  });

  const { rScaleStyle } = useScaleAnimatedStyle({
    isPressed,
    containerWidth,
    animation: scaleAnimation,
    isAnimationDisabledValue: isScaleDisabledValue,
  });

  return {
    isAllAnimationsDisabled,
    animationOnPressIn,
    animationOnPressOut,
    isPressed,
    containerWidth,
    containerHeight,
    hasRootScale,
    rScaleStyle,
  };
}

// --------------------------------------------------

/**
 * Animation hook for PressableFeedback.Scale compound part.
 * Used when applying scale to a specific child element instead of the root.
 * Reads the root's press state via context and delegates to the shared `useScaleAnimatedStyle` hook.
 */
export function usePressableFeedbackScaleAnimation(options: {
  animation?: PressableFeedbackScaleAnimation;
}) {
  const { animation } = options;

  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { isPressed, containerWidth } = usePressableFeedbackRootAnimationContext();

  const { isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  const { rScaleStyle } = useScaleAnimatedStyle({
    isPressed,
    containerWidth,
    animation,
    isAnimationDisabledValue,
  });

  return {
    rContainerStyle: rScaleStyle,
  };
}

// --------------------------------------------------

/**
 * Animation hook for PressableFeedback highlight overlay
 * Handles opacity and background color animations for the highlight effect
 */
export function usePressableFeedbackHighlightAnimation(options: {
  animation?: PressableFeedbackHighlightAnimation;
}) {
  const { animation } = options;

  const { theme } = useUniwind();

  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { isPressed } = usePressableFeedbackRootAnimationContext();

  const { animationConfig, isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  // Background color
  const defaultColor = theme === "dark" ? "#d4d4d8" : "#3f3f46";

  const backgroundColor = getAnimationValueProperty({
    animationValue: animationConfig?.backgroundColor,
    property: "value",
    defaultValue: defaultColor,
  });

  // Opacity animation
  const opacityValue = getAnimationValueProperty({
    animationValue: animationConfig?.opacity,
    property: "value",
    defaultValue: [0, 0.1] as [number, number],
  });

  const opacityTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.opacity,
    property: "timingConfig",
    defaultValue: { duration: 200 },
  });

  const rContainerStyle = useAnimatedStyle(() => {
    if (isAnimationDisabledValue) {
      return {};
    }

    return {
      backgroundColor,
      opacity: withTiming(isPressed.get() ? opacityValue[1] : opacityValue[0], opacityTimingConfig),
    };
  });

  return {
    rContainerStyle,
  };
}

// --------------------------------------------------

/**
 * Worklet that computes the animated style for a single ripple layer.
 * Shared by both layers to avoid duplicating the interpolation logic.
 */
function computeRippleLayerStyle(
  containerW: number,
  containerH: number,
  centerX: number,
  centerY: number,
  progress: number,
  opacityValues: readonly [number, number, number],
  scaleValues: readonly [number, number, number],
) {
  "worklet";
  const circleRadius = Math.sqrt(containerW ** 2 + containerH ** 2) * 1.25;

  const translateX = centerX - circleRadius;
  const translateY = centerY - circleRadius;

  return {
    width: circleRadius * 2,
    height: circleRadius * 2,
    borderRadius: circleRadius,
    opacity: interpolate(
      progress,
      [0, 1, 2],
      [opacityValues[0], opacityValues[1], opacityValues[2]],
    ),
    transform: [
      { translateX },
      { translateY },
      {
        scale: interpolate(progress, [0, 1, 2], [scaleValues[0], scaleValues[1], scaleValues[2]]),
      },
    ],
  };
}

/**
 * Animation hook for PressableFeedback ripple effect.
 * Uses a two-layer alternating buffer so a new press can start on a fresh layer
 * while the previous ripple continues its fade-out, preventing visual blinks on rapid presses.
 */
export function usePressableFeedbackRippleAnimation(options: {
  animation?: PressableFeedbackRippleAnimation;
}) {
  const { animation } = options;

  const { theme } = useUniwind();

  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { containerWidth, containerHeight } = usePressableFeedbackRootAnimationContext();

  const layer0CenterX = useSharedValue(0);
  const layer0CenterY = useSharedValue(0);
  const layer0Progress = useSharedValue(0);

  const layer1CenterX = useSharedValue(0);
  const layer1CenterY = useSharedValue(0);
  const layer1Progress = useSharedValue(0);

  const activeLayerRef = useRef(0);

  const { animationConfig, isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  const rippleProgressBaseDuration = getAnimationValueProperty({
    animationValue: animationConfig?.progress,
    property: "baseDuration",
    defaultValue: BASE_RIPPLE_PROGRESS_DURATION,
  });

  const ignoreDurationCoefficient = getAnimationValueProperty({
    animationValue: animationConfig?.progress,
    property: "ignoreDurationCoefficient",
    defaultValue: false,
  });

  const rippleProgressMinBaseDuration = getAnimationValueProperty({
    animationValue: animationConfig?.progress,
    property: "minBaseDuration",
    defaultValue: BASE_RIPPLE_PROGRESS_DURATION_MIN,
  });

  const durationCoefficient = useDerivedValue(() => {
    if (ignoreDurationCoefficient) return 1;

    const baseDiagonal = 450;
    const currentDiagonal = Math.sqrt(containerWidth.get() ** 2 + containerHeight.get() ** 2);
    return currentDiagonal > 0 ? currentDiagonal / baseDiagonal : 1;
  });

  /** Returns the container-diagonal-adjusted ripple duration */
  const getAdjustedDuration = useCallback(() => {
    return Math.min(
      Math.max(
        rippleProgressBaseDuration * durationCoefficient.get(),
        rippleProgressMinBaseDuration,
      ),
      rippleProgressBaseDuration * 2,
    );
  }, [durationCoefficient, rippleProgressBaseDuration, rippleProgressMinBaseDuration]);

  const animationOnTouchStart = useCallback(
    (event: GestureResponderEvent) => {
      const prevLayer = activeLayerRef.current;
      const nextLayer = prevLayer === 0 ? 1 : 0;
      activeLayerRef.current = nextLayer;

      const adjustedDuration = getAdjustedDuration();

      const prevProgress = prevLayer === 0 ? layer0Progress : layer1Progress;
      const prevProgressVal = prevProgress.get();
      if (prevProgressVal > 0 && prevProgressVal < 2) {
        prevProgress.set(withTiming(2, { duration: adjustedDuration }));
      }

      const nextCenterX = nextLayer === 0 ? layer0CenterX : layer1CenterX;
      const nextCenterY = nextLayer === 0 ? layer0CenterY : layer1CenterY;
      const nextProgress = nextLayer === 0 ? layer0Progress : layer1Progress;

      nextCenterX.set(event.nativeEvent.locationX);
      nextCenterY.set(event.nativeEvent.locationY);
      nextProgress.set(0);
      nextProgress.set(withTiming(1, { duration: adjustedDuration }));
    },
    [
      getAdjustedDuration,
      layer0CenterX,
      layer0CenterY,
      layer0Progress,
      layer1CenterX,
      layer1CenterY,
      layer1Progress,
    ],
  );

  const animationOnTouchEnd = useCallback(() => {
    const adjustedDuration = getAdjustedDuration();
    const activeProgress = activeLayerRef.current === 0 ? layer0Progress : layer1Progress;
    activeProgress.set(withTiming(2, { duration: adjustedDuration }));
  }, [getAdjustedDuration, layer0Progress, layer1Progress]);

  // Background color
  const defaultColor = theme === "dark" ? "#d4d4d8" : "#3f3f46";

  const backgroundColor = getAnimationValueProperty({
    animationValue: animationConfig?.backgroundColor,
    property: "value",
    defaultValue: defaultColor,
  });

  // Opacity animation
  const opacityValue = getAnimationValueProperty({
    animationValue: animationConfig?.opacity,
    property: "value",
    defaultValue: [0, 0.1, 0] as [number, number, number],
  });

  // Scale animation
  const scaleValue = getAnimationValueProperty({
    animationValue: animationConfig?.scale,
    property: "value",
    defaultValue: [0, 1, 1] as [number, number, number],
  });

  const rLayer0Style = useAnimatedStyle(() => {
    if (isAnimationDisabledValue) {
      return {};
    }

    return computeRippleLayerStyle(
      containerWidth.get(),
      containerHeight.get(),
      layer0CenterX.get(),
      layer0CenterY.get(),
      layer0Progress.get(),
      opacityValue,
      scaleValue,
    );
  });

  const rLayer1Style = useAnimatedStyle(() => {
    if (isAnimationDisabledValue) {
      return {};
    }

    return computeRippleLayerStyle(
      containerWidth.get(),
      containerHeight.get(),
      layer1CenterX.get(),
      layer1CenterY.get(),
      layer1Progress.get(),
      opacityValue,
      scaleValue,
    );
  });

  return {
    rLayer0Style,
    rLayer1Style,
    backgroundColor,
    animationOnTouchStart,
    animationOnTouchEnd,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedSlotPressable = Animated.createAnimatedComponent(Slot.Pressable);

// --------------------------------------------------

const PressableFeedback = forwardRef<PressableRef, PressableFeedbackProps>((props, ref) => {
  const {
    isDisabled = false,
    isAnimatedStyleActive = true,
    className,
    style,
    animation,
    children,
    onLayout,
    onPressIn,
    onPressOut,
    asChild = false,
    ...restProps
  } = props;

  const RootComponent = asChild ? AnimatedSlotPressable : AnimatedPressable;

  const {
    isPressed,
    containerWidth,
    containerHeight,
    isAllAnimationsDisabled,
    animationOnPressIn,
    animationOnPressOut,
    rScaleStyle,
  } = usePressableFeedbackRootAnimation({
    animation,
  });

  const rootClassName = pressableFeedbackClassNames.root({ className });

  const rootStyle = isAnimatedStyleActive
    ? [pressableFeedbackStyleSheet.root, rScaleStyle, style]
    : [pressableFeedbackStyleSheet.root, style];

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerWidth.set(event.nativeEvent.layout.width);
      containerHeight.set(event.nativeEvent.layout.height);
      if (onLayout && typeof onLayout === "function") {
        onLayout(event);
      }
    },
    [containerWidth, containerHeight, onLayout],
  );

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      animationOnPressIn();
      if (onPressIn && typeof onPressIn === "function") {
        onPressIn(event);
      }
    },
    [animationOnPressIn, onPressIn],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      animationOnPressOut();
      if (onPressOut && typeof onPressOut === "function") {
        onPressOut(event);
      }
    },
    [animationOnPressOut, onPressOut],
  );

  const animationContextValue = useMemo(
    () => ({
      isPressed,
      containerWidth,
      containerHeight,
    }),
    [isPressed, containerWidth, containerHeight],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <PressableFeedbackRootAnimationProvider value={animationContextValue}>
        <RootComponent
          ref={ref}
          disabled={isDisabled}
          className={rootClassName}
          style={rootStyle}
          onLayout={handleLayout}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          {...restProps}
        >
          {children}
        </RootComponent>
      </PressableFeedbackRootAnimationProvider>
    </AnimationSettingsProvider>
  );
});

// --------------------------------------------------

const PressableFeedbackScale = forwardRef<ViewRef, PressableFeedbackScaleProps>((props, ref) => {
  const { animation, isAnimatedStyleActive = true, style, children, ...restProps } = props;

  const { rContainerStyle } = usePressableFeedbackScaleAnimation({
    animation,
  });

  const scaleStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

  return (
    <Animated.View ref={ref} style={scaleStyle} {...restProps}>
      {children}
    </Animated.View>
  );
});

// --------------------------------------------------

const PressableFeedbackHighlight = forwardRef<ViewRef, PressableFeedbackHighlightProps>(
  (props, ref) => {
    const { animation, className, isAnimatedStyleActive = true, style, ...restProps } = props;

    const { rContainerStyle } = usePressableFeedbackHighlightAnimation({
      animation,
    });

    const highlightClassName = pressableFeedbackClassNames.highlight({
      className,
    });

    const highlightStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

    return (
      <Animated.View
        ref={ref}
        pointerEvents="none"
        className={highlightClassName}
        style={highlightStyle}
        {...restProps}
      />
    );
  },
);

// --------------------------------------------------

const PressableFeedbackRipple = forwardRef<ViewRef, PressableFeedbackRippleProps>((props, ref) => {
  const {
    animation,
    className,
    classNames,
    style,
    styles,
    isAnimatedStyleActive = true,
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    ...restProps
  } = props;

  const {
    rLayer0Style,
    rLayer1Style,
    backgroundColor,
    animationOnTouchEnd,
    animationOnTouchStart,
  } = usePressableFeedbackRippleAnimation({ animation });

  const { container, ripple } = pressableFeedbackClassNames.ripple();

  const containerClassName = container({
    className: [className, classNames?.container],
  });
  const rippleClassName = ripple({ className: classNames?.ripple });

  const layer0Style = isAnimatedStyleActive ? [rLayer0Style, styles?.ripple] : styles?.ripple;

  const layer1Style = isAnimatedStyleActive ? [rLayer1Style, styles?.ripple] : styles?.ripple;

  const gradientStyle = useMemo(
    () => ({
      experimental_backgroundImage: `radial-gradient(circle at center, ${backgroundColor} 30%, transparent 70%)`,
    }),
    [backgroundColor],
  );

  const handleTouchStart = useCallback(
    (event: GestureResponderEvent) => {
      animationOnTouchStart(event);
      onTouchStart?.(event);
    },
    [animationOnTouchStart, onTouchStart],
  );

  const handleTouchEnd = useCallback(
    (event: GestureResponderEvent) => {
      animationOnTouchEnd();
      onTouchEnd?.(event);
    },
    [animationOnTouchEnd, onTouchEnd],
  );

  const handleTouchCancel = useCallback(
    (event: GestureResponderEvent) => {
      animationOnTouchEnd();
      onTouchCancel?.(event);
    },
    [animationOnTouchEnd, onTouchCancel],
  );
  return (
    <View
      ref={ref}
      className={containerClassName}
      style={[style, styles?.container]}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...restProps}
    >
      <Animated.View
        pointerEvents="none"
        className={rippleClassName}
        style={[layer0Style, gradientStyle]}
      />
      <Animated.View
        pointerEvents="none"
        className={rippleClassName}
        style={[layer1Style, gradientStyle]}
      />
    </View>
  );
});

// --------------------------------------------------

PressableFeedback.displayName = DISPLAY_NAME.ROOT;
PressableFeedbackScale.displayName = DISPLAY_NAME.SCALE;
PressableFeedbackHighlight.displayName = DISPLAY_NAME.HIGHLIGHT;
PressableFeedbackRipple.displayName = DISPLAY_NAME.RIPPLE;

/**
 * Pressable container with built-in scale animation and composable feedback compound parts.
 *
 * @component PressableFeedback
 * @description Wraps content to provide consistent press feedback across the app. Provides built-in
 * scale animation by default. Manages press state and container dimensions, providing them to child
 * compound parts via context. Supports `asChild` for rendering as a Slot (polymorphic).
 * Use `animation={{ scale: ... }}` to customize the built-in scale, `animation={false}` to disable
 * it (when using PressableFeedback.Scale on a specific child instead), or `animation="disable-all"`
 * to cascade-disable all animations.
 * @features
 * - Built-in scale animation enabled by default
 * - Composable compound parts: Scale, Highlight, Ripple
 * - Full gesture handling with press, long press, and disabled states
 * - Polymorphic via `asChild` prop (AnimatedSlotPressable = Animated + Slot.Pressable)
 * - Used as foundation for interactive components like Button, Card, and Accordion
 *
 * @component PressableFeedback.Scale
 * @description Scale animation wrapper for applying scale to a specific child element. Use this
 * instead of the root's built-in scale when you need control over which element scales or need
 * to apply className/style to the scale wrapper. Set `animation={false}` on the root to disable
 * its built-in scale when using this component.
 *
 * @component PressableFeedback.Highlight
 * @description Highlight overlay for iOS-style press feedback. Renders an absolute-positioned
 * layer that fades in on press. Must be used within PressableFeedback.
 *
 * @component PressableFeedback.Ripple
 * @description Ripple overlay for Android-style press feedback. Renders a radial gradient circle
 * that expands from the touch point. Must be used within PressableFeedback.
 */
const PressableFeedbackCompound = Object.assign(PressableFeedback, {
  /** Scale animation wrapper for applying scale to a specific child element */
  Scale: PressableFeedbackScale,
  /** Highlight overlay for iOS-style press feedback */
  Highlight: PressableFeedbackHighlight,
  /** Ripple overlay for Android-style press feedback */
  Ripple: PressableFeedbackRipple,
});

export default PressableFeedbackCompound;
