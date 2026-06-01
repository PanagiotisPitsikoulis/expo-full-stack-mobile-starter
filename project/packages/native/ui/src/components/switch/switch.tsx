import { forwardRef, useCallback, useMemo } from "react";
import {
  type GestureResponderEvent,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  type AnimatedProps,
  Easing,
  type SharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";

import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type { Animation, AnimationRoot, AnimationValue } from "../../helpers/internal/types";
import { combineStyles, createContext } from "../../helpers/internal/utils";
import * as SwitchPrimitives from "../../primitives/switch";
import type * as SwitchPrimitivesTypes from "../../primitives/switch/switch.types";
import {
  SwitchAnimationProvider,
  useSwitchRootAnimation,
  useSwitchThumbAnimation,
} from "./switch.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  SWITCH_ROOT: "PitsiUINative.Switch.Root",
  SWITCH_THUMB: "PitsiUINative.Switch.Thumb",
  SWITCH_START_CONTENT: "PitsiUINative.Switch.StartContent",
  SWITCH_END_CONTENT: "PitsiUINative.Switch.EndContent",
} as const;

export const ANIMATION_DURATION = 175;
export const ANIMATION_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

export const DEFAULT_TIMING_CONFIG = {
  duration: ANIMATION_DURATION,
  easing: ANIMATION_EASING,
};

export const DEFAULT_SPRING_CONFIG = {
  damping: 120,
  stiffness: 1600,
  mass: 2,
};

export const DEFAULT_THUMB_WIDTH = 28;

export const DEFAULT_THUMB_LEFT = 2;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Render function props for switch children
 */
export interface SwitchRenderProps {
  /** Whether the switch is selected */
  isSelected?: boolean;
  /** Whether the switch is disabled */
  isDisabled: boolean;
}

/**
 * Animation configuration for switch root component
 */
