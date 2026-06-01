import { forwardRef, useMemo } from "react";
import {
  type ImageSourcePropType,
  type ImageProps as RNImageProps,
  StyleSheet,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  type AnimatedProps,
  type EntryOrExitLayoutType,
  type WithTimingConfig,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { HeroText } from "../../helpers/internal/components";
import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type {
  Animation,
  AnimationRootDisableAll,
  AnimationValue,
  ElementSlots,
} from "../../helpers/internal/types";
import { childrenToString, combineStyles } from "../../helpers/internal/utils";
import type {
  FallbackProps as PrimitiveFallbackProps,
  FallbackRef as PrimitiveFallbackRef,
  ImageProps as PrimitiveImageProps,
  ImageRef as PrimitiveImageRef,
  RootProps as PrimitiveRootProps,
  RootRef as PrimitiveRootRef,
} from "../../primitives/avatar";
import * as AvatarPrimitives from "../../primitives/avatar";
import type { ImageProps } from "../../primitives/avatar/avatar.types";
import {
  useAvatarFallbackAnimation,
  useAvatarImageAnimation,
  useAvatarRootAnimation,
} from "./avatar.animation";
import { AvatarProvider, useInnerAvatarContext } from "./avatar.context";
import type { PersonIconProps } from "./person-icon";
import { PersonIcon } from "./person-icon";

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Available sizes for the Avatar component
 */
export type AvatarSize = "sm" | "md" | "lg";

/**
 * Available variants for the Avatar component
 */
export type AvatarVariant = "default" | "soft";

/**
 * Available color variants for the Avatar component
 */
export type AvatarColor = "accent" | "default" | "success" | "warning" | "danger";

/**
 * Props for the Avatar root component
 */
export interface AvatarRootProps extends PrimitiveRootProps {
  /** @default 'md' */
  size?: AvatarSize;
  /** @default 'default' */
  variant?: AvatarVariant;
  /** @default 'accent' */
  color?: AvatarColor;
  className?: string;
  animation?: AnimationRootDisableAll;
}

/**
 * Animation configuration for avatar image component
 */
export type AvatarImageAnimation = Animation<{
  opacity?: AnimationValue<{
    value?: [number, number];
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Props for the Avatar image component
 */
export type AvatarImageProps =
  | (AnimatedProps<RNImageProps> & {
      className?: string;
      asChild?: false;
      animation?: AvatarImageAnimation;
      isAnimatedStyleActive?: boolean;
    })
  | (PrimitiveImageProps & {
      className?: string;
      asChild: true;
    });

/**
 * Animation configuration for avatar fallback component
 */
export type AvatarFallbackAnimation = Animation<{
  entering?: AnimationValue<{
    value?: EntryOrExitLayoutType;
  }>;
}>;

/**
 * Props for the Avatar fallback component
 */
export interface AvatarFallbackProps
  extends Omit<AnimatedProps<PrimitiveFallbackProps>, "entering"> {
  /** @default 0 */
  delayMs?: number;
  color?: AvatarColor;
  className?: string;
  classNames?: ElementSlots<AvatarFallbackSlots>;
  styles?: {
    container?: ViewStyle;
    text?: TextStyle;
  };
  textProps?: TextProps;
  iconProps?: PersonIconProps;
  animation?: AvatarFallbackAnimation;
}

/**
 * Context value shared between Avatar components
 */
export interface AvatarContextValue {
  size: AvatarSize;
  color: AvatarColor;
}

/** Reference type for the Avatar root component */
export type AvatarRootRef = PrimitiveRootRef;

/** Reference type for the Avatar image component */
export type AvatarImageRef = PrimitiveImageRef;

/** Reference type for the Avatar fallback component */
export type AvatarFallbackRef = PrimitiveFallbackRef;

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Avatar components
 */
export const AVATAR_DISPLAY_NAME = {
  ROOT: "PitsiUINative.Avatar",
  IMAGE: "PitsiUINative.Avatar.Image",
  FALLBACK: "PitsiUINative.Avatar.Fallback",
};

/**
 * Default icon sizes for different avatar sizes
 */
export const AVATAR_DEFAULT_ICON_SIZE: Record<AvatarSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "items-center justify-center overflow-hidden rounded-full",
  variants: {
    variant: {
      default: "bg-default",
      soft: "",
    },
    size: {
      sm: "size-10",
      md: "size-12",
      lg: "size-16",
    },
    color: {
      accent: "",
      default: "",
      success: "",
      warning: "",
      danger: "",
    },
  },
  compoundVariants: [
    {
      variant: "soft",
      color: "accent",
      className: "bg-accent/15",
    },
    {
      variant: "soft",
      color: "default",
      className: "bg-default",
    },
    {
      variant: "soft",
      color: "success",
      className: "bg-success/15",
    },
    {
      variant: "soft",
      color: "warning",
      className: "bg-warning/15",
    },
    {
      variant: "soft",
      color: "danger",
      className: "bg-danger/15",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    color: "accent",
  },
});

const image = tv({
  base: "h-full w-full",
});

const fallback = tv({
  slots: {
    container: "h-full w-full items-center justify-center rounded-full",
    text: "font-medium",
  },
  variants: {
    size: {
      sm: {
        text: "text-xs",
      },
      md: {
        text: "text-sm",
      },
      lg: {
        text: "text-base",
      },
    },
    color: {
      default: {
        text: "text-default-foreground",
      },
      accent: {
        text: "text-accent",
      },
      success: {
        text: "text-success",
      },
      warning: {
        text: "text-warning",
      },
      danger: {
        text: "text-danger",
      },
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

export const avatarClassNames = combineStyles({
  root,
  image,
  fallback,
});

export const avatarStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

/**
 * Export slot types for type-safe classNames props
 */
export type AvatarFallbackSlots = keyof ReturnType<typeof fallback>;

/* -------------------------------------------------------------------------------------------------
 * Avatar.Root
 * -----------------------------------------------------------------------------------------------*/
const AnimatedFallback = Animated.createAnimatedComponent(AvatarPrimitives.Fallback);

/**
 * Hook to access Avatar primitive root context
 */
const useAvatar = AvatarPrimitives.useRootContext;

const AvatarRoot = forwardRef<AvatarRootRef, AvatarRootProps>((props, ref) => {
  const {
    children,
    size = "md",
    variant = "default",
    color = "accent",
    className,
    style,
    animation,
    ...restProps
  } = props;

  const rootClassName = avatarClassNames.root({
    variant,
    size,
    color,
    className,
  });

  const { isAllAnimationsDisabled } = useAvatarRootAnimation({
    animation,
  });

  const contextValue = useMemo(
    () => ({
      size,
      color,
    }),
    [size, color],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <AvatarProvider value={contextValue}>
        <AvatarPrimitives.Root
          ref={ref}
          className={rootClassName}
          style={[avatarStyleSheet.borderCurve, style]}
          {...restProps}
        >
          {children}
        </AvatarPrimitives.Root>
      </AvatarProvider>
    </AnimationSettingsProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Avatar.Image
 * -----------------------------------------------------------------------------------------------*/
const AvatarImage = forwardRef<AvatarImageRef, AvatarImageProps>((props, ref) => {
  const { className, style: styleProp, source, asChild, ...restProps } = props;

  const animation = asChild ? undefined : "animation" in props ? props.animation : undefined;

  const isAnimatedStyleActive = asChild
    ? true
    : "isAnimatedStyleActive" in props
      ? (props.isAnimatedStyleActive ?? true)
      : true;

  const { rImageStyle } = useAvatarImageAnimation({
    animation,
  });

  const imageClassName = avatarClassNames.image({
    className,
  });

  const imageStyle = isAnimatedStyleActive ? [rImageStyle, styleProp] : styleProp;

  if (asChild) {
    return (
      <AvatarPrimitives.Image
        ref={ref}
        source={source}
        className={imageClassName}
        style={styleProp}
        asChild
        {...(restProps as Omit<ImageProps, "source" | "style" | "asChild">)}
      />
    );
  }

  return (
    <AvatarPrimitives.Image ref={ref} source={source as ImageSourcePropType} asChild>
      <Animated.Image style={imageStyle} className={imageClassName} {...restProps} />
    </AvatarPrimitives.Image>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Avatar.Fallback
 * -----------------------------------------------------------------------------------------------*/
const DefaultFallbackIcon: React.FC<{
  sizeVariant: AvatarSize;
  colorVariant: AvatarColor;
  iconProps?: PersonIconProps;
}> = ({ sizeVariant, colorVariant, iconProps }) => {
  const [
    themeColorDefaultForeground,
    themeColorAccent,
    themeColorSuccess,
    themeColorWarning,
    themeColorDanger,
  ] = useThemeColor(["default-foreground", "accent", "success", "warning", "danger"]);

  const iconSize = iconProps?.size ?? AVATAR_DEFAULT_ICON_SIZE[sizeVariant];

  const defaultIconColorMap: Record<AvatarColor, string> = {
    default: themeColorDefaultForeground,
    accent: themeColorAccent,
    success: themeColorSuccess,
    warning: themeColorWarning,
    danger: themeColorDanger,
  };

  const iconColor = iconProps?.color ?? defaultIconColorMap[colorVariant];

  return <PersonIcon size={iconSize} color={iconColor} />;
};

const AvatarFallback = forwardRef<AvatarFallbackRef, AvatarFallbackProps>((props, ref) => {
  const { size, color: contextColor } = useInnerAvatarContext();

  const {
    children,
    color: colorProp,
    className,
    classNames,
    style,
    styles,
    textProps,
    iconProps,
    delayMs,
    animation,
    ...restProps
  } = props;

  const stringifiedChildren = childrenToString(children);

  const color = colorProp ?? contextColor;

  const { container, text } = avatarClassNames.fallback({
    size,
    color,
  });

  const fallbackContainerClassName = container({
    className: [className, classNames?.container],
  });

  const fallbackTextClassName = text({
    className: [classNames?.text, textProps?.className],
  });

  const { entering } = useAvatarFallbackAnimation({
    animation,
    delayMs,
  });

  return (
    <AnimatedFallback
      key={AVATAR_DISPLAY_NAME.FALLBACK}
      ref={ref}
      entering={entering}
      className={fallbackContainerClassName}
      style={[avatarStyleSheet.borderCurve, style, styles?.container]}
      {...restProps}
    >
      {children ? (
        stringifiedChildren ? (
          <HeroText
            className={fallbackTextClassName}
            style={styles?.text}
            maxFontSizeMultiplier={1.4}
            {...textProps}
          >
            {stringifiedChildren}
          </HeroText>
        ) : (
          children
        )
      ) : (
        <DefaultFallbackIcon sizeVariant={size} colorVariant={color} iconProps={iconProps} />
      )}
    </AnimatedFallback>
  );
});

AvatarRoot.displayName = AVATAR_DISPLAY_NAME.ROOT;
AvatarImage.displayName = AVATAR_DISPLAY_NAME.IMAGE;
AvatarFallback.displayName = AVATAR_DISPLAY_NAME.FALLBACK;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Avatar - Main container that manages avatar display state.
 * @component Avatar.Image - Optional image component that displays the avatar image.
 * @component Avatar.Fallback - Optional fallback component shown when image fails to load.
 *
 * @see https://pitsiui.com/docs/native/components/avatar
 * -----------------------------------------------------------------------------------------------*/
const Avatar = Object.assign(AvatarRoot, {
  /** @optional Displays the avatar image with loading state management */
  Image: AvatarImage,
  /** @optional Shows fallback content when image is unavailable */
  Fallback: AvatarFallback,
});

export default Avatar;
export { Avatar, useAvatar };
