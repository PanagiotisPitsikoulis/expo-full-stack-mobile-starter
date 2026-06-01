import { forwardRef } from "react";
import type { TextProps, TextStyle, ViewProps, ViewStyle } from "react-native";
import Animated, {
  type AnimatedProps,
  Easing,
  type EntryOrExitLayoutType,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { HeroText } from "../../helpers/internal/components";
import { useFormField } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type {
  AnimationRoot,
  AnimationValue,
  ElementSlots,
  ViewRef,
} from "../../helpers/internal/types";
import {
  childrenToString,
  combineStyles,
  getAnimationValueProperty,
  getIsAnimationDisabledValue,
  getRootAnimationState,
} from "../../helpers/internal/utils";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for the FieldError component parts
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.FieldError",
};

/**
 * Animation duration for focus/blur transitions
 */
export const ANIMATION_DURATION = 150;

/**
 * Animation easing function for focus/blur transitions
 */
export const ANIMATION_EASING = Easing.out(Easing.ease);

/**
 * Default entering animation configuration
 */
export const ENTERING_ANIMATION_CONFIG =
  FadeIn.duration(ANIMATION_DURATION).easing(ANIMATION_EASING);

/**
 * Default exiting animation configuration
 */
export const EXITING_ANIMATION_CONFIG = FadeOut.duration(ANIMATION_DURATION / 1.5).easing(
  ANIMATION_EASING,
);

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  slots: {
    container: "",
    text: "text-sm text-danger",
  },
  variants: {
    isInsideField: {
      true: {
        container: "px-1.5",
        text: "",
      },
    },
  },
});

export const fieldErrorClassNames = combineStyles({
  root,
});

export type FieldErrorSlots = keyof ReturnType<typeof root>;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation configuration for FieldError root component
 */
export type FieldErrorRootAnimation = AnimationRoot<{
  entering?: AnimationValue<{
    /**
     * Custom entering animation for field error
     */
    value?: EntryOrExitLayoutType;
  }>;
  exiting?: AnimationValue<{
    /**
     * Custom exiting animation for field error
     */
    value?: EntryOrExitLayoutType;
  }>;
}>;

/**
 * Props for the FieldError root component
 */
export interface FieldErrorRootProps
  extends Omit<AnimatedProps<ViewProps>, "entering" | "exiting"> {
  /**
   * The content of the error field
   * When passed as string, it will be wrapped with Text component
   */
  children?: React.ReactNode;

  /**
   * Controls the visibility of the error field (overrides context)
   * When false, the field error is hidden
   * @default undefined - uses form-item-state context value
   */
  isInvalid?: boolean;

  /**
   * Additional CSS class for styling
   */
  className?: string;

  /**
   * Additional CSS classes for different parts of the component
   */
  classNames?: ElementSlots<FieldErrorSlots>;

  /**
   * Styles for different parts of the field error
   */
  styles?: {
    container?: ViewStyle;
    text?: TextStyle;
  };

  /**
   * Additional props to pass to the Text component when children is a string
   */
  textProps?: TextProps;

  /**
   * Animation configuration for field error
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: FieldErrorRootAnimation;
}

/* -------------------------------------------------------------------------------------------------
 * Utils (animation)
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation hook for FieldError root component
 * Handles entering and exiting animations for error messages
 */
export function useFieldErrorRootAnimation(options: {
  animation: FieldErrorRootAnimation | undefined;
}) {
  const { animation } = options;

  const { animationConfig, isAnimationDisabled } = getRootAnimationState(animation);

  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  const enteringValue = getAnimationValueProperty({
    animationValue: animationConfig?.entering,
    property: "value",
    defaultValue: ENTERING_ANIMATION_CONFIG,
  });

  const exitingValue = getAnimationValueProperty({
    animationValue: animationConfig?.exiting,
    property: "value",
    defaultValue: EXITING_ANIMATION_CONFIG,
  });

  return {
    entering: isAnimationDisabledValue ? undefined : enteringValue,
    exiting: isAnimationDisabledValue ? undefined : exitingValue,
  };
}

/* -------------------------------------------------------------------------------------------------
 * FieldError.Root
 * -----------------------------------------------------------------------------------------------*/
const FieldErrorRoot = forwardRef<ViewRef, FieldErrorRootProps>((props, ref) => {
  const {
    children,
    className,
    classNames,
    style,
    styles,
    textProps,
    isInvalid: localIsInvalid,
    animation,
    ...restProps
  } = props;

  const formField = useFormField();

  // Merge form field state with local props (local takes precedence)
  const isInvalid = localIsInvalid !== undefined ? localIsInvalid : (formField?.isInvalid ?? false);

  const isInsideField = formField?.hasFieldPadding ?? false;

  const { container, text } = fieldErrorClassNames.root({
    isInsideField,
  });

  const containerClassName = container({
    className: [className, classNames?.container],
  });

  const textClassName = text({
    className: [classNames?.text, textProps?.className],
  });

  const { entering, exiting } = useFieldErrorRootAnimation({ animation });

  if (!isInvalid) return null;

  const stringifiedChildren = childrenToString(children);
  const renderedChildren = stringifiedChildren ? (
    <HeroText className={textClassName} style={styles?.text} {...textProps}>
      {stringifiedChildren}
    </HeroText>
  ) : (
    children
  );

  return (
    <Animated.View
      ref={ref}
      entering={entering}
      exiting={exiting}
      className={containerClassName}
      style={[style, styles?.container]}
      {...restProps}
    >
      {renderedChildren}
    </Animated.View>
  );
});

FieldErrorRoot.displayName = DISPLAY_NAME.ROOT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * FieldError component for displaying validation errors
 *
 * @component FieldError - Error message container with entering/exiting animations.
 * Automatically wraps string children with Text component.
 * Hidden when isInvalid is false.
 * -----------------------------------------------------------------------------------------------*/
const FieldError = FieldErrorRoot;

export { FieldError };
export default FieldError;
