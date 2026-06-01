import { forwardRef, useEffect, useMemo } from "react";
import { StyleSheet, type TextProps, type ViewProps } from "react-native";
import Animated, {
  Easing,
  type EntryOrExitLayoutType,
  FadeIn,
  FadeOut,
  FlipInXDown,
  FlipOutXDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { useIsOnSurface } from "../../helpers/external/hooks";
import { HeroText } from "../../helpers/internal/components";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type {
  Animation,
  AnimationRootDisableAll,
  AnimationValue,
  TextRef,
  ViewRef,
} from "../../helpers/internal/types";
import {
  combineStyles,
  createContext,
  getAnimationState,
  getAnimationValueProperty,
  getIsAnimationDisabledValue,
} from "../../helpers/internal/utils";
import * as InputOTPPrimitives from "../../primitives/input-otp";
import type * as InputOTPPrimitivesTypes from "../../primitives/input-otp/input-otp.types";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for InputOTP components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.InputOTP.Root",
  GROUP: "PitsiUINative.InputOTP.Group",
  SLOT: "PitsiUINative.InputOTP.Slot",
  SLOT_PLACEHOLDER: "PitsiUINative.InputOTP.SlotPlaceholder",
  SLOT_VALUE: "PitsiUINative.InputOTP.SlotValue",
  SLOT_CARET: "PitsiUINative.InputOTP.SlotCaret",
  SEPARATOR: "PitsiUINative.InputOTP.Separator",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Render function props for InputOTP.Group children
 */
export interface InputOTPGroupRenderProps {
  /** Array of slot data for each position */
  slots: InputOTPPrimitivesTypes.SlotData[];
  /** Maximum length of the OTP */
  maxLength: number;
  /** Current OTP value */
  value: string;
  /** Whether the input is currently focused */
  isFocused: boolean;
  /** Whether the input is disabled */
  isDisabled: boolean;
  /** Whether the input is in an invalid state */
  isInvalid: boolean;
}

/**
 * Props for the InputOTP.Root component
 * Extends the primitive RootProps
 */
export interface InputOTPRootProps extends InputOTPPrimitivesTypes.RootProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Animation configuration for InputOTP
   * - `"disable-all"`: Disable all animations including children
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Ref type for InputOTP.Root component
 */
export type InputOTPRef = InputOTPPrimitivesTypes.RootRef;

/**
 * Props for the InputOTP.Group component
 * Extends the primitive GroupProps
 */
export interface InputOTPGroupProps extends Omit<InputOTPPrimitivesTypes.GroupProps, "children"> {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Children elements to be rendered inside the group, or a render function
   * that receives slot data and other context values
   */
  children?: React.ReactNode | ((props: InputOTPGroupRenderProps) => React.ReactNode);
}

/**
 * Ref type for InputOTP.Group component
 */
export type InputOTPGroupRef = InputOTPPrimitivesTypes.GroupRef;

/**
 * Props for the InputOTP.Slot component
 * Extends the primitive SlotProps
 */
export interface InputOTPSlotProps extends InputOTPPrimitivesTypes.SlotProps {
  /**
   * Variant style for the slot
   * @default 'primary'
   */
  variant?: "primary" | "secondary";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Ref type for InputOTP.Slot component
 */
export type InputOTPSlotRef = InputOTPPrimitivesTypes.SlotRef;

/**
 * Context value for InputOTP.Slot component
 */
export interface InputOTPSlotContextValue {
  /** Slot data for the current slot */
  slot: InputOTPPrimitivesTypes.SlotData | undefined;
  /** Whether this slot is currently active (where cursor is) */
  isActive: boolean;
  /** Whether to show fake caret (when active but empty) */
  isCaretVisible: boolean;
  /** Variant style for the slot */
  variant?: "primary" | "secondary";
}

/**
 * Props for the InputOTP.SlotPlaceholder component
 */
export interface InputOTPSlotPlaceholderProps extends TextProps {
  /**
   * Text content to display (optional, defaults to slot.placeholderChar)
   */
  children?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Ref type for InputOTP.SlotPlaceholder component
 */
export type InputOTPSlotPlaceholderRef = TextRef;

/**
 * Animation configuration for InputOTP.SlotValue component
 */
export type InputOTPSlotValueAnimation = Animation<{
  /**
   * Wrapper animation configuration (fade in/out for the container)
   */
  wrapper?: AnimationValue<{
    /**
     * Entering animation for wrapper
     * @default FadeIn.duration(250)
     */
    entering?: EntryOrExitLayoutType;
    /**
     * Exiting animation for wrapper
     * @default FadeOut.duration(100)
     */
    exiting?: EntryOrExitLayoutType;
  }>;
  /**
   * Text animation configuration (flip animations for the text)
   */
  text?: AnimationValue<{
    /**
     * Entering animation for text
     * @default FlipInXDown.duration(250).easing(...)
     */
    entering?: EntryOrExitLayoutType;
    /**
     * Exiting animation for text
     * @default FlipOutXDown.duration(250).easing(...)
     */
    exiting?: EntryOrExitLayoutType;
  }>;
}>;

/**
 * Props for the InputOTP.SlotValue component
 */
export interface InputOTPSlotValueProps extends TextProps {
  /**
   * Text content to display (optional, defaults to slot.char)
   */
  children?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Animation configuration for SlotValue
   * Controls both wrapper (fade) and text (flip) animations
   */
  animation?: InputOTPSlotValueAnimation;
}

/**
 * Ref type for InputOTP.SlotValue component
 */
export type InputOTPSlotValueRef = TextRef;

/**
 * Animation configuration for InputOTP.SlotCaret component
 */
export type InputOTPSlotCaretAnimation = Animation<{
  /**
   * Opacity animation configuration
   */
  opacity?: AnimationValue<{
    /**
     * Opacity values [min, max]
     * @default [0, 1]
     */
    value?: [number, number];
    /**
     * Animation duration in milliseconds
     * @default 500
     */
    duration?: number;
  }>;
  /**
   * Height animation configuration
   */
  height?: AnimationValue<{
    /**
     * Height values [min, max]
     * @default [16, 18]
     */
    value?: [number, number];
    /**
     * Animation duration in milliseconds
     * @default 500
     */
    duration?: number;
  }>;
}>;

/**
 * Props for the InputOTP.SlotCaret component
 */
export interface InputOTPSlotCaretProps extends ViewProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Animation configuration for SlotCaret
   */
  animation?: InputOTPSlotCaretAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Ref type for InputOTP.SlotCaret component
 */
export type InputOTPSlotCaretRef = ViewRef;

/**
 * Props for the InputOTP.Separator component
 * Extends the primitive SeparatorProps
 */
export interface InputOTPSeparatorProps extends InputOTPPrimitivesTypes.SeparatorProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Ref type for InputOTP.Separator component
 */
export type InputOTPSeparatorRef = InputOTPPrimitivesTypes.SeparatorRef;

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "flex-row items-center gap-2",
});

const group = tv({
  base: "flex-row items-center gap-2",
});

const slot = tv({
  base: "h-12 w-11 items-center justify-center rounded-xl border-[1.5px] overflow-hidden",
  variants: {
    variant: {
      primary: "bg-field border-field-border shadow-field",
      secondary: "bg-default border-default",
    },
    isActive: {
      true: "border-accent",
    },
    isInvalid: {
      true: "border-danger",
    },
    isDisabled: {
      true: "opacity-disabled pointer-events-none",
    },
  },
  defaultVariants: {
    variant: "primary",
    isActive: false,
    isInvalid: false,
    isDisabled: false,
  },
});

const slotPlaceholder = tv({
  base: "text-lg font-semibold text-field-placeholder/50",
});

const slotValue = tv({
  base: "text-lg font-semibold text-foreground",
});

const slotCaret = tv({
  base: "absolute w-0.5 rounded-full bg-field-placeholder",
});

const separator = tv({
  base: "h-0.5 w-2 rounded-full bg-separator/50",
});

export const inputOTPClassNames = combineStyles({
  root,
  group,
  slot,
  slotPlaceholder,
  slotValue,
  slotCaret,
  separator,
});

export const inputOTPStyleSheet = StyleSheet.create({
  slotRoot: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Utils (animation hooks)
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation hook for InputOTP root component
 * Handles root-level animation configuration and provides context for child components
 */
export function useInputOTPRootAnimation(options: {
  animation: AnimationRootDisableAll | undefined;
}) {
  const { animation } = options;

  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);

  return {
    isAllAnimationsDisabled,
  };
}

/**
 * Animation hook for InputOTP.SlotCaret component
 * Handles opacity and height animations for the caret indicator
 */
export function useInputOTPSlotCaretAnimation(options: {
  animation: InputOTPSlotCaretAnimation | undefined;
}) {
  const { animation } = options;

  // Read from global animation context (always available in compound parts)
  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { animationConfig, isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  // Opacity animation configuration
  const opacityValue = getAnimationValueProperty({
    animationValue: animationConfig?.opacity,
    property: "value",
    defaultValue: [0, 1] as [number, number],
  });

  const opacityDuration = getAnimationValueProperty({
    animationValue: animationConfig?.opacity,
    property: "duration",
    defaultValue: 500,
  });

  // Height animation configuration
  const heightValue = getAnimationValueProperty({
    animationValue: animationConfig?.height,
    property: "value",
    defaultValue: [16, 18] as [number, number],
  });

  const heightDuration = getAnimationValueProperty({
    animationValue: animationConfig?.height,
    property: "duration",
    defaultValue: 500,
  });

  const opacity = useSharedValue(opacityValue[1]);
  const height = useSharedValue(heightValue[1]);

  useEffect(() => {
    if (isAnimationDisabledValue) {
      opacity.set(opacityValue[1]);
      height.set(heightValue[1]);
      return;
    }

    opacity.set(
      withRepeat(
        withSequence(
          withTiming(opacityValue[0], { duration: opacityDuration }),
          withTiming(opacityValue[1], { duration: opacityDuration }),
        ),
        -1,
        true,
      ),
    );

    height.set(
      withRepeat(
        withSequence(
          withTiming(heightValue[0], { duration: heightDuration }),
          withTiming(heightValue[1], { duration: heightDuration }),
        ),
        -1,
        true,
      ),
    );
  }, [
    isAnimationDisabledValue,
    opacity,
    height,
    opacityValue,
    opacityDuration,
    heightValue,
    heightDuration,
  ]);

  const rContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    height: height.get(),
  }));

  return {
    rContainerStyle,
  };
}