export type SwitchRootAnimation = AnimationRoot<{
  scale?: AnimationValue<{
    value?: [number, number];
    timingConfig?: WithTimingConfig;
  }>;
  backgroundColor?: AnimationValue<{
    value?: [string, string];
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Props for the main Switch component
 */
export interface SwitchProps extends Omit<SwitchPrimitivesTypes.RootProps, "children"> {
  children?: React.ReactNode | ((props: SwitchRenderProps) => React.ReactNode);
  isDisabled?: boolean;
  className?: string;
  animation?: SwitchRootAnimation;
  isAnimatedStyleActive?: boolean;
  /**
   * Tint color used by the native iOS Toggle (SwiftUI). Accepts any hex/rgb/named
   * color string. Ignored on platforms that fall back to the animated implementation.
   */
  tint?: string;
}

/**
 * Animation configuration for switch thumb component
 */
export type SwitchThumbAnimation = Animation<{
  left?: AnimationValue<{
    value?: number;
    springConfig?: WithSpringConfig;
  }>;
  backgroundColor?: AnimationValue<{
    value?: [string, string];
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Props for the SwitchThumb component
 */
export interface SwitchThumbProps
  extends Omit<AnimatedProps<SwitchPrimitivesTypes.ThumbProps>, "children"> {
  children?: React.ReactNode | ((props: SwitchRenderProps) => React.ReactNode);
  className?: string;
  animation?: SwitchThumbAnimation;
  isAnimatedStyleActive?: boolean;
}

/**
 * Props for the SwitchContent component
 */
export interface SwitchContentProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Context value for switch components
 */
export interface SwitchContextValue extends Pick<SwitchProps, "isSelected" | "isDisabled"> {}

/**
 * Context value for switch animation state
 */
export interface SwitchAnimationContextValue {
  isSwitchPressed: SharedValue<boolean>;
  contentContainerWidth: SharedValue<number>;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "w-[48px] h-[24px] rounded-full justify-center overflow-hidden",
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

const thumb = tv({
  base: "absolute left-[2px] items-center justify-center w-[28px] h-[20px] rounded-full shadow-field overflow-hidden",
});

const startContent = tv({
  base: "absolute left-[2px]",
});

const endContent = tv({
  base: "absolute right-[2px]",
});

export const switchClassNames = combineStyles({
  root,
  thumb,
  startContent,
  endContent,
});

export const switchStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const AnimatedSwitchRoot = Animated.createAnimatedComponent(SwitchPrimitives.Root);

const AnimatedSwitchThumb = Animated.createAnimatedComponent(SwitchPrimitives.Thumb);

const [SwitchProvider, useSwitch] = createContext<SwitchContextValue>({
  name: "SwitchContext",
});

const IosToggleSwitch: React.ComponentType<
  Pick<SwitchProps, "isSelected" | "onSelectedChange" | "isDisabled" | "tint">
> | null = Platform.OS === "ios" ? require("./switch.expo-ui").IosToggleSwitch : null;

/* -------------------------------------------------------------------------------------------------
 * Switch.Root
 * -----------------------------------------------------------------------------------------------*/
const Switch = forwardRef<SwitchPrimitivesTypes.RootRef, SwitchProps>((props, ref) => {
  const {
    children,
    isDisabled,
    isSelected,
    onSelectedChange,
    className,
    style,
    animation,
    isAnimatedStyleActive = true,
    onPressIn,
    onPressOut,
    tint,
    ...restProps
  } = props;

  if (IosToggleSwitch) {
    return (
      <IosToggleSwitch
        isSelected={isSelected}
        onSelectedChange={onSelectedChange}
        isDisabled={isDisabled}
        tint={tint}
      />
    );
  }

  const rootClassName = switchClassNames.root({
    isDisabled,
    className,
  });

  const { rContainerStyle, isSwitchPressed, contentContainerWidth, isAllAnimationsDisabled } =
    useSwitchRootAnimation({
      animation,
      isSelected,
    });

  const rootStyle = isAnimatedStyleActive
    ? [switchStyleSheet.borderCurve, rContainerStyle, style]
    : [switchStyleSheet.borderCurve, style];

  const contextValue = useMemo(
    () => ({
      isSelected,
      isDisabled,
    }),
    [isSelected, isDisabled],
  );

  const animationContextValue = useMemo(
    () => ({
      isSwitchPressed,
      contentContainerWidth,
    }),
    [isSwitchPressed, contentContainerWidth],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      isSwitchPressed.set(true);
      onPressIn?.(event);
    },
    [isSwitchPressed, onPressIn],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      isSwitchPressed.set(false);
      onPressOut?.(event);
    },
    [isSwitchPressed, onPressOut],
  );

  const renderProps: SwitchRenderProps = {
    isSelected,
    isDisabled: isDisabled ?? false,
  };

  const content =
    typeof children === "function" ? children(renderProps) : (children ?? <SwitchThumb />);

  return (
    <SwitchProvider value={contextValue}>
      <AnimationSettingsProvider value={animationSettingsContextValue}>
        <SwitchAnimationProvider value={animationContextValue}>
          <AnimatedSwitchRoot
            ref={ref}
            className={rootClassName}
            style={rootStyle}
            isSelected={isSelected}
            onSelectedChange={onSelectedChange}
            isDisabled={isDisabled}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onLayout={(e) => {
              contentContainerWidth.set(e.nativeEvent.layout.width);
            }}
            {...restProps}
          >
            {content}
          </AnimatedSwitchRoot>
        </SwitchAnimationProvider>
      </AnimationSettingsProvider>
    </SwitchProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Switch.Thumb
 * -----------------------------------------------------------------------------------------------*/
const SwitchThumb = forwardRef<SwitchPrimitivesTypes.ThumbRef, SwitchThumbProps>((props, ref) => {
  const {
    children,
    className,
    style,
    animation,
    isAnimatedStyleActive = true,
    ...restProps
  } = props;

  const { isSelected, isDisabled } = useSwitch();

  const thumbClassName = switchClassNames.thumb({
    className,
  });

  const { rContainerStyle } = useSwitchThumbAnimation({
    animation,
    style: style as ViewStyle | undefined,
    className: thumbClassName,
    isSelected,
  });

  const thumbStyle = isAnimatedStyleActive
    ? [switchStyleSheet.borderCurve, rContainerStyle, style]
    : [switchStyleSheet.borderCurve, style];

  const renderProps: SwitchRenderProps = {
    isSelected,
    isDisabled: isDisabled ?? false,
  };

  const content = typeof children === "function" ? children(renderProps) : children;

  return (
    <AnimatedSwitchThumb ref={ref} className={thumbClassName} style={thumbStyle} {...restProps}>
      {content}
    </AnimatedSwitchThumb>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Switch.StartContent
 * -----------------------------------------------------------------------------------------------*/
const SwitchStartContent = forwardRef<View, SwitchContentProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const startContentClassName = switchClassNames.startContent({
    className,
  });

  return (
    <View ref={ref} className={startContentClassName} {...restProps}>
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Switch.EndContent
 * -----------------------------------------------------------------------------------------------*/
const SwitchEndContent = forwardRef<View, SwitchContentProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const endContentClassName = switchClassNames.endContent({
    className,
  });

  return (
    <View ref={ref} className={endContentClassName} {...restProps}>
      {children}
    </View>
  );
});

// --------------------------------------------------

Switch.displayName = DISPLAY_NAME.SWITCH_ROOT;
SwitchThumb.displayName = DISPLAY_NAME.SWITCH_THUMB;
SwitchStartContent.displayName = DISPLAY_NAME.SWITCH_START_CONTENT;
SwitchEndContent.displayName = DISPLAY_NAME.SWITCH_END_CONTENT;

/**
 * Compound Switch component with sub-components
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/switch
 */
const CompoundSwitch = Object.assign(Switch, {
  /** @optional Sliding thumb with spring animations */
  Thumb: SwitchThumb,
  /** @optional Content shown when switch is off (left side) */
  StartContent: SwitchStartContent,
  /** @optional Content shown when switch is on (right side) */
  EndContent: SwitchEndContent,
});

export { CompoundSwitch as Switch, useSwitch };
export default CompoundSwitch;
