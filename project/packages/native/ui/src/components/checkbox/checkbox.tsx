import { forwardRef, useCallback, useMemo } from "react";
import { type GestureResponderEvent, StyleSheet, View } from "react-native";
import Animated, {
  type AnimatedProps,
  type SharedValue,
  type WithTimingConfig,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { useIsOnSurface, useThemeColor } from "../../helpers/external/hooks";
import { AnimatedCheckIcon, CheckIcon } from "../../helpers/internal/components";
import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type { Animation, AnimationRoot, AnimationValue } from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";
import * as CheckboxPrimitives from "../../primitives/checkbox";
import type * as CheckboxPrimitivesTypes from "../../primitives/checkbox/checkbox.types";
import {
  CheckboxAnimationProvider,
  useCheckboxIndicatorAnimation,
  useCheckboxRootAnimation,
} from "./checkbox.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  CHECKBOX_ROOT: "PitsiUINative.Checkbox.Root",
  CHECKBOX_INDICATOR: "PitsiUINative.Checkbox.Indicator",
} as const;

export const DEFAULT_HIT_SLOP = 6;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Context value for checkbox animation state
 */
export interface CheckboxAnimationContextValue {
  /** Shared value tracking if the checkbox is pressed */
  isCheckboxPressed: SharedValue<boolean>;
}

/**
 * Checkbox Indicator Icon Props
 */
export interface CheckboxIndicatorIconProps {
  /** Indicator size */
  size?: number;
  /** Indicator stroke width */
  strokeWidth?: number;
  /** Indicator color */
  color?: string;
  /** Enter duration */
  enterDuration?: number;
  /** Exit duration */
  exitDuration?: number;
}

/**
 * Render function props for checkbox children
 */
export interface CheckboxRenderProps {
  /** Whether the checkbox is selected */
  isSelected?: boolean;
  /** Whether the checkbox is invalid */
  isInvalid: boolean;
  /** Whether the checkbox is disabled */
  isDisabled: boolean;
}

/**
 * Animation configuration for checkbox root component
 */
