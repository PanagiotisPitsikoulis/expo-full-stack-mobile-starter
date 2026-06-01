import { forwardRef } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { combineStyles } from "../../helpers/internal/utils";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display name for the Separator component
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Separator.Root",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Orientation of the separator
 * @default 'horizontal'
 */
export type SeparatorOrientation = "horizontal" | "vertical";

/**
 * Variant style of the separator
 * @default 'thin'
 */
export type SeparatorVariant = "thin" | "thick";

/**
 * Props for the Separator component
 */
export interface SeparatorProps extends ViewProps {
  /**
   * Variant style of the separator
   * @default 'thin'
   */
  variant?: SeparatorVariant;

  /**
   * Orientation of the separator
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;

  /**
   * Custom thickness of the separator. This controls the height (for horizontal) or width (for vertical) of the separator.
   */
  thickness?: number;

  /**
   * Additional CSS classes to apply to the separator
   */
  className?: string;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "bg-separator",
  variants: {
    variant: {
      thin: "",
      thick: "",
    },
    orientation: {
      horizontal: "",
      vertical: "h-full",
    },
  },
  compoundVariants: [
    // Thin variant - horizontal orientation
    {
      variant: "thin",
      orientation: "horizontal",
      className: "h-hairline",
    },
    // Thin variant - vertical orientation
    {
      variant: "thin",
      orientation: "vertical",
      className: "w-hairline",
    },
    // Thick variant - horizontal orientation
    {
      variant: "thick",
      orientation: "horizontal",
      className: `h-[6px]`,
    },
    // Thick variant - vertical orientation
    {
      variant: "thick",
      orientation: "vertical",
      className: `w-[6px]`,
    },
  ],
  defaultVariants: {
    variant: "thin",
    orientation: "horizontal",
  },
});

export const separatorClassNames = combineStyles({
  root,
});

/* -------------------------------------------------------------------------------------------------
 * Separator
 * -----------------------------------------------------------------------------------------------*/
const SeparatorRoot = forwardRef<View, SeparatorProps>((props, ref) => {
  const {
    variant = "thin",
    orientation = "horizontal",
    thickness,
    className,
    style,
    ...restProps
  } = props;

  const rootClassName = separatorClassNames.root({
    variant,
    orientation,
    className,
  });

  /**
   * Custom thickness handling: when thickness prop is provided,
   * override the variant-based thickness with inline styles
   */
  const customThicknessStyle =
    thickness !== undefined
      ? orientation === "horizontal"
        ? { height: thickness }
        : { width: thickness }
      : undefined;

  return (
    <View
      ref={ref}
      className={rootClassName}
      style={customThicknessStyle ? [customThicknessStyle, style] : style}
      {...restProps}
    />
  );
});

SeparatorRoot.displayName = DISPLAY_NAME.ROOT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Separator - A simple line to separate content visually.
 * Supports horizontal and vertical orientations with thin and thick variants.
 * Uses hairline width utility classes for the thin variant by default.
 * Custom thickness can be provided via the thickness prop to override variant-based sizing.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/separator
 * -----------------------------------------------------------------------------------------------*/
const Separator = SeparatorRoot;

export { Separator };
export default Separator;
