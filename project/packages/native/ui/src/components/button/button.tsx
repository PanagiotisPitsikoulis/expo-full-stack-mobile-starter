import { forwardRef, useMemo } from "react";
import { StyleSheet, type TextProps } from "react-native";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { colorKit } from "../../helpers/external/utils";
import { HeroText } from "../../helpers/internal/components/hero-text";
import type {
  AnimationRoot,
  AnimationRootDisableAll,
  PressableRef,
  TextRef,
} from "../../helpers/internal/types";
import { childrenToString, combineStyles, createContext } from "../../helpers/internal/utils";
import {
  PressableFeedback,
  type PressableFeedbackHighlightAnimation,
  type PressableFeedbackProps,
  type PressableFeedbackRippleAnimation,
  type PressableFeedbackScaleAnimation,
} from "../pressable-feedback";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  BUTTON_ROOT: "PitsiUINative.Button.Root",
  BUTTON_LABEL: "PitsiUINative.Button.Label",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-soft";

export type ButtonFeedbackVariant = "scale-highlight" | "scale-ripple" | "scale" | "none";

type ButtonRootPropsBase = Omit<PressableFeedbackProps, "animation"> & {
  /** @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  /** @default false */
  isIconOnly?: boolean;
};

export type ButtonRootPropsScaleHighlight = ButtonRootPropsBase & {
  /** @default 'scale-highlight' */
  feedbackVariant?: "scale-highlight";
  animation?: AnimationRoot<{
    scale?: PressableFeedbackScaleAnimation;
    highlight?: PressableFeedbackHighlightAnimation;
  }>;
};

type ButtonRootPropsScaleRipple = ButtonRootPropsBase & {
  feedbackVariant: "scale-ripple";
  animation?: AnimationRoot<{
    scale?: PressableFeedbackScaleAnimation;
    ripple?: PressableFeedbackRippleAnimation;
  }>;
};

type ButtonRootPropsScale = ButtonRootPropsBase & {
  feedbackVariant: "scale";
  animation?: AnimationRoot<{
    scale?: PressableFeedbackScaleAnimation;
  }>;
};

type ButtonRootPropsNone = ButtonRootPropsBase & {
  feedbackVariant: "none";
  animation?: AnimationRootDisableAll;
};

export type ButtonRootProps =
  | ButtonRootPropsScaleHighlight
  | ButtonRootPropsScaleRipple
  | ButtonRootPropsScale
  | ButtonRootPropsNone;

export interface ButtonLabelProps extends TextProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonContextValue {
  size: ButtonSize;
  variant: ButtonVariant;
  isDisabled: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 *   `transform` (specifically `scale`) — animated for press feedback. Use the
 *   `animation` prop to customize: `<Button animation={{ scale: { value: 0.985 } }} />`.
 *   To disable: `animation={{ scale: false }}` or `animation={false}`.
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "flex-row items-center justify-center border-0",
  variants: {
    variant: {
      primary: "bg-accent",
      secondary: "bg-default",
      tertiary: "bg-default",
      outline: "bg-transparent border border-border",
      ghost: "bg-transparent",
      danger: "bg-danger",
      "danger-soft": "bg-danger-soft border-0",
    },
    size: {
      sm: "h-[36px] px-3.5 gap-1.5 rounded-3xl",
      md: "h-[48px] px-4 gap-2 rounded-3xl",
      lg: "h-[56px] px-5 gap-2.5 rounded-4xl",
    },
    isIconOnly: {
      true: "p-0 aspect-square",
    },
    isDisabled: {
      true: "disabled:opacity-disabled disabled:pointer-events-none",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    isIconOnly: false,
    isDisabled: false,
  },
});