export type CheckboxRootAnimation = AnimationRoot<{
  scale?: AnimationValue<{
    /**
     * Scale values [unpressed, pressed]
     * @default [1, 0.95]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     */
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Props for the main Checkbox component
 */
export interface CheckboxProps extends Omit<CheckboxPrimitivesTypes.RootProps, "children"> {
  /** Child elements to render inside the checkbox, or a render function */
  children?: React.ReactNode | ((props: CheckboxRenderProps) => React.ReactNode);

  /** Variant style for the checkbox
   * @default 'primary'
   */
  variant?: "primary" | "secondary";

  /** Custom class name for the checkbox */
  className?: string;
  /** Form/group value associated with this checkbox. */
  value?: string;

  /** Animation configuration for checkbox scale animation */
  animation?: CheckboxRootAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Animation configuration for checkbox indicator component
 */
export type CheckboxIndicatorAnimation = Animation<{
  opacity?: AnimationValue<{
    /**
     * Opacity values [unselected, selected]
     * @default [0, 1]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 100 }
     */
    timingConfig?: WithTimingConfig;
  }>;
  borderRadius?: AnimationValue<{
    /**
     * Border radius values [unselected, selected]
     * @default [99, 0]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 50 }
     */
    timingConfig?: WithTimingConfig;
  }>;
  translateX?: AnimationValue<{
    /**
     * TranslateX values [unselected, selected]
     * @default [-4, 0]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 100 }
     */
    timingConfig?: WithTimingConfig;
  }>;
  scale?: AnimationValue<{
    /**
     * Scale values [unselected, selected]
     * @default [0.8, 1]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 100 }
     */
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Props for the CheckboxIndicator component
 */
export interface CheckboxIndicatorProps
  extends AnimatedProps<Omit<CheckboxPrimitivesTypes.IndicatorProps, "children">> {
  /** Child elements to render inside the indicator, or a render function */
  children?: React.ReactNode | ((props: CheckboxRenderProps) => React.ReactNode);

  /** Custom class name for the indicator */
  className?: string;

  /** Custom icon props for the indicator */
  iconProps?: CheckboxIndicatorIconProps;

  /**
   * Animation configuration
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: CheckboxIndicatorAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "size-6 rounded-lg overflow-hidden",
  variants: {
    variant: {
      primary: "bg-field shadow-field",
      secondary: "bg-default",
    },
    isSelected: {
      true: "",
      false: "",
    },
    isDisabled: {
      true: "disabled:opacity-disabled disabled:pointer-events-none",
      false: "",
    },
    isInvalid: {
      true: "border border-danger",
      false: "border-0",
    },
  },
  compoundVariants: [
    {
      isSelected: false,
      isInvalid: true,
      className: "bg-transparent",
    },
  ],
  defaultVariants: {
    variant: "primary",
    isSelected: false,
    isDisabled: false,
    isInvalid: false,
  },
});

const indicator = tv({
  base: "absolute inset-0 items-center justify-center",
  variants: {
    isInvalid: {
      true: "bg-danger",
      false: "bg-accent",
    },
  },
  defaultVariants: {
    isInvalid: false,
  },
});

export const checkboxClassNames = combineStyles({
  root,
  indicator,
});

export const checkboxStyleSheet = StyleSheet.create({
  root: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Animated views
 * -----------------------------------------------------------------------------------------------*/
const AnimatedRootView = Animated.createAnimatedComponent(CheckboxPrimitives.Root);

const AnimatedIndicatorView = Animated.createAnimatedComponent(CheckboxPrimitives.Indicator);

const useCheckbox = CheckboxPrimitives.useCheckboxContext;

/* -------------------------------------------------------------------------------------------------
 * Checkbox.Root
 * -----------------------------------------------------------------------------------------------*/
const CheckboxRoot = forwardRef<CheckboxPrimitivesTypes.RootRef, CheckboxProps>((props, ref) => {
  const {
    children,
    isSelected,
    onSelectedChange,
    isDisabled = false,
    isInvalid = false,
    variant,
    value: _value,
    hitSlop = DEFAULT_HIT_SLOP,
    className,
    style,
    onPressIn,
    onPressOut,
    animation,
    isAnimatedStyleActive = true,
    ...restProps
  } = props;

  const isOnSurfaceAutoDetected = useIsOnSurface();
  const finalVariant =
    variant !== undefined ? variant : isOnSurfaceAutoDetected ? "secondary" : "primary";

  const rootClassName = checkboxClassNames.root({
    variant: finalVariant,
    isSelected,
    isDisabled,
    isInvalid,
    className,
  });

  const { rContainerStyle, isCheckboxPressed, isAllAnimationsDisabled } = useCheckboxRootAnimation({
    animation,
  });

  const rootStyle = isAnimatedStyleActive
    ? [rContainerStyle, checkboxStyleSheet.root, style]
    : [checkboxStyleSheet.root, style];

  const animationContextValue = useMemo(
    () => ({
      isCheckboxPressed,
    }),
    [isCheckboxPressed],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      isCheckboxPressed.set(true);
      onPressIn?.(event);
    },
    [isCheckboxPressed, onPressIn],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      isCheckboxPressed.set(false);
      onPressOut?.(event);
    },
    [isCheckboxPressed, onPressOut],
  );

  const renderProps: CheckboxRenderProps = {
    isSelected,
    isInvalid,
    isDisabled,
  };

  const content =
    typeof children === "function" ? children(renderProps) : (children ?? <CheckboxIndicator />);

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <CheckboxAnimationProvider value={animationContextValue}>
        <AnimatedRootView
          ref={ref}
          className={rootClassName}
          isSelected={isSelected}
          onSelectedChange={onSelectedChange}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          hitSlop={hitSlop}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={rootStyle}
          {...restProps}
        >
          {content}
        </AnimatedRootView>
      </CheckboxAnimationProvider>
    </AnimationSettingsProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Checkbox.Indicator
 * -----------------------------------------------------------------------------------------------*/
const CheckboxIndicator = forwardRef<CheckboxPrimitivesTypes.IndicatorRef, CheckboxIndicatorProps>(
  (props, ref) => {
    const {
      children,
      iconProps,
      className,
      style,
      animation,
      isAnimatedStyleActive = true,
      ...restProps
    } = props;

    const { isSelected, isDisabled, isInvalid } = useCheckbox();

    const themeColorAccentForeground = useThemeColor("accent-foreground");

    const iconSize = iconProps?.size;
    const iconStrokeWidth = iconProps?.strokeWidth;
    const iconColor = iconProps?.color ?? themeColorAccentForeground;
    const iconEnterDuration = iconProps?.enterDuration;
    const iconExitDuration = iconProps?.exitDuration;

    const indicatorClassName = checkboxClassNames.indicator({
      isInvalid,
      className,
    });

    const { rContainerStyle, isAnimationDisabled } = useCheckboxIndicatorAnimation({
      animation,
      isSelected,
    });

    const indicatorStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

    const renderProps: CheckboxRenderProps = {
      isSelected,
      isInvalid: isInvalid ?? false,
      isDisabled: isDisabled ?? false,
    };

    const content =
      typeof children === "function"
        ? children(renderProps)
        : (children ??
          (isAnimationDisabled ? (
            <View className="translate-y-px">
              <CheckIcon size={iconSize} color={iconColor} />
            </View>
          ) : (
            <AnimatedCheckIcon
              size={iconSize}
              strokeWidth={iconStrokeWidth}
              color={iconColor}
              isSelected={isSelected}
              enterDuration={iconEnterDuration}
              exitDuration={iconExitDuration}
            />
          )));

    return (
      <AnimatedIndicatorView
        ref={ref}
        className={indicatorClassName}
        style={indicatorStyle}
        {...restProps}
      >
        {content}
      </AnimatedIndicatorView>
    );
  },
);

CheckboxRoot.displayName = DISPLAY_NAME.CHECKBOX_ROOT;
CheckboxIndicator.displayName = DISPLAY_NAME.CHECKBOX_INDICATOR;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Checkbox - Main container that handles selection state and user interaction.
 *   Renders default indicator with checkmark if no children provided.
 * @component Checkbox.Indicator - Optional checkmark container that scales in when selected.
 *
 * @see https://pitsiui.com/docs/native/components/checkbox
 * -----------------------------------------------------------------------------------------------*/
const Checkbox = Object.assign(CheckboxRoot, {
  /** @optional Custom indicator with scale animations */
  Indicator: CheckboxIndicator,
});

export { Checkbox, useCheckbox };
export default Checkbox;
