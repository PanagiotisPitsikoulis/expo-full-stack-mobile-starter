import { forwardRef } from "react";
import type { TextProps } from "react-native";
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
import type { AnimationRoot, AnimationValue, TextRef } from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";
import { useDescriptionAnimation } from "./description.animation";

const AnimatedText = Animated.createAnimatedComponent(HeroText);

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Description components
 */
export const DISPLAY_NAME = {
  DESCRIPTION: "PitsiUINative.Description",
} as const;

/**
 * Animation duration for description transitions
 */
export const ANIMATION_DURATION = 150;

/**
 * Animation easing function for description transitions
 */
export const ANIMATION_EASING = Easing.out(Easing.ease);

/**
 * Animation configuration for entering transitions
 */
export const ENTERING_ANIMATION_CONFIG =
  FadeIn.duration(ANIMATION_DURATION).easing(ANIMATION_EASING);

/**
 * Animation configuration for exiting transitions
 */
export const EXITING_ANIMATION_CONFIG =
  FadeOut.duration(ANIMATION_DURATION).easing(ANIMATION_EASING);

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation configuration for Description component
 * Used by the Description component for animation support
 */
export type DescriptionAnimation = AnimationRoot<{
  entering?: AnimationValue<{
    /**
     * Custom entering animation for description
     */
    value?: EntryOrExitLayoutType;
  }>;
  exiting?: AnimationValue<{
    /**
     * Custom exiting animation for description
     */
    value?: EntryOrExitLayoutType;
  }>;
}>;

/**
 * Props for the Description component
 */
export interface DescriptionProps extends Omit<AnimatedProps<TextProps>, "entering" | "exiting"> {
  /**
   * Description text content
   */
  children?: React.ReactNode;
  /**
   * Whether the description is in an invalid state (overrides context)
   * @default undefined
   */
  isInvalid?: boolean;
  /**
   * Whether the description is disabled (overrides context)
   * @default undefined
   */
  isDisabled?: boolean;
  /**
   * Whether to hide the description when invalid
   * @default false
   */
  hideOnInvalid?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Native ID for accessibility. Used to link description to form fields via aria-describedby.
   * When provided, form fields can reference this description using aria-describedby={nativeID}.
   */
  nativeID?: string;
  /**
   * Animation configuration for description
   * - `true` or `undefined`: Use default animations
   * - `false` or `"disabled"`: Disable only description animations (children can still animate)
   * - `"disable-all"`: Disable all animations including children (cascades down)
   * - `object`: Custom animation configuration
   */
  animation?: DescriptionAnimation;
}

/**
 * Reference type for the Description component
 */
export type DescriptionRef = TextRef;

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "text-sm text-muted",
  variants: {
    isInsideField: {
      true: "px-1.5",
    },
    isInvalid: {
      true: "text-danger",
    },
    isDisabled: {
      true: "opacity-disabled",
      false: "",
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

export const descriptionClassNames = combineStyles({
  root,
});

/* -------------------------------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------------------------*/
const Description = forwardRef<TextRef, DescriptionProps>((props, ref) => {
  const {
    children,
    className,
    nativeID,
    isInvalid: localIsInvalid,
    isDisabled: localIsDisabled,
    hideOnInvalid = false,
    animation,
    ...restProps
  } = props;

  const formField = useFormField();

  const isInvalid = localIsInvalid !== undefined ? localIsInvalid : (formField?.isInvalid ?? false);

  const isDisabled =
    localIsDisabled !== undefined ? localIsDisabled : (formField?.isDisabled ?? false);

  const isInsideField = formField?.hasFieldPadding ?? false;

  const rootClassName = descriptionClassNames.root({
    isInvalid,
    isDisabled,
    isInsideField,
    className,
  });

  const { entering, exiting } = useDescriptionAnimation({
    animation,
    hideOnInvalid,
  });

  if (isInvalid && hideOnInvalid) return null;

  return (
    <AnimatedText
      ref={ref}
      entering={entering}
      exiting={exiting}
      className={rootClassName}
      nativeID={nativeID}
      {...restProps}
    >
      {children}
    </AnimatedText>
  );
});

Description.displayName = DISPLAY_NAME.DESCRIPTION;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Description - Provides accessible description text with proper styling.
 *   Can be linked to form fields via the nativeID prop for accessibility support.
 *
 * @see https://pitsiui.com/docs/native/components/description
 * -----------------------------------------------------------------------------------------------*/
export { Description };
export default Description;