const label = tv({
  base: "font-medium",
  variants: {
    variant: {
      primary: "text-accent-foreground",
      secondary: "text-accent-soft-foreground",
      tertiary: "text-default-foreground",
      outline: "text-default-foreground",
      ghost: "text-default-foreground",
      danger: "text-danger-foreground",
      "danger-soft": "text-danger",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export const buttonClassNames = combineStyles({ root, label });

const buttonStyleSheet = StyleSheet.create({
  buttonRoot: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/
export function resolveAnimationObject(
  animation: ButtonRootProps["animation"],
): Record<string, unknown> | undefined {
  if (typeof animation === "object" && animation !== null) {
    return animation;
  }
  return undefined;
}

function isAnimationDisabled(animation: ButtonRootProps["animation"]): boolean {
  if (animation === false || animation === "disabled" || animation === "disable-all") {
    return true;
  }
  if (typeof animation === "object" && animation !== null) {
    const { state } = animation;
    return state === false || state === "disabled" || state === "disable-all";
  }
  return false;
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const [ButtonProvider, useButton] = createContext<ButtonContextValue>({
  name: "ButtonContext",
});

/* -------------------------------------------------------------------------------------------------
 * Button.Root
 * -----------------------------------------------------------------------------------------------*/
const ButtonRoot = forwardRef<PressableRef, ButtonRootProps>((props, ref) => {
  const {
    children,
    variant = "primary",
    feedbackVariant = "scale-highlight",
    animation,
    size = "md",
    isIconOnly = false,
    isDisabled = false,
    className,
    style,
    accessibilityRole = "button",
    ...restProps
  } = props;

  const [
    themeColorAccentHover,
    themeColorDefaultHover,
    themeColorDangerHover,
    themeColorDangerSoftHover,
  ] = useThemeColor(["accent-hover", "default-hover", "danger-hover", "danger-soft-hover"]);

  const stringifiedChildren = childrenToString(children);

  const rootClassName = buttonClassNames.root({
    variant,
    size,
    isIconOnly,
    isDisabled,
    className,
  });

  const resolvedAnimation = resolveAnimationObject(animation);
  const allAnimationsDisabled = isAnimationDisabled(animation);

  const highlightColorMap = useMemo(() => {
    switch (variant) {
      case "primary":
        return themeColorAccentHover;
      case "secondary":
        return themeColorDefaultHover;
      case "tertiary":
        return themeColorDefaultHover;
      case "outline":
        return colorKit.setAlpha(themeColorDefaultHover, 0.3).hex();
      case "ghost":
        return colorKit.setAlpha(themeColorDefaultHover, 0.3).hex();
      case "danger":
        return themeColorDangerHover;
      case "danger-soft":
        return themeColorDangerSoftHover;
    }
  }, [
    variant,
    themeColorAccentHover,
    themeColorDefaultHover,
    themeColorDangerHover,
    themeColorDangerSoftHover,
  ]);

  const highlightAnimationConfig = useMemo(() => {
    if (feedbackVariant !== "scale-highlight") {
      return undefined;
    }

    const highlightAnimation = resolvedAnimation?.highlight as
      | PressableFeedbackHighlightAnimation
      | undefined;

    if (highlightAnimation === false || highlightAnimation === "disabled") {
      return undefined;
    }

    const defaultConfig = {
      backgroundColor: { value: highlightColorMap },
      opacity: { value: [0, 1] as [number, number] },
    };

    if (typeof highlightAnimation === "object" && highlightAnimation !== null) {
      return {
        backgroundColor: {
          ...defaultConfig.backgroundColor,
          ...(highlightAnimation.backgroundColor ?? {}),
        },
        opacity: {
          ...defaultConfig.opacity,
          ...(highlightAnimation.opacity ?? {}),
        },
      };
    }

    return defaultConfig;
  }, [feedbackVariant, highlightColorMap, resolvedAnimation?.highlight]);

  const rippleAnimationConfig = useMemo(() => {
    if (feedbackVariant !== "scale-ripple") {
      return undefined;
    }

    const rippleAnimation = resolvedAnimation?.ripple as
      | PressableFeedbackRippleAnimation
      | undefined;

    if (rippleAnimation === false || rippleAnimation === "disabled") {
      return undefined;
    }

    const defaultConfig = {
      backgroundColor: { value: highlightColorMap },
      opacity: { value: [0, 1, 0] as [number, number, number] },
    };

    if (typeof rippleAnimation === "object" && rippleAnimation !== null) {
      return {
        backgroundColor: {
          ...defaultConfig.backgroundColor,
          ...(rippleAnimation.backgroundColor ?? {}),
        },
        opacity: {
          ...defaultConfig.opacity,
          ...(rippleAnimation.opacity ?? {}),
        },
        ...(rippleAnimation.scale !== undefined && { scale: rippleAnimation.scale }),
        ...(rippleAnimation.progress !== undefined && {
          progress: rippleAnimation.progress,
        }),
      };
    }

    return defaultConfig;
  }, [feedbackVariant, highlightColorMap, resolvedAnimation?.ripple]);

  const scaleAnimation = resolvedAnimation?.scale as PressableFeedbackScaleAnimation | undefined;

  const rootAnimation = useMemo(() => {
    if (allAnimationsDisabled) {
      return "disable-all" as const;
    }
    if (feedbackVariant === "none") {
      return false as const;
    }
    if (scaleAnimation === false || scaleAnimation === "disabled") {
      return false as const;
    }
    if (typeof scaleAnimation === "object" && scaleAnimation !== null) {
      return { scale: scaleAnimation };
    }
    return undefined;
  }, [allAnimationsDisabled, feedbackVariant, scaleAnimation]);

  const contextValue = useMemo(() => ({ size, variant, isDisabled }), [size, variant, isDisabled]);

  const content = stringifiedChildren ? <ButtonLabel>{stringifiedChildren}</ButtonLabel> : children;

  return (
    <ButtonProvider value={contextValue}>
      <PressableFeedback
        ref={ref}
        isDisabled={isDisabled}
        className={rootClassName}
        style={
          typeof style === "function"
            ? (state) => [buttonStyleSheet.buttonRoot, style(state)]
            : [buttonStyleSheet.buttonRoot, style]
        }
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled: isDisabled }}
        animation={rootAnimation}
        {...restProps}
      >
        {feedbackVariant === "scale-highlight" && highlightAnimationConfig !== undefined && (
          <PressableFeedback.Highlight animation={highlightAnimationConfig} />
        )}
        {feedbackVariant === "scale-ripple" && rippleAnimationConfig !== undefined && (
          <PressableFeedback.Ripple animation={rippleAnimationConfig} />
        )}
        {content}
      </PressableFeedback>
    </ButtonProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Button.Label
 * -----------------------------------------------------------------------------------------------*/
const ButtonLabel = forwardRef<TextRef, ButtonLabelProps>((props, ref) => {
  const { children, className, ...restProps } = props;
  const { size, variant } = useButton();

  const labelClassName = buttonClassNames.label({ size, variant, className });

  return (
    <HeroText ref={ref} className={labelClassName} {...restProps}>
      {children}
    </HeroText>
  );
});

ButtonRoot.displayName = DISPLAY_NAME.BUTTON_ROOT;
ButtonLabel.displayName = DISPLAY_NAME.BUTTON_LABEL;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Button - main container wrapping `PressableFeedback`. Handles press
 *   interactions, visual variants, and feedback animations. `feedbackVariant` controls
 *   which effects render (`scale-highlight` | `scale-ripple` | `scale` | `none`); the
 *   `animation` prop gives granular control over each sub-animation. String children
 *   are auto-wrapped in `<Button.Label>`.
 * @component Button.Label - text content; inherits size + variant from parent context.
 *
 * @see https://pitsiui.com/docs/native/components/button
 * -----------------------------------------------------------------------------------------------*/
const Button = Object.assign(ButtonRoot, {
  /** Renders text or custom content; inherits parent Button context. */
  Label: ButtonLabel,
});

export { Button, useButton };
export default Button;
