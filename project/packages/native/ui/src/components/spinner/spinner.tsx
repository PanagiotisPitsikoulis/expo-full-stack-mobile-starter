import { forwardRef, useMemo } from "react";
import type { View, ViewProps } from "react-native";
import Animated, {
  type AnimatedProps,
  Easing,
  type EntryOrExitLayoutType,
  FadeIn,
  FadeOut,
  type WithTimingConfig,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";

import { useThemeColor } from "../../helpers/external/hooks";
import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type { Animation, AnimationRoot, AnimationValue } from "../../helpers/internal/types";
import { combineStyles, createContext, getElementWithDefault } from "../../helpers/internal/utils";
import * as ActivityIndicatorPrimitives from "../../primitives/activity-indicator";
import { useSpinnerIndicatorAnimation, useSpinnerRootAnimation } from "./spinner.animation";
import { SpinnerIcon } from "./spinner-icon";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Spinner components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Spinner.Root",
  INDICATOR: "PitsiUINative.Spinner.Indicator",
  ICON: "PitsiUINative.Spinner.Icon",
} as const;

/**
 * Default animation duration for spinner rotation (in milliseconds)
 */
export const DEFAULT_ROTATION_DURATION = 1000;

/**
 * Size mappings for spinner icon dimensions
 */
export const SPINNER_SIZE_MAP = {
  sm: 16,
  md: 24,
  lg: 32,
} as const;

/**
 * Default entering animation configuration for spinner indicator
 */
export const DEFAULT_SPINNER_INDICATOR_ENTERING = FadeIn.duration(200).easing(
  Easing.out(Easing.ease),
);

/**
 * Default exiting animation configuration for spinner indicator
 */
export const DEFAULT_SPINNER_INDICATOR_EXITING = FadeOut.duration(100);

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Base spinner size variants
 */
export type SpinnerSize = "sm" | "md" | "lg";

/**
 * Base spinner color variants
 */
export type SpinnerColor = "default" | "success" | "warning" | "danger";

/**
 * Animation configuration for spinner root component
 */
export type SpinnerRootAnimation = AnimationRoot<{
  entering?: AnimationValue<{
    /**
     * Custom entering animation for spinner root
     */
    value?: EntryOrExitLayoutType;
  }>;
  exiting?: AnimationValue<{
    /**
     * Custom exiting animation for spinner root
     */
    value?: EntryOrExitLayoutType;
  }>;
}>;

/**
 * Props for the main Spinner component
 */
export interface SpinnerProps extends AnimatedProps<ViewProps> {
  /** Content to render inside the spinner */
  children?: React.ReactNode;

  /** Size of the spinner @default 'md' */
  size?: SpinnerSize;

  /** Color theme of the spinner @default 'default' */
  color?: SpinnerColor | (string & {});

  /** Whether the spinner is loading @default true */
  isLoading?: boolean;

  /** Custom class name for the spinner */
  className?: string;

  /**
   * Animation configuration for spinner root
   * - `"disable-all"`: Disable all animations including children
   * - `false` or `"disabled"`: Disable only root animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: SpinnerRootAnimation;
}

/**
 * Props for icon component
 */
export interface SpinnerIconProps {
  /** Width of the icon */
  width?: number | string;

  /** Height of the icon */
  height?: number | string;

  /** Color of the icon */
  color?: string;
}

/**
 * Animation configuration for spinner indicator component
 */
export type SpinnerIndicatorAnimation = Animation<{
  rotation?: AnimationValue<{
    /**
     * Rotation speed multiplier
     * @default 1.1
     */
    speed?: number;
    /**
     * Animation easing configuration
     * @default Easing.linear
     */
    easing?: WithTimingConfig["easing"];
  }>;
}>;

/**
 * Props for the SpinnerIndicator component
 */
export interface SpinnerIndicatorProps extends AnimatedProps<ViewProps> {
  /** Content to render inside the indicator */
  children?: React.ReactNode;

  /** Props for the default icon */
  iconProps?: SpinnerIconProps;

  /** Custom class name for the indicator element */
  className?: string;

