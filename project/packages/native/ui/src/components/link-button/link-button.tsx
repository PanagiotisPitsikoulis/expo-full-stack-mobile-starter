import { forwardRef } from "react";
import { tv } from "tailwind-variants";
import type { PressableRef, TextRef } from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";
import {
  Button,
  type ButtonLabelProps,
  type ButtonRootPropsScaleHighlight,
  resolveAnimationObject,
} from "../button";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for LinkButton components
 */
export const DISPLAY_NAME = {
  LINK_BUTTON_ROOT: "PitsiUINative.LinkButton.Root",
  LINK_BUTTON_LABEL: "PitsiUINative.LinkButton.Label",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the LinkButton component.
 *
 * Extends ButtonRootPropsScaleHighlight with `variant` omitted — the ghost
 * variant is enforced internally and cannot be overridden by consumers.
 */
export type LinkButtonProps = Omit<ButtonRootPropsScaleHighlight, "variant">;

/**
 * Props for the LinkButton.Label sub-component.
 * Equivalent to ButtonLabelProps.
 */
export type LinkButtonLabelProps = ButtonLabelProps;

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "h-auto p-0",
});

const linkButtonClassNames = combineStyles({
  root,
});

export { linkButtonClassNames };

/* -------------------------------------------------------------------------------------------------
 * LinkButton.Root
 * -----------------------------------------------------------------------------------------------*/
const LinkButtonRoot = forwardRef<PressableRef, LinkButtonProps>((props, ref) => {
  const { className, animation, ...restProps } = props;

  const rootClassName = linkButtonClassNames.root({ className });

  const resolvedAnimation = {
    ...resolveAnimationObject(animation),
    highlight: false,
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={rootClassName}
      animation={resolvedAnimation}
      {...restProps}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * LinkButton.Label
 * -----------------------------------------------------------------------------------------------*/
const LinkButtonLabel = forwardRef<TextRef, ButtonLabelProps>((props, ref) => {
  return <Button.Label ref={ref} {...props} />;
});

LinkButtonRoot.displayName = DISPLAY_NAME.LINK_BUTTON_ROOT;
LinkButtonLabel.displayName = DISPLAY_NAME.LINK_BUTTON_LABEL;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component LinkButton - A ghost-variant button with no highlight feedback,
 * designed for inline link-style interactions (e.g. "Terms" / "Privacy Policy" links).
 * The ghost variant and disabled highlight are enforced internally and cannot be overridden.
 *
 * @component LinkButton.Label - Text content of the link button. Inherits size and variant
 * styling from the parent LinkButton context (delegates to Button.Label).
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/link-button
 * -----------------------------------------------------------------------------------------------*/
const LinkButton = Object.assign(LinkButtonRoot, {
  /** Link button label - renders text or custom content */
  Label: LinkButtonLabel,
});

export { LinkButton };
export default LinkButton;
