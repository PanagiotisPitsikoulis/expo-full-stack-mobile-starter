/**
 * Display names for Toast components
 */

import { forwardRef, useMemo } from "react";
// --------------------------------------------------
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { EntryOrExitLayoutType, WithTimingConfig } from "react-native-reanimated";
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { tv } from "tailwind-variants";
import { useResolveClassNames } from "uniwind";
import { useThemeColor } from "../../helpers/external/hooks";
import { cn } from "../../helpers/external/utils";
import { CloseIcon, HeroText } from "../../helpers/internal/components";
import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type { AnimationRoot, AnimationValue, TextRef, ViewRef } from "../../helpers/internal/types";
import {
  combineStyles,
  createContext,
  getAnimationValueMergedConfig,
  getAnimationValueProperty,
  getIsAnimationDisabledValue,
  getRootAnimationState,
} from "../../helpers/internal/utils";
import * as ToastPrimitive from "../../primitives/toast";
import type { ToastComponentProps, ToastShowOptions } from "../../providers/toast";
import { useToastConfig } from "../../providers/toast/toast-config.context";
import type { ButtonRootProps, ButtonRootPropsScaleHighlight } from "../button";
import { Button } from "../button";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  TOAST_ROOT: "PitsiUINative.Toast.Root",
  TOAST_TITLE: "PitsiUINative.Toast.Title",
  TOAST_DESCRIPTION: "PitsiUINative.Toast.Description",
  TOAST_ACTION: "PitsiUINative.Toast.Action",
  TOAST_CLOSE: "PitsiUINative.Toast.Close",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Toast variant types
 */
export type ToastVariant = "default" | "accent" | "success" | "warning" | "danger";

/**
 * Toast placement types
 */
export type ToastPlacement = "top" | "bottom";

/**
 * Animation configuration for toast root component
 */
export type ToastRootAnimation = AnimationRoot<{
  opacity?: AnimationValue<{
    /**
     * Opacity interpolation values [start, end]
     * Controls how fast toast items fade out as they move beyond the visible stack limits.
     * When toasts are pushed out of view (beyond the last few visible items), their opacity
     * gradually decreases to create a smooth disappearing effect.
     * - First value: fully visible opacity (1) for items within visible stack
     * - Second value: hidden opacity (0) for items pushed out of view
     * @default [1, 0]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 300 }
     */
    timingConfig?: WithTimingConfig;
  }>;
  translateY?: AnimationValue<{
    /**
     * Translate Y interpolation values [start, end]
     * Controls how much of a toast item is visible when it's positioned behind the last visible toast.
     * This creates a "peek" effect where stacked toasts are slightly offset vertically,
     * allowing users to see a portion of the toast behind the current one.
     * - First value: no offset (0) for the last/active toast
     * - Second value: vertical offset in pixels (10) for toasts behind the last one
     * Note: The offset direction is automatically adjusted based on placement (top/bottom)
     * @default [0, 10] (multiplied by placement sign)
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 300 }
     */
    timingConfig?: WithTimingConfig;
  }>;
  scale?: AnimationValue<{
    /**
     * Scale interpolation values [start, end]
     * Controls the size scaling of toast items in the stack.
     * Toasts behind the active one are slightly scaled down to create depth and visual hierarchy.
     * - First value: normal scale (1) for the active/last toast
     * - Second value: scaled down value (0.97) for toasts positioned behind
     * @default [1, 0.97]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 300 }
     */
    timingConfig?: WithTimingConfig;
  }>;
  entering?: AnimationValue<{
    /**
     * Custom entering animation for top placement
     * @default FadeInUp.springify().withInitialValues({ opacity: 1, transform: [{ translateY: -100 }] }).mass(3)
     */
    top?: EntryOrExitLayoutType;
    /**
     * Custom entering animation for bottom placement
     * @default FadeInDown.springify().withInitialValues({ opacity: 1, transform: [{ translateY: 100 }] }).mass(3)
     */
    bottom?: EntryOrExitLayoutType;
  }>;
  exiting?: AnimationValue<{
    /**
     * Custom exiting animation for top placement
     * @default Keyframe animation with translateY: -100, scale: 0.97, opacity: 0.5
     */
    top?: EntryOrExitLayoutType;
    /**
     * Custom exiting animation for bottom placement
     * @default Keyframe animation with translateY: 100, scale: 0.97, opacity: 0.5
     */
    bottom?: EntryOrExitLayoutType;
  }>;
}>;

