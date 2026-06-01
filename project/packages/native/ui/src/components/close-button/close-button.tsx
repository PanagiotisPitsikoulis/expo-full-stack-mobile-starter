import { forwardRef } from "react";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { CloseIcon } from "../../helpers/internal/components";
import type { PressableRef } from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";
import { Button, type ButtonRootProps } from "../button";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for CloseButton components
 */
export const DISPLAY_NAME = {
  CLOSE_BUTTON_ROOT: "PitsiUINative.CloseButton.Root",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for customizing the close icon
 */
export interface CloseButtonIconProps {
  /**
   * Size of the icon
   * @default 16
   */
  size?: number;
  /**
   * Color of the icon
   * @default Uses theme foreground color
   */
  color?: string;
}

/**
 * Props for the CloseButton component
 *
 * Extends ButtonRootProps, allowing full override of all button props.
 * Defaults to variant='tertiary', size='sm', and isIconOnly=true.
 */
export type CloseButtonProps = ButtonRootProps & {
  /**
   * Props for customizing the close icon
   */
  iconProps?: CloseButtonIconProps;
};

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "h-8",
});

export const closeButtonClassNames = combineStyles({
  root,
});

/* -------------------------------------------------------------------------------------------------
 * CloseButton
 * -----------------------------------------------------------------------------------------------*/
const CloseButtonRoot = forwardRef<PressableRef, CloseButtonProps>((props, ref) => {
  const { iconProps, className, children, ...restProps } = props;

  const themeColorMuted = useThemeColor("muted");

  /** Resolved root className from close-button styles */
  const rootClassName = closeButtonClassNames.root({ className });

  return (
    <Button
      ref={ref}
      variant="tertiary"
      size="sm"
      isIconOnly
      className={rootClassName}
      hitSlop={12}
      {...restProps}
    >
      {children ?? (
        <CloseIcon size={iconProps?.size ?? 18} color={iconProps?.color ?? themeColorMuted} />
      )}
    </Button>
  );
});

CloseButtonRoot.displayName = DISPLAY_NAME.CLOSE_BUTTON_ROOT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component CloseButton - A specialized button component that renders a close icon by default.
 * It is a Button with default variant='tertiary', size='sm', and isIconOnly=true.
 * The close icon can be customized via the iconProps prop, or you can provide custom children.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/close-button
 * -----------------------------------------------------------------------------------------------*/
const CloseButton = CloseButtonRoot;

export { CloseButton };
export default CloseButton;
