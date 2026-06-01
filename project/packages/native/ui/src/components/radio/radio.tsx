/**
 * Display names for Radio components
 */

// --------------------------------------------------
import { forwardRef, useMemo } from "react";
import type { ViewProps } from "react-native";
import { StyleSheet, type View } from "react-native";
import type { AnimatedProps, WithTimingConfig } from "react-native-reanimated";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { useIsOnSurface } from "../../helpers/external/hooks";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type {
  Animation,
  AnimationRootDisableAll,
  AnimationValue,
} from "../../helpers/internal/types";
import {
  combineStyles,
  getAnimationState,
  getAnimationValueMergedConfig,
  getAnimationValueProperty,
  getIsAnimationDisabledValue,
} from "../../helpers/internal/utils";
import type { RootProps as RadioPrimitiveRootProps } from "../../primitives/radio";
import * as RadioPrimitives from "../../primitives/radio";
import { useRadioGroupItem } from "../radio-group";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  RADIO_ROOT: "PitsiUINative.Radio.Root",
  RADIO_INDICATOR: "PitsiUINative.Radio.Indicator",
  RADIO_INDICATOR_THUMB: "PitsiUINative.Radio.IndicatorThumb",
} as const;

/** Default hit slop for the pressable area */
export const DEFAULT_HIT_SLOP = 6;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Render function props for Radio children
 */
export interface RadioRenderProps {
  /** Whether the radio is selected */
  isSelected: boolean;
  /** Whether the radio is disabled */
  isDisabled: boolean;
  /** Whether the radio is invalid */
  isInvalid: boolean;
}

/**
 * Props for the Radio root component.
 *
 * Works in two modes:
 * - **Standalone**: Uses `isSelected` / `onSelectedChange` directly.
 * - **Inside RadioGroup**: Uses `value` prop; `isSelected` is derived from group context.
 */