/**
 * Props for the Toast.Root component
 */
export interface ToastRootProps extends ToastPrimitive.RootProps, Omit<ToastComponentProps, "id"> {
  /**
   * Visual variant of the toast
   * @default 'default'
   */
  variant?: ToastVariant;
  /**
   * Placement of the toast
   * @default 'top'
   */
  placement?: ToastPlacement;
  /**
   * Additional CSS class for the toast container
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `opacity` - Animated for visibility transitions when toasts are pushed beyond visible stack limits
   * - `transform` (translateY) - Animated for vertical position transitions when toasts are stacked, and for swipe-to-dismiss gestures
   * - `transform` (scale) - Animated for size scaling transitions when toasts are stacked (toasts behind active one are scaled down)
   * - `height` - Animated for height transitions when toast content changes
   *
   * To customize these properties, use the `animation` prop:
   * ```tsx
   * <Toast.Root
   *   animation={{
   *     opacity: {
   *       value: [1, 0],
   *       timingConfig: { duration: 300 }
   *     },
   *     translateY: {
   *       value: [0, 10],
   *       timingConfig: { duration: 300 }
   *     },
   *     scale: {
   *       value: [1, 0.97],
   *       timingConfig: { duration: 300 }
   *     }
   *   }}
   * />
   * ```
   *
   * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
   */
  className?: string;
  /**
   * Animation configuration for toast
   * - `false` or `"disabled"`: Disable only root animations
   * - `"disable-all"`: Disable all animations including children
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: ToastRootAnimation;
  /**
   * Whether the toast can be swiped to dismiss and dragged with rubber effect
   * @default true
   */
  isSwipeable?: boolean;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Props for the Toast.Title component
 */
export interface ToastTitleProps extends ToastPrimitive.TitleProps {
  /**
   * Content to be rendered as title
   */
  children?: React.ReactNode;
  /**
   * Additional CSS class for the title
   */
  className?: string;
}

/**
 * Props for the Toast.Description component
 */
export interface ToastDescriptionProps extends ToastPrimitive.DescriptionProps {
  /**
   * Content to be rendered as description
   */
  children?: React.ReactNode;
  /**
   * Additional CSS class for the description
   */
  className?: string;
}

/**
 * Props for the Toast.Action component
 */
export type ToastActionProps = Omit<ButtonRootPropsScaleHighlight, "feedbackVariant">;

/**
 * Props for the Toast.Close component
 */
export type ToastCloseProps = ButtonRootProps & {
  /**
   * Custom icon props for the close button icon
   */
  iconProps?: {
    size?: number;
    color?: string;
  };
};

/**
 * Context values shared between Toast components
 */
export interface ToastContextValue {
  /**
   * Visual variant of the toast
   */
  variant: ToastVariant;
  /**
   * Function to hide the toast
   */
  hide?: (ids?: string | string[] | "all") => void;
  /**
   * ID of the toast
   */
  id?: string;
}

/**
 * Ref type for the Toast.Root component
 */
export type ToastRootRef = ViewRef;

/**
 * Props for useToastRootAnimation hook
 * Picks required properties from ToastRootProps and adds id from ToastComponentProps
 */
export type UseToastRootAnimationOptions = Pick<
  ToastRootProps,
  | "animation"
  | "index"
  | "total"
  | "heights"
  | "placement"
  | "hide"
  | "isSwipeable"
  | "maxVisibleToasts"
> &
  Pick<ToastComponentProps, "id">;

/**
 * Props for the DefaultToast component
 * Used internally when showing toasts with string or config object (without component)
 */
export interface DefaultToastProps extends ToastComponentProps {
  /**
   * Visual variant of the toast
   * @default 'default'
   */
  variant?: ToastRootProps["variant"];
  /**
   * Placement of the toast
   * @default 'top'
   */
  placement?: ToastRootProps["placement"];
  /**
   * Animation configuration for toast
   */
  animation?: ToastRootProps["animation"];
  /**
   * Whether the toast can be swiped to dismiss and dragged with rubber effect
   */
  isSwipeable?: ToastRootProps["isSwipeable"];
  /**
   * Label text for the toast
   */
  label?: string;
  /**
   * Description text for the toast
   */
  description?: string;
  /**
   * Action button label text
   */
  actionLabel?: string;
  /**
   * Callback function called when the action button is pressed
   * Receives show and hide functions for programmatic toast control
   */
  onActionPress?: (helpers: {
    show: (options: string | ToastShowOptions) => string;
    hide: (ids?: string | string[] | "all") => void;
  }) => void;
  /**
   * Icon element to display in the toast
   */
  icon?: React.ReactNode;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
/**
 * Toast root styles
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following properties are animated and cannot be overridden using Tailwind classes:
 * - `opacity` - Animated for visibility transitions when toasts are pushed beyond visible stack limits
 * - `transform` (translateY) - Animated for vertical position transitions when toasts are stacked, and for swipe-to-dismiss gestures
 * - `transform` (scale) - Animated for size scaling transitions when toasts are stacked (toasts behind active one are scaled down)
 * - `height` - Animated for height transitions when toast content changes
 *
 * To customize these properties, use the `animation` prop on `Toast.Root`:
 * ```tsx
 * <Toast.Root
 *   animation={{
 *     opacity: {
 *       value: [1, 0],
 *       timingConfig: { duration: 300 }
 *     },
 *     translateY: {
 *       value: [0, 10],
 *       timingConfig: { duration: 300 }
 *     },
 *     scale: {
 *       value: [1, 0.97],
 *       timingConfig: { duration: 300 }
 *     }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Toast.Root`.
 */
const root = tv({
  base: "bg-surface rounded-3xl p-4 shadow-overlay overflow-hidden",
});

const label = tv({
  base: "text-base font-medium",
  variants: {
    variant: {
      default: "text-foreground",
      accent: "text-foreground",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const description = tv({
  base: "text-sm text-muted",
});

const action = tv({
  base: "",
  variants: {
    variant: {
      default: "",
      accent: "",
      success: "bg-success",
      warning: "bg-warning",
      danger: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const toastClassNames = combineStyles({
  root,
  label,
  description,
  action,
});

export const toastStyleSheet = StyleSheet.create({
  root: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/
export const enteringTop = FadeInUp.springify()
  .withInitialValues({
    opacity: 1,
    transform: [{ translateY: -100 }],
  })
  .mass(3);

export const exitingTop = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
  100: {
    opacity: 0.5,
    transform: [{ translateY: -100 }, { scale: 0.97 }],
    easing: Easing.bezier(0.4, 0, 1, 1),
  },
}).duration(150);

export const enteringBottom = FadeInDown.springify()
  .withInitialValues({
    opacity: 1,
    transform: [{ translateY: 100 }],
  })
  .mass(3);

export const exitingBottom = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
  100: {
    opacity: 0.5,
    transform: [{ translateY: 100 }, { scale: 0.97 }],
    easing: Easing.bezier(0.4, 0, 1, 1),
  },
}).duration(150);

// --------------------------------------------------

/**
 * Animation hook for Toast root component
 * Handles opacity, translateY, and scale animations based on toast index and placement
 * Also handles gesture-based swipe to dismiss and rubber-band drag effects
 */
export function useToastRootAnimation(options: UseToastRootAnimationOptions) {
  const {
    animation,
    index,
    total,
    heights,
    placement,
    hide,
    id,
    isSwipeable = true,
    maxVisibleToasts = 3,
  } = options;

  const { height: screenHeight } = useWindowDimensions();

  const { animationConfig, isAnimationDisabled } = getRootAnimationState(animation);

  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  // Entering animation
  const enteringTopValue = getAnimationValueProperty({
    animationValue: animationConfig?.entering,
    property: "top",
    defaultValue: enteringTop,
  });

  const enteringBottomValue = getAnimationValueProperty({
    animationValue: animationConfig?.entering,
    property: "bottom",
    defaultValue: enteringBottom,
  });

  // Exiting animation
  const exitingTopValue = getAnimationValueProperty({
    animationValue: animationConfig?.exiting,
    property: "top",
    defaultValue: exitingTop,
  });

  const exitingBottomValue = getAnimationValueProperty({
    animationValue: animationConfig?.exiting,
    property: "bottom",
    defaultValue: exitingBottom,
  });

  // Opacity animation
  const opacityValue = getAnimationValueProperty({
    animationValue: animationConfig?.opacity,
    property: "value",
    defaultValue: [1, 0] as [number, number],
  });

  const opacityTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.opacity,
    property: "timingConfig",
    defaultValue: { duration: 300 },
  });

  // TranslateY animation
  const translateYValue = getAnimationValueProperty({
    animationValue: animationConfig?.translateY,
    property: "value",
    defaultValue: [0, 10] as [number, number],
  });

  const translateYTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.translateY,
    property: "timingConfig",
    defaultValue: { duration: 300 },
  });

  // Scale animation
  const scaleValue = getAnimationValueProperty({
    animationValue: animationConfig?.scale,
    property: "value",
    defaultValue: [1, 0.97] as [number, number],
  });

  const scaleTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.scale,
    property: "timingConfig",
    defaultValue: { duration: 300 },
  });

  // Gesture state shared values
  const isDragging = useSharedValue(false);
  const gestureTranslateY = useSharedValue(0);
  const gestureScale = useSharedValue(1);

  // Helper function to delay hide call based on velocity
  const delayedHide = (toastId: string | undefined, velocity: number) => {
    const velocityBasedTimeout = Math.min(200, Math.abs(velocity));
    setTimeout(() => {
      if (hide && toastId) {
        hide(toastId);
      }
    }, velocityBasedTimeout);
  };

  // Create pan gesture handler
  const panGesture = Gesture.Pan()
    .enabled(!isAnimationDisabledValue && isSwipeable)
    .onBegin(() => {
      isDragging.set(true);
      gestureTranslateY.set(0);
      gestureScale.set(0.995);
    })
    .onChange((event) => {
      if (!isDragging.get()) return;

      const translationY = event.translationY;
      const maxDragDistance = screenHeight;
      const rubberEffectDistance = 40;

      if (placement === "top") {
        // Top placement: swipe up (negative Y) to dismiss, drag down (positive Y) with rubber effect
        if (translationY < 0) {
          // Swiping up - direct translation for dismissal
          gestureTranslateY.set(translationY);
        } else if (translationY > 0) {
          // Dragging down - apply rubber effect
          const rubberTranslateY = interpolate(
            translationY,
            [0, maxDragDistance],
            [0, rubberEffectDistance],
            Extrapolation.CLAMP,
          );
          gestureTranslateY.set(rubberTranslateY);
        }
      } else {
        // Bottom placement: swipe down (positive Y) to dismiss, drag up (negative Y) with rubber effect
        if (translationY > 0) {
          // Swiping down - direct translation for dismissal
          gestureTranslateY.set(translationY);
        } else if (translationY < 0) {
          // Dragging up - apply rubber effect
          const rubberTranslateY = interpolate(
            Math.abs(translationY),
            [0, maxDragDistance],
            [0, rubberEffectDistance],
            Extrapolation.CLAMP,
          );
          gestureTranslateY.set(-rubberTranslateY);
        }
      }
    })
    .onFinalize((event) => {
      gestureScale.set(1);

      const translationY = event.translationY;
      const velocityY = event.velocityY;
      const dismissThreshold = 50;
      const velocityThreshold = 500;

      // Check if dismissal threshold is met (distance > 50px OR velocity > 500)
      const shouldDismiss =
        Math.abs(translationY) > dismissThreshold || Math.abs(velocityY) > velocityThreshold;

      if (placement === "top") {
        // Top placement: dismiss if swiped up (negative Y)
        if (shouldDismiss && translationY < 0 && id) {
          // Use withDecay to continue motion with velocity
          gestureTranslateY.set(
            withDecay(
              {
                velocity: velocityY * 1.5,
                clamp: [Number.NEGATIVE_INFINITY, 0],
              },
              () => {
                isDragging.set(false);
              },
            ),
          );
          // Delay hide call to allow decay animation to play
          scheduleOnRN(delayedHide, id, velocityY);
        } else {
          // Animate back to 0
          gestureTranslateY.set(withSpring(0));
          isDragging.set(false);
        }
      } else {
        // Bottom placement: dismiss if swiped down (positive Y)
        if (shouldDismiss && translationY > 0 && id) {
          // Use withDecay to continue motion with velocity
          gestureTranslateY.set(
            withDecay(
              {
                velocity: velocityY * 1.5,
                clamp: [0, Number.POSITIVE_INFINITY],
              },
              () => {
                isDragging.set(false);
              },
            ),
          );
          // Delay hide call to allow decay animation to play
          scheduleOnRN(delayedHide, id, velocityY);
        } else {
          // Animate back to 0
          gestureTranslateY.set(withSpring(0));
          isDragging.set(false);
        }
      }
    });

  const rContainerStyle = useAnimatedStyle(() => {
    const lastToastId = Object.keys(heights.get())[Object.keys(heights.get()).length - 1];
    const lastToastHeight = lastToastId ? heights.get()[lastToastId] : undefined;

    const sign = placement === "top" ? 1 : -1;

    const totalValue = total.get();

    const inputRange = [totalValue - 1, totalValue - 2];
    const opacityInputRange = [totalValue - maxVisibleToasts, totalValue - maxVisibleToasts - 1];

    const opacity = interpolate(index, opacityInputRange, opacityValue);

    // Handle translateY based on dragging state
    let translateY: number;
    let scale: number;
    if (isDragging.get()) {
      // During gesture: use gesture-based translateY
      translateY = gestureTranslateY.get();
      scale = gestureScale.get();
    } else {
      // Normal state: use stack-based interpolation
      translateY = interpolate(index, inputRange, [translateYValue[0], translateYValue[1] * sign], {
        extrapolateLeft: Extrapolation.CLAMP,
      });
      scale = interpolate(index, inputRange, scaleValue, {
        extrapolateLeft: Extrapolation.CLAMP,
      });
    }

    if (isAnimationDisabledValue) {
      return {
        height: lastToastHeight,
        pointerEvents: opacity === 0 ? "none" : "auto",
        opacity,
        transform: [
          {
            translateY,
          },
          {
            scale,
          },
        ],
      };
    }

    return {
      height: lastToastHeight
        ? withSpring(lastToastHeight, {
            damping: 100,
            stiffness: 1200,
            mass: 3,
          })
        : undefined,
      pointerEvents: opacity === 0 ? "none" : "auto",
      opacity: withTiming(opacity, opacityTimingConfig),
      transform: [
        {
          translateY: isDragging.get()
            ? translateY
            : withTiming(translateY, translateYTimingConfig),
        },
        {
          scale: isDragging.get() ? withSpring(scale) : withTiming(scale, scaleTimingConfig),
        },
      ],
    };
  });

  // Determine entering and exiting animations based on placement
  const enteringAnimation = placement === "top" ? enteringTopValue : enteringBottomValue;
  const exitingAnimation = placement === "top" ? exitingTopValue : exitingBottomValue;

  return {
    rContainerStyle,
    isAllAnimationsDisabled,
    entering: isAnimationDisabledValue ? undefined : enteringAnimation,
    exiting: isAnimationDisabledValue ? undefined : exitingAnimation,
    panGesture,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Hooks
 * -----------------------------------------------------------------------------------------------*/
interface UseVerticalPlaceholderStylesParams {
  rootClassName?: string;
  style?: StyleProp<ViewStyle>;
}

export function useVerticalPlaceholderStyles({
  rootClassName,
  style,
}: UseVerticalPlaceholderStylesParams) {
  const resolvedRootClassName = useResolveClassNames(rootClassName ?? "");

  return useMemo(() => {
    const resolvedStyle = style ? StyleSheet.flatten(style) : undefined;

    const stylePaddingTop =
      resolvedStyle?.paddingTop ?? resolvedStyle?.paddingVertical ?? resolvedStyle?.padding;
    const stylePaddingBottom =
      resolvedStyle?.paddingBottom ?? resolvedStyle?.paddingVertical ?? resolvedStyle?.padding;

    const classNamePaddingTop =
      resolvedRootClassName?.paddingTop ??
      resolvedRootClassName?.paddingVertical ??
      resolvedRootClassName?.padding;
    const classNamePaddingBottom =
      resolvedRootClassName?.paddingBottom ??
      resolvedRootClassName?.paddingVertical ??
      resolvedRootClassName?.padding;

    const paddingTopValue = stylePaddingTop ?? classNamePaddingTop;
    const paddingBottomValue = stylePaddingBottom ?? classNamePaddingBottom;

    const topHeight =
      typeof paddingTopValue === "number" && paddingTopValue >= 0 ? paddingTopValue : 0;
    const bottomHeight =
      typeof paddingBottomValue === "number" && paddingBottomValue >= 0 ? paddingBottomValue : 0;

    const styleBackgroundColor = resolvedStyle?.backgroundColor;
    const classNameBackgroundColor = resolvedRootClassName?.backgroundColor;
    const backgroundColor = styleBackgroundColor ?? classNameBackgroundColor ?? undefined;

    const topStyle: ViewStyle = {
      height: topHeight,
    };

    const bottomStyle: ViewStyle = {
      height: bottomHeight,
    };

    if (backgroundColor !== undefined) {
      topStyle.backgroundColor = backgroundColor;
      bottomStyle.backgroundColor = backgroundColor;
    }

    return {
      topStyle,
      bottomStyle,
    };
  }, [resolvedRootClassName, style]);
}

/* -------------------------------------------------------------------------------------------------
 * Components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedToastRoot = Animated.createAnimatedComponent(ToastPrimitive.Root);

const [ToastProvider, useToast] = createContext<ToastContextValue>({
  name: "ToastContext",
});

// --------------------------------------------------

const ToastRoot = forwardRef<ViewRef, ToastRootProps>((props, ref) => {
  const globalConfig = useToastConfig();

  const {
    children,
    variant: localVariant,
    placement: localPlacement,
    index,
    total,
    heights,
    maxVisibleToasts,
    className,
    style,
    animation: localAnimation,
    isSwipeable: localIsSwipeable,
    isAnimatedStyleActive = true,
    hide,
    ...restProps
  } = props;

  /**
   * Merge global config with local props, ensuring local props take precedence
   */
  const variant = localVariant ?? globalConfig?.variant ?? "default";
  const placement = localPlacement ?? globalConfig?.placement ?? "top";
  const animation = localAnimation ?? globalConfig?.animation;
  const isSwipeable = localIsSwipeable ?? globalConfig?.isSwipeable;

  // Access id from props (id is omitted from ToastRootProps type but available at runtime)
  const toastProps = props as ToastRootProps & Pick<ToastComponentProps, "id">;
  const { id } = toastProps;

  const rootClassName = toastClassNames.root({
    className,
  });

  // Extract padding and backgroundColor for placeholder Views
  const { topStyle, bottomStyle } = useVerticalPlaceholderStyles({
    rootClassName,
    style,
  });

  const { rContainerStyle, entering, exiting, panGesture, isAllAnimationsDisabled } =
    useToastRootAnimation({
      animation,
      index,
      total,
      heights,
      placement,
      hide,
      id,
      isSwipeable,
      maxVisibleToasts,
    });

  const rootStyle = isAnimatedStyleActive
    ? [toastStyleSheet.root, rContainerStyle, style]
    : [toastStyleSheet.root, style];

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const contextValue = useMemo(
    () => ({
      variant,
      hide,
      id,
    }),
    [variant, hide, id],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <ToastProvider value={contextValue}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className={cn("absolute left-0 right-0", placement === "top" ? "top-0" : "bottom-0")}
            entering={entering}
            exiting={exiting}
          >
            {/* Animated toast instance */}
            <AnimatedToastRoot ref={ref} className={rootClassName} style={rootStyle} {...restProps}>
              {children}
              {/* 
                When visible toasts have different heights, the toast adapts to the last visible toast height.
                In cases where a toast originally has one height and gets smaller when a new toast comes to stack,
                content might be visible behind the last toast without proper padding.
                The placeholder Views ensure that the content under active toast is hidden.
              */}
              <View className="absolute left-0 right-0 top-0" style={topStyle} />
              <View className="absolute left-0 right-0 bottom-0" style={bottomStyle} />
            </AnimatedToastRoot>
            {/* Hidden toast instance for height measurement */}
            <AnimatedToastRoot
              pointerEvents="none"
              className={cn(rootClassName, "absolute opacity-0")}
              style={[toastStyleSheet.root, style]}
              onLayout={(event) => {
                const measuredHeight = event.nativeEvent.layout.height;
                heights.modify((value) => {
                  "worklet";
                  return { ...value, [id]: measuredHeight };
                });
              }}
              {...restProps}
            >
              {children}
            </AnimatedToastRoot>
          </Animated.View>
        </GestureDetector>
      </ToastProvider>
    </AnimationSettingsProvider>
  );
});

// --------------------------------------------------

const ToastTitle = forwardRef<TextRef, ToastTitleProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const { variant } = useToast();