/**
 * Animation hook for InputOTP.SlotValue component
 * Handles wrapper (fade) and text (flip) animations for entering/exiting
 */
export function useInputOTPSlotValueAnimation(options: {
  animation: InputOTPSlotValueAnimation | undefined;
}) {
  const { animation } = options;

  // Read from global animation context (always available in compound parts)
  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { animationConfig, isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  // Wrapper animation configuration (fade)
  const wrapperEntering = getAnimationValueProperty({
    animationValue: animationConfig?.wrapper,
    property: "entering",
    defaultValue: FadeIn.duration(250),
  });

  const wrapperExiting = getAnimationValueProperty({
    animationValue: animationConfig?.wrapper,
    property: "exiting",
    defaultValue: FadeOut.duration(100),
  });

  // Text animation configuration (flip)
  const textEntering = getAnimationValueProperty({
    animationValue: animationConfig?.text,
    property: "entering",
    defaultValue: FlipInXDown.duration(250)
      .delay(0)
      .easing(Easing.bezier(0, 0.75, 0.5, 0.9).factory())
      .build(),
  });

  const textExiting = getAnimationValueProperty({
    animationValue: animationConfig?.text,
    property: "exiting",
    defaultValue: FlipOutXDown.duration(250)
      .easing(Easing.bezier(0.6, 0.1, 0.4, 0.8).factory())
      .build(),
  });

  return {
    wrapperEntering: isAnimationDisabledValue ? undefined : wrapperEntering,
    wrapperExiting: isAnimationDisabledValue ? undefined : wrapperExiting,
    textEntering: isAnimationDisabledValue ? undefined : textEntering,
    textExiting: isAnimationDisabledValue ? undefined : textExiting,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const AnimatedText = Animated.createAnimatedComponent(HeroText);

const [InputOTPSlotProvider, useInputOTPSlot] = createContext<InputOTPSlotContextValue>({
  name: "InputOTPSlotContext",
});

const useInputOTP = InputOTPPrimitives.useInputOTPContext;

const REGEXP_ONLY_CHARS = InputOTPPrimitives.REGEXP_ONLY_CHARS;
const REGEXP_ONLY_DIGITS = InputOTPPrimitives.REGEXP_ONLY_DIGITS;
const REGEXP_ONLY_DIGITS_AND_CHARS = InputOTPPrimitives.REGEXP_ONLY_DIGITS_AND_CHARS;

/* -------------------------------------------------------------------------------------------------
 * InputOTP.Root
 * -----------------------------------------------------------------------------------------------*/
const InputOTPRoot = forwardRef<InputOTPRef, InputOTPRootProps>((props, ref) => {
  const { className, animation, ...restProps } = props;

  const rootClassName = inputOTPClassNames.root({ className });

  const { isAllAnimationsDisabled } = useInputOTPRootAnimation({
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
      <InputOTPPrimitives.Root ref={ref} className={rootClassName} {...restProps} />
    </AnimationSettingsProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputOTP.Group
 * -----------------------------------------------------------------------------------------------*/
const InputOTPGroup = forwardRef<InputOTPGroupRef, InputOTPGroupProps>((props, ref) => {
  const { className, children, ...restProps } = props;

  const { slots, maxLength, value, isFocused, isDisabled, isInvalid } = useInputOTP();

  const groupClassName = inputOTPClassNames.group({ className });

  const renderProps: InputOTPGroupRenderProps = {
    slots,
    maxLength,
    value,
    isFocused,
    isDisabled,
    isInvalid,
  };

  const content = typeof children === "function" ? children(renderProps) : children;

  return (
    <InputOTPPrimitives.Group ref={ref} className={groupClassName} {...restProps}>
      {content}
    </InputOTPPrimitives.Group>
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputOTP.Slot
 * -----------------------------------------------------------------------------------------------*/
const InputOTPSlot = forwardRef<InputOTPSlotRef, InputOTPSlotProps>((props, ref) => {
  const { className, style, index, variant, children, ...restProps } = props;

  const { slots, isDisabled, isInvalid, variant: groupVariant } = useInputOTP();

  const slot = slots[index];
  const isActive = slot?.isActive ?? false;
  const isCaretVisible = slot?.isCaretVisible ?? false;

  const isOnSurfaceAutoDetected = useIsOnSurface();
  const finalVariant =
    variant !== undefined
      ? variant
      : groupVariant !== undefined
        ? groupVariant
        : isOnSurfaceAutoDetected
          ? "secondary"
          : "primary";

  const slotClassName = inputOTPClassNames.slot({
    variant: finalVariant,
    isActive,
    isInvalid,
    isDisabled,
    className,
  });

  const slotContextValue = useMemo<InputOTPSlotContextValue>(
    () => ({
      slot,
      isActive,
      isCaretVisible,
      variant: finalVariant,
    }),
    [slot, isActive, isCaretVisible, finalVariant],
  );

  return (
    <InputOTPSlotProvider value={slotContextValue}>
      <InputOTPPrimitives.Slot
        ref={ref}
        index={index}
        className={slotClassName}
        style={[inputOTPStyleSheet.slotRoot, style]}
        {...restProps}
      >
        {children !== undefined ? (
          children
        ) : (
          <>
            <InputOTPSlotPlaceholder />
            <InputOTPSlotValue />
            <InputOTPSlotCaret />
          </>
        )}
      </InputOTPPrimitives.Slot>
    </InputOTPSlotProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputOTP.SlotPlaceholder
 *
 * Component that displays the placeholder character for an InputOTP slot
 * Used when the slot is empty and should show a placeholder
 * -----------------------------------------------------------------------------------------------*/
const InputOTPSlotPlaceholder = forwardRef<
  InputOTPSlotPlaceholderRef,
  InputOTPSlotPlaceholderProps
>((props, ref) => {
  const { className, style, children, ...restProps } = props;

  const { slot, isActive } = useInputOTPSlot();
  const { placeholderTextColor, placeholderTextClassName } = useInputOTP();

  const displayChar = children ?? slot?.placeholderChar ?? "";

  if (slot?.char || isActive || !displayChar) {
    return null;
  }

  const slotPlaceholderTextStyle = placeholderTextColor
    ? { color: placeholderTextColor }
    : undefined;

  const slotPlaceholderTextClassName = placeholderTextClassName
    ? placeholderTextClassName
    : undefined;

  const slotPlaceholderClassName = inputOTPClassNames.slotPlaceholder({
    className: [slotPlaceholderTextClassName, className],
  });

  return (
    <HeroText
      ref={ref}
      className={slotPlaceholderClassName}
      style={[slotPlaceholderTextStyle, style]}
      {...restProps}
    >
      {displayChar}
    </HeroText>
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputOTP.SlotValue
 *
 * Component that displays the actual character value for an InputOTP slot
 * Used when the slot has a value and should display it with animations
 * -----------------------------------------------------------------------------------------------*/
const InputOTPSlotValue = forwardRef<InputOTPSlotValueRef, InputOTPSlotValueProps>((props, ref) => {
  const { className, children, animation, ...restProps } = props;

  const { slot } = useInputOTPSlot();

  const displayChar = children ?? slot?.char ?? "";

  const { wrapperEntering, wrapperExiting, textEntering, textExiting } =
    useInputOTPSlotValueAnimation({
      animation,
    });

  const slotValueClassName = inputOTPClassNames.slotValue({
    className,
  });

  if (!displayChar) {
    return null;
  }

  return (
    <Animated.View entering={wrapperEntering} exiting={wrapperExiting}>
      <AnimatedText
        ref={ref}
        entering={textEntering}
        exiting={textExiting}
        className={slotValueClassName}
        maxFontSizeMultiplier={1.6}
        {...restProps}
      >
        {displayChar}
      </AnimatedText>
    </Animated.View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputOTP.SlotCaret
 * -----------------------------------------------------------------------------------------------*/
const InputOTPSlotCaret = forwardRef<InputOTPSlotCaretRef, InputOTPSlotCaretProps>((props, ref) => {
  const {
    className,
    animation,
    isAnimatedStyleActive = true,
    pointerEvents = "none",
    style,
    ...restProps
  } = props;
  const { isCaretVisible } = useInputOTPSlot();

  const { rContainerStyle } = useInputOTPSlotCaretAnimation({
    animation,
  });

  const slotCaretClassName = inputOTPClassNames.slotCaret({ className });

  const containerStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

  if (!isCaretVisible) return null;

  return (
    <Animated.View
      ref={ref}
      className={slotCaretClassName}
      style={containerStyle}
      pointerEvents={pointerEvents}
      {...restProps}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputOTP.Separator
 * -----------------------------------------------------------------------------------------------*/
const InputOTPSeparator = forwardRef<InputOTPSeparatorRef, InputOTPSeparatorProps>((props, ref) => {
  const { className, ...restProps } = props;

  const separatorClassName = inputOTPClassNames.separator({ className });

  return <InputOTPPrimitives.Separator ref={ref} className={separatorClassName} {...restProps} />;
});

// Display names
InputOTPRoot.displayName = DISPLAY_NAME.ROOT;
InputOTPGroup.displayName = DISPLAY_NAME.GROUP;
InputOTPSlot.displayName = DISPLAY_NAME.SLOT;
InputOTPSlotPlaceholder.displayName = DISPLAY_NAME.SLOT_PLACEHOLDER;
InputOTPSlotValue.displayName = DISPLAY_NAME.SLOT_VALUE;
InputOTPSlotCaret.displayName = DISPLAY_NAME.SLOT_CARET;
InputOTPSeparator.displayName = DISPLAY_NAME.SEPARATOR;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component InputOTP - Main container for OTP input. Manages the input state,
 * handles text changes, and provides context to child components.
 *
 * @component InputOTP.Group - Container for grouping multiple slots together.
 * Use this to visually group related slots (e.g., groups of 3 digits).
 *
 * @component InputOTP.Slot - Individual slot that displays a single character
 * or placeholder. Each slot must have a unique index matching its position
 * in the OTP sequence.
 *
 * @component InputOTP.SlotPlaceholder - Text component that displays the
 * placeholder character for a slot when it's empty. Used by default in Slot
 * if no children provided.
 *
 * @component InputOTP.SlotValue - Text component that displays the actual
 * character value for a slot with animations. Used by default in Slot
 * if no children provided.
 *
 * @component InputOTP.SlotCaret - Animated caret indicator that shows the
 * current input position. Place this inside a Slot to show where the user
 * is currently typing.
 *
 * @component InputOTP.Separator - Visual separator between groups of slots.
 * Use this to visually separate different groups of OTP digits.
 *
 * Props flow from InputOTP to sub-components via context (value, isDisabled,
 * isInvalid, slots). The component handles focus management, text input,
 * and validation automatically.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/input-otp
 * -----------------------------------------------------------------------------------------------*/
const InputOTP = Object.assign(InputOTPRoot, {
  /** @optional Container for grouping multiple slots together */
  Group: InputOTPGroup,
  /** @optional Individual slot that displays a single character or placeholder */
  Slot: InputOTPSlot,
  /** @optional Text component that displays the placeholder character for a slot */
  SlotPlaceholder: InputOTPSlotPlaceholder,
  /** @optional Text component that displays the actual character value for a slot */
  SlotValue: InputOTPSlotValue,
  /** @optional Animated caret indicator for the current input position */
  SlotCaret: InputOTPSlotCaret,
  /** @optional Visual separator between groups of slots */
  Separator: InputOTPSeparator,
});

export default InputOTP;
export {
  InputOTP,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  useInputOTP,
  useInputOTPSlot,
};