export interface RadioProps extends Omit<RadioPrimitiveRootProps, "children"> {
  /** Radio content, or a render function */
  children?: React.ReactNode | ((props: RadioRenderProps) => React.ReactNode);
  /** Custom class name */
  className?: string;
  /**
   * Animation configuration for radio
   * - `"disable-all"`: Disable all animations including children (Indicator, IndicatorThumb)
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Props for Radio.Indicator component
 */
export interface RadioIndicatorProps extends AnimatedProps<ViewProps> {
  /** Indicator content */
  children?: React.ReactNode;
  /** Custom class name */
  className?: string;
}

/**
 * Animation configuration for RadioIndicatorThumb component
 */
export type RadioIndicatorThumbAnimation = Animation<{
  scale?: AnimationValue<{
    /**
     * Scale values [unselected, selected]
     * @default [1.5, 1]
     */
    value?: [number, number];
    /**
     * Animation timing configuration
     * @default { duration: 300, easing: Easing.out(Easing.ease) }
     */
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Props for Radio.IndicatorThumb component
 */
export interface RadioIndicatorThumbProps extends Omit<AnimatedProps<ViewProps>, "children"> {
  /** Custom class name
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `transform` (specifically `scale`) - Animated for selection transitions (unselected: 1.5, selected: 1)
   *
   * To customize this property, use the `animation` prop:
   * ```tsx
   * <Radio.IndicatorThumb
   *   animation={{
   *     scale: { value: [1.5, 1], timingConfig: { duration: 300, easing: Easing.out(Easing.ease) } }
   *   }}
   * />
   * ```
   *
   * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
   */
  className?: string;
  /**
   * Animation configuration
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: RadioIndicatorThumbAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
/** Root item layout style */
const root = tv({
  base: "flex-row items-center justify-between gap-3",
});

/** Indicator container style (the radio circle) */
const indicator = tv({
  base: "size-6 rounded-full border border-field-border items-center justify-center overflow-hidden",
  variants: {
    variant: {
      primary: "bg-field shadow-field",
      secondary: "bg-default",
    },
    isSelected: {
      true: "bg-accent",
      false: "",
    },
    isInvalid: {
      true: "bg-transparent border-danger",
      false: "",
    },
  },
  compoundVariants: [
    {
      isInvalid: true,
      isSelected: true,
      className: "bg-danger border-danger",
    },
  ],
  defaultVariants: {
    variant: "primary",
    isSelected: false,
    isInvalid: false,
  },
});

/**
 * Indicator thumb style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property is animated and cannot be overridden using Tailwind classes:
 * - `transform` (specifically `scale`) - Animated for selection transitions (unselected: 1.5, selected: 1)
 *
 * To customize this property, use the `animation` prop on `Radio.IndicatorThumb`:
 * ```tsx
 * <Radio.IndicatorThumb
 *   animation={{
 *     scale: { value: [1.5, 1], timingConfig: { duration: 300, easing: Easing.out(Easing.ease) } }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Radio.IndicatorThumb`.
 */
const indicatorThumb = tv({
  base: "size-2.5 rounded-full bg-accent-foreground shadow-field",
  variants: {
    isSelected: {
      true: "opacity-100",
      false: "opacity-0",
    },
  },
});

export const radioClassNames = combineStyles({
  root,
  indicator,
  indicatorThumb,
});

export const radioStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation hook for Radio root component.
 * Handles cascading animation disabled state to child components (Indicator, IndicatorThumb).
 */
export function useRadioRootAnimation(options: { animation: AnimationRootDisableAll | undefined }) {
  const { animation } = options;

  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);

  return {
    isAllAnimationsDisabled,
  };
}

// --------------------------------------------------

/**
 * Animation hook for Radio.IndicatorThumb component.
 * Handles scale animation based on selection state.
 */
export function useRadioIndicatorThumbAnimation(options: {
  animation: RadioIndicatorThumbAnimation | undefined;
  isSelected: boolean | undefined;
}) {
  const { animation, isSelected } = options;

  // Read from global animation context (always available in compound parts)
  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { animationConfig, isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  // Scale animation
  const scaleValue = getAnimationValueProperty({
    animationValue: animationConfig?.scale,
    property: "value",
    defaultValue: [1.5, 1] as [number, number],
  });

  const scaleTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.scale,
    property: "timingConfig",
    defaultValue: { duration: 300, easing: Easing.out(Easing.ease) },
  });

  const rContainerStyle = useAnimatedStyle(() => {
    if (isAnimationDisabledValue) {
      return {
        transform: [
          {
            scale: scaleValue[1],
          },
        ],
      };
    }

    return {
      transform: [
        {
          scale: withTiming(isSelected ? scaleValue[1] : scaleValue[0], scaleTimingConfig),
        },
      ],
    };
  });

  return {
    rContainerStyle,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Components
 * -----------------------------------------------------------------------------------------------*/
const useRadio = RadioPrimitives.useRadioContext;

const AnimatedRadioIndicator = Animated.createAnimatedComponent(RadioPrimitives.Indicator);

// --------------------------------------------------

/**
 * Radio root component.
 *
 * Operates in two modes:
 * - **Standalone**: Renders a Pressable trigger with `isSelected`/`onSelectedChange`.
 * - **Inside RadioGroupItem**: Detects parent context automatically, derives state from
 *   the RadioGroupItem, and pressing selects this item in the group.
 */
const RadioRoot = forwardRef<RadioPrimitives.RootRef, RadioProps>((props, ref) => {
  const {
    children,
    isSelected: isSelectedProp,
    onSelectedChange: onSelectedChangeProp,
    isDisabled: isDisabledProp,
    isInvalid: isInvalidProp,
    variant: variantProp,
    className,
    animation,
    ...restProps
  } = props;

  // Detect RadioGroupItem context (non-strict: returns undefined outside a group)
  const radioGroupItemContext = useRadioGroupItem();

  // Merge props with RadioGroupItem context (explicit props take precedence)
  const isSelected = isSelectedProp ?? radioGroupItemContext?.isSelected;
  const isDisabled = isDisabledProp ?? radioGroupItemContext?.isDisabled;
  const isInvalid = isInvalidProp ?? radioGroupItemContext?.isInvalid;
  const onSelectedChange = onSelectedChangeProp ?? radioGroupItemContext?.onSelectedChange;

  const isOnSurfaceAutoDetected = useIsOnSurface();
  const finalVariant =
    variantProp !== undefined
      ? variantProp
      : radioGroupItemContext?.variant !== undefined
        ? radioGroupItemContext.variant
        : isOnSurfaceAutoDetected
          ? "secondary"
          : "primary";

  const rootClassName = radioClassNames.root({
    className,
  });

  const renderProps: RadioRenderProps = {
    isSelected: isSelected ?? false,
    isDisabled: isDisabled ?? false,
    isInvalid: isInvalid ?? false,
  };

  const content =
    typeof children === "function" ? children(renderProps) : (children ?? <RadioIndicator />);

  const { isAllAnimationsDisabled } = useRadioRootAnimation({
    animation,
  });

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <RadioPrimitives.Root
        ref={ref}
        variant={finalVariant}
        className={rootClassName}
        isSelected={isSelected}
        onSelectedChange={onSelectedChange}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        hitSlop={props.hitSlop ?? DEFAULT_HIT_SLOP}
        {...restProps}
      >
        {content}
      </RadioPrimitives.Root>
    </AnimationSettingsProvider>
  );
});

// --------------------------------------------------

const RadioIndicator = forwardRef<Animated.View, RadioIndicatorProps>((props, ref) => {
  const { children, className, style, ...restProps } = props;

  const { isSelected, isInvalid, variant } = useRadio();

  const indicatorClassName = radioClassNames.indicator({
    variant,
    isSelected,
    isInvalid,
    className,
  });

  return (
    <AnimatedRadioIndicator
      ref={ref}
      className={indicatorClassName}
      style={[radioStyleSheet.borderCurve, style]}
      {...restProps}
    >
      {children ?? <RadioIndicatorThumb />}
    </AnimatedRadioIndicator>
  );
});

// --------------------------------------------------

const RadioIndicatorThumb = forwardRef<View, RadioIndicatorThumbProps>((props, ref) => {
  const { className, style, animation, isAnimatedStyleActive = true, ...restProps } = props;

  const { isSelected } = useRadio();

  const thumbClassName = radioClassNames.indicatorThumb({
    isSelected,
    className,
  });

  const { rContainerStyle } = useRadioIndicatorThumbAnimation({
    animation,
    isSelected,
  });

  const thumbStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

  return <Animated.View ref={ref} className={thumbClassName} style={thumbStyle} {...restProps} />;
});

// --------------------------------------------------

RadioRoot.displayName = DISPLAY_NAME.RADIO_ROOT;
RadioIndicator.displayName = DISPLAY_NAME.RADIO_INDICATOR;
RadioIndicatorThumb.displayName = DISPLAY_NAME.RADIO_INDICATOR_THUMB;

/**
 * Compound Radio component with sub-components.
 *
 * @component Radio - Individual radio option that operates in two modes:
 * - **Standalone**: Uses `isSelected`/`onSelectedChange` directly.
 * - **Inside RadioGroupItem**: Automatically detects the parent context, derives
 *   `isSelected`/`isDisabled`/`isInvalid`/`variant` from it. Pressing selects this
 *   item in the group via the group's `onValueChange`.
 *
 * Renders a default indicator if no children are provided. Supports render function
 * children to access state (`isSelected`, `isInvalid`, `isDisabled`).
 *
 * @component Radio.Indicator - Optional container for the radio circle. Renders default thumb
 * if no children provided. Manages the visual selection state.
 *
 * @component Radio.IndicatorThumb - Optional inner circle that appears when selected. Animates
 * scale based on selection. Can be replaced with custom content.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/radio
 */
const CompoundRadio = Object.assign(RadioRoot, {
  /** @optional Custom radio indicator container */
  Indicator: RadioIndicator,
  /** @optional Custom indicator thumb that appears when selected */
  IndicatorThumb: RadioIndicatorThumb,
});

export { useRadio };
export default CompoundRadio;