  const labelClassName = toastClassNames.label({
    variant,
    className,
  });

  return (
    <HeroText ref={ref} className={labelClassName} {...restProps}>
      {children}
    </HeroText>
  );
});

// --------------------------------------------------

const ToastDescription = forwardRef<TextRef, ToastDescriptionProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const descriptionClassName = toastClassNames.description({
    className,
  });

  return (
    <HeroText ref={ref} className={descriptionClassName} {...restProps}>
      {children}
    </HeroText>
  );
});

// --------------------------------------------------

const ToastAction = forwardRef<View, ToastActionProps>((props, ref) => {
  const { children, variant, size = "sm", animation, className, ...restProps } = props;

  const { variant: toastVariant } = useToast();

  const actionClassName = toastClassNames.action({
    variant: toastVariant,
    className,
  });

  const [
    themeColorDefaultHover,
    themeColorAccentHover,
    themeColorSuccessHover,
    themeColorWarningHover,
    themeColorDangerHover,
  ] = useThemeColor([
    "default-hover",
    "accent-hover",
    "success-hover",
    "warning-hover",
    "danger-hover",
  ]);

  const highlightColorMap = useMemo(() => {
    switch (toastVariant) {
      case "default":
        return themeColorDefaultHover;
      case "accent":
        return themeColorAccentHover;
      case "success":
        return themeColorSuccessHover;
      case "warning":
        return themeColorWarningHover;
      case "danger":
        return themeColorDangerHover;
    }
  }, [
    toastVariant,
    themeColorDefaultHover,
    themeColorAccentHover,
    themeColorSuccessHover,
    themeColorWarningHover,
    themeColorDangerHover,
  ]);

  const buttonVariant = useMemo(() => {
    if (variant) return variant;

    switch (toastVariant) {
      case "accent":
        return "primary";
      case "danger":
        return "danger";
      default:
        return "tertiary";
    }
  }, [toastVariant, variant]);

  const defaultHighlightConfig = useMemo(
    () => ({
      backgroundColor: { value: highlightColorMap },
      opacity: { value: [0, 1] as [number, number] },
    }),
    [highlightColorMap],
  );

  const resolvedAnimation =
    typeof animation === "object" && animation !== null ? animation : undefined;

  const mergedAnimation = useMemo<ToastActionProps["animation"]>(() => {
    if (animation === false || animation === "disabled" || animation === "disable-all") {
      return animation;
    }

    return {
      scale: false,
      ...resolvedAnimation,
      highlight: resolvedAnimation?.highlight ?? defaultHighlightConfig,
    };
  }, [animation, resolvedAnimation, defaultHighlightConfig]);

  return (
    <Button
      ref={ref}
      variant={buttonVariant}
      size={size}
      className={actionClassName}
      feedbackVariant="scale-highlight"
      animation={mergedAnimation}
      {...restProps}
    >
      {children}
    </Button>
  );
});

