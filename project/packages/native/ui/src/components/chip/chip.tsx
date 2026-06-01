import { forwardRef, useMemo } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type TextProps,
  type ViewStyle,
} from "react-native";
import { tv } from "tailwind-variants";
import { HeroText } from "../../helpers/internal/components/hero-text";
import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type { AnimationRootDisableAll, PressableRef, TextRef } from "../../helpers/internal/types";
import { childrenToString, combineStyles, createContext } from "../../helpers/internal/utils";
import { useChipRootAnimation } from "./chip.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for chip components
 */
export const DISPLAY_NAME = {
  CHIP_ROOT: "PitsiUINative.Chip.Root",
  CHIP_LABEL_CONTENT: "PitsiUINative.Chip.Label",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Chip size variants
 */
export type ChipSize = "sm" | "md" | "lg";

/**
 * Chip variant types
 */
export type ChipVariant = "primary" | "secondary" | "tertiary" | "soft";

/**
 * Chip color variants
 */
export type ChipColor = "accent" | "default" | "success" | "warning" | "danger";

/**
 * Props for the main Chip component
 */
export interface ChipProps extends PressableProps {
  /** Child elements to render inside the chip */
  children?: React.ReactNode;

  /** Visual variant of the chip @default 'primary' */
  variant?: ChipVariant;

  /** Size of the chip @default 'md' */
  size?: ChipSize;

  /** Color theme of the chip @default 'accent' */
  color?: ChipColor;

  /** Custom class name for the chip */
  className?: string;

  /**
   * Animation configuration for chip
   * - `"disable-all"`: Disable all animations including children
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Props for the ChipLabel component
 */
export interface ChipLabelProps extends TextProps {
  /** Child elements to render as the label. If string, will be wrapped in Text component */
  children?: React.ReactNode;

  /** Custom class name for the label */
  className?: string;
}

/**
 * Context value for chip components
 */
export interface ChipContextValue {
  /** Size of the chip */
  size: ChipSize;

  /** Variant of the chip */
  variant: ChipVariant;

  /** Color theme of the chip */
  color: ChipColor;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "self-start flex-row items-center justify-center gap-1 overflow-hidden",
  variants: {
    variant: {
      primary: "",
      secondary: "bg-default",
      tertiary: "bg-transparent",
      soft: "",
    },
    size: {
      sm: "px-2 py-0.5 rounded-xl",
      md: "px-3 py-[3px] rounded-2xl",
      lg: "px-4 py-1 rounded-3xl",
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
    // Primary variant colors
    {
      variant: "primary",
      color: "accent",
      className: "bg-accent",
    },
    {
      variant: "primary",
      color: "default",
      className: "bg-default",
    },
    {
      variant: "primary",
      color: "success",
      className: "bg-success",
    },
    {
      variant: "primary",
      color: "warning",
      className: "bg-warning",
    },
    {
      variant: "primary",
      color: "danger",
      className: "bg-danger",
    },
    // Soft variant colors
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
    size: "md",
    variant: "primary",
    color: "accent",
  },
});

const label = tv({
  base: "font-medium",
  variants: {
    variant: {
      primary: "",
      secondary: "",
      tertiary: "",
      soft: "",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
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
    // Primary variant text colors
    {
      variant: "primary",
      color: "accent",
      className: "text-accent-foreground",
    },
    {
      variant: "primary",
      color: "default",
      className: "text-default-foreground",
    },
    {
      variant: "primary",
      color: "success",
      className: "text-success-foreground",
    },
    {
      variant: "primary",
      color: "warning",
      className: "text-warning-foreground",
    },
    {
      variant: "primary",
      color: "danger",
      className: "text-danger-foreground",
    },
    // Secondary variant text colors
    {
      variant: "secondary",
      color: "accent",
      className: "text-accent",
    },
    {
      variant: "secondary",
      color: "default",
      className: "text-default-foreground",
    },
    {
      variant: "secondary",
      color: "success",
      className: "text-success",
    },
    {
      variant: "secondary",
      color: "warning",
      className: "text-warning",
    },
    {
      variant: "secondary",
      color: "danger",
      className: "text-danger",
    },
    // Tertiary variant text colors
    {
      variant: "tertiary",
      color: "accent",
      className: "text-foreground",
    },
    {
      variant: "tertiary",
      color: "default",
      className: "text-default-foreground",
    },
    {
      variant: "tertiary",
      color: "success",
      className: "text-success",
    },
    {
      variant: "tertiary",
      color: "warning",
      className: "text-warning",
    },
    {
      variant: "tertiary",
      color: "danger",
      className: "text-danger",
    },
    // Soft variant text colors
    {
      variant: "soft",
      color: "accent",
      className: "text-accent",
    },
    {
      variant: "soft",
      color: "default",
      className: "text-default-foreground",
    },
    {
      variant: "soft",
      color: "success",
      className: "text-success",
    },
    {
      variant: "soft",
      color: "warning",
      className: "text-warning",
    },
    {
      variant: "soft",
      color: "danger",
      className: "text-danger",
    },
  ],
  defaultVariants: {
    size: "md",
    variant: "primary",
    color: "accent",
  },
});

export const chipClassNames = combineStyles({
  root,
  label,
});

export const chipStyleSheet = StyleSheet.create({
  root: {
    borderCurve: "continuous",
  },
});

export type LabelContentSlots = keyof ReturnType<typeof label>;

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const [ChipProvider, useChip] = createContext<ChipContextValue>({
  name: "ChipContext",
});

/* -------------------------------------------------------------------------------------------------
 * Chip.Root
 * -----------------------------------------------------------------------------------------------*/
const ChipRoot = forwardRef<PressableRef, ChipProps>((props, ref) => {
  const {
    children,
    variant = "primary",
    size = "md",
    color = "accent",
    className,
    style,
    animation,
    ...restProps
  } = props;

  const stringifiedChildren = childrenToString(children);

  const rootClassName = chipClassNames.root({
    size,
    variant,
    color,
    className,
  });

  const { isAllAnimationsDisabled } = useChipRootAnimation({
    animation,
  });

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const contextValue = useMemo(
    () => ({
      size,
      variant,
      color,
    }),
    [size, variant, color],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <ChipProvider value={contextValue}>
        <Pressable
          ref={ref}
          className={rootClassName}
          style={[chipStyleSheet.root, style] as StyleProp<ViewStyle>}
          {...restProps}
        >
          {stringifiedChildren ? <ChipLabel>{stringifiedChildren}</ChipLabel> : children}
        </Pressable>
      </ChipProvider>
    </AnimationSettingsProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Chip.Label
 * -----------------------------------------------------------------------------------------------*/
const ChipLabel = forwardRef<TextRef, ChipLabelProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const { size, variant, color } = useChip();

  const labelClassName = chipClassNames.label({
    size,
    variant,
    color,
    className,
  });

  return (
    <HeroText ref={ref} className={labelClassName} {...restProps}>
      {children}
    </HeroText>
  );
});

ChipRoot.displayName = DISPLAY_NAME.CHIP_ROOT;
ChipLabel.displayName = DISPLAY_NAME.CHIP_LABEL_CONTENT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Chip - Main container that displays a compact element. Renders with
 *   string children as label or accepts compound components for custom layouts.
 * @component Chip.Label - Text content of the chip. When string is provided,
 *   it renders as Text. Otherwise renders children as-is.
 *
 * Props flow from Chip to sub-components via context (size, variant, color).
 *
 * @see https://pitsiui.com/docs/native/components/chip
 * -----------------------------------------------------------------------------------------------*/
const Chip = Object.assign(ChipRoot, {
  /** Chip label - renders text or custom content */
  Label: ChipLabel,
});

export { Chip, useChip };
export default Chip;