  /**
   * Animation configuration for spinner indicator
   */
  animation?: SpinnerIndicatorAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Context value for spinner components
 */
export interface SpinnerContextValue {
  /** Size of the spinner */
  size: SpinnerSize;

  /** Color of the spinner */
  color: SpinnerColor | string;

  /** Whether the spinner is loading */
  isLoading: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "items-center justify-center",
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const indicator = tv({
  base: "size-full items-center justify-center",
});

export const spinnerClassNames = combineStyles({
  root,
  indicator,
});

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const AnimatedRoot = Animated.createAnimatedComponent(ActivityIndicatorPrimitives.Root);

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicatorPrimitives.Indicator);

const [SpinnerProvider, useSpinnerContext] = createContext<SpinnerContextValue>({
  name: "SpinnerContext",
});

/* -------------------------------------------------------------------------------------------------
 * Spinner.Root
 * -----------------------------------------------------------------------------------------------*/
const SpinnerRoot = forwardRef<View, SpinnerProps>((props, ref) => {
  const {
    children,
    size = "md",
    color = "default",
    isLoading = true,
    className,
    animation,
    ...restProps
  } = props;

  const rootClassName = spinnerClassNames.root({
    size,
    className,
  });

  const { entering, exiting, isAllAnimationsDisabled } = useSpinnerRootAnimation({
    animation,
  });

  const indicatorElement = useMemo(
    () => getElementWithDefault(children, DISPLAY_NAME.INDICATOR, <SpinnerIndicator />),
    [children],
  );

  const contextValue = useMemo(
    () => ({
      size,
      color,
      isLoading,
    }),
    [size, color, isLoading],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <SpinnerProvider value={contextValue}>
        <AnimatedRoot
          ref={ref}
          entering={entering}
          exiting={exiting}
          isLoading={isLoading}
          className={rootClassName}
          {...restProps}
        >
          {children || indicatorElement}
        </AnimatedRoot>
      </SpinnerProvider>
    </AnimationSettingsProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Spinner.Indicator
 * -----------------------------------------------------------------------------------------------*/
const SpinnerIndicator = forwardRef<View, SpinnerIndicatorProps>((props, ref) => {
  const {
    children,
    className,
    style,
    iconProps,
    animation,
    isAnimatedStyleActive = true,
    ...restProps
  } = props;

  const { size, color, isLoading } = useSpinnerContext();

  const [themeColorAccent, themeColorSuccess, themeColorWarning, themeColorDanger] = useThemeColor([
    "accent",
    "success",
    "warning",
    "danger",
  ]);

  const indicatorClassName = spinnerClassNames.indicator({
    className,
  });

  const iconSize = SPINNER_SIZE_MAP[size];

  const colorMap: Record<string, string> = {
    default: themeColorAccent,
    success: themeColorSuccess,
    warning: themeColorWarning,
    danger: themeColorDanger,
  };

  const iconColor = colorMap[color] || color;

  const { rContainerStyle } = useSpinnerIndicatorAnimation({
    animation,
    isLoading,
  });

  const indicatorStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

  if (!isLoading) {
    return null;
  }

  return (
    <AnimatedIndicator
      ref={ref}
      className={indicatorClassName}
      style={indicatorStyle}
      {...restProps}
    >
      {children || (
        <SpinnerIcon
          width={iconProps?.width ?? iconSize}
          height={iconProps?.height ?? iconSize}
          color={iconProps?.color ?? iconColor}
        />
      )}
    </AnimatedIndicator>
  );
});

// --------------------------------------------------

SpinnerRoot.displayName = DISPLAY_NAME.ROOT;
SpinnerIndicator.displayName = DISPLAY_NAME.INDICATOR;

/**
 * Compound Spinner component with sub-components
 *
 * @component Spinner - Main container that controls loading state, size, and color.
 * @component Spinner.Indicator - Optional sub-component for customizing animation configuration.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/spinner
 */
const Spinner = Object.assign(SpinnerRoot, {
  /** @optional Customize animation configuration and icon appearance */
  Indicator: SpinnerIndicator,
});

export { Spinner, useSpinnerContext };
export default Spinner;