// --------------------------------------------------

const ToastClose = forwardRef<View, ToastCloseProps>((props, ref) => {
  const { children, iconProps, size = "sm", className, onPress, ...restProps } = props;
  const { hide, id } = useToast();

  const themeColorMuted = useThemeColor("muted");

  /**
   * Handle close button press
   * If hide and id are available from context, use them to hide the toast
   * Otherwise, use the provided onPress handler
   */
  const handlePress = (event: any) => {
    if (hide && id) {
      hide(id);
    }
    if (onPress && typeof onPress === "function") {
      onPress(event);
    }
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size={size}
      isIconOnly
      aria-label="Close"
      className={className}
      onPress={handlePress}
      {...restProps}
    >
      {children ?? (
        <CloseIcon size={iconProps?.size ?? 16} color={iconProps?.color ?? themeColorMuted} />
      )}
    </Button>
  );
});

// --------------------------------------------------

/**
 * Default styled toast component for simplified toast.show() API
 * Used internally when showing toasts with string or config object (without component)
 */
export function DefaultToast(props: DefaultToastProps) {
  const globalConfig = useToastConfig();

  const {
    id,
    variant: localVariant,
    placement: localPlacement,
    isSwipeable: localIsSwipeable,
    animation: localAnimation,
    label,
    description,
    actionLabel,
    onActionPress,
    icon,
    hide,
    show,
    ...toastComponentProps
  } = props;

  /**
   * Merge global config with local props, ensuring local props take precedence
   */
  const variant = localVariant ?? globalConfig?.variant ?? "default";
  const placement = localPlacement ?? globalConfig?.placement ?? "top";
  const isSwipeable = localIsSwipeable ?? globalConfig?.isSwipeable;
  const animation = localAnimation ?? globalConfig?.animation;

  const handleActionPress = () => {
    if (onActionPress) {
      onActionPress({ show, hide });
    }
  };

  return (
    <ToastRoot
      id={id}
      variant={variant}
      placement={placement}
      isSwipeable={isSwipeable}
      animation={animation}
      className="flex-row gap-3"
      hide={hide}
      show={show}
      {...toastComponentProps}
    >
      {icon && <View>{icon}</View>}
      <View className="flex-1">
        {label && <ToastTitle>{label}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
      </View>
      {actionLabel && <ToastAction onPress={handleActionPress}>{actionLabel}</ToastAction>}
    </ToastRoot>
  );
}

// --------------------------------------------------

ToastRoot.displayName = DISPLAY_NAME.TOAST_ROOT;
ToastTitle.displayName = DISPLAY_NAME.TOAST_TITLE;
ToastDescription.displayName = DISPLAY_NAME.TOAST_DESCRIPTION;
ToastAction.displayName = DISPLAY_NAME.TOAST_ACTION;
ToastClose.displayName = DISPLAY_NAME.TOAST_CLOSE;

/**
 * Compound Toast component with sub-components
 *
 * @component Toast - Main toast container that displays notification messages with various variants.
 *
 * @component Toast.Title - Title/heading text of the toast notification.
 *
 * @component Toast.Description - Descriptive text content of the toast.
 *
 * @component Toast.Action - Action button within the toast. Variant is automatically determined
 * based on toast variant but can be overridden.
 *
 * @component Toast.Close - Close button for dismissing the toast. Renders as an icon-only button.
 *
 * Props flow from Toast to sub-components via context (variant).
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/toast
 */
const CompoundToast = Object.assign(ToastRoot, {
  /** Toast title - renders text content */
  Title: ToastTitle,
  /** Toast description - renders descriptive text */
  Description: ToastDescription,
  /** Toast action button - renders action with appropriate variant */
  Action: ToastAction,
  /** Toast close button - renders icon-only close button */
  Close: ToastClose,
});

export default CompoundToast;
