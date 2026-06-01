import { forwardRef } from "react";
import { type TextProps, View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { HeroText } from "../../helpers/internal/components/hero-text";
import type { TextRef, ViewRef } from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";
import { Surface, type SurfaceRootProps } from "../surface";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Card components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Card.Root",
  HEADER: "PitsiUINative.Card.Header",
  BODY: "PitsiUINative.Card.Body",
  FOOTER: "PitsiUINative.Card.Footer",
  TITLE: "PitsiUINative.Card.Title",
  DESCRIPTION: "PitsiUINative.Card.Description",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the Card.Root component
 */
export interface CardRootProps extends SurfaceRootProps {}

/**
 * Props for the Card.Header component
 */
export interface CardHeaderProps extends ViewProps {
  /**
   * Children elements to be rendered inside the header
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Props for the Card.Body component
 */
export interface CardBodyProps extends ViewProps {
  /**
   * Children elements to be rendered inside the body
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Props for the Card.Footer component
 */
export interface CardFooterProps extends ViewProps {
  /**
   * Children elements to be rendered inside the footer
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Props for the Card.Title component
 */
export interface CardTitleProps extends TextProps {
  /**
   * Children elements to be rendered as the title text
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Props for the Card.Description component
 */
export interface CardDescriptionProps extends TextProps {
  /**
   * Children elements to be rendered as the description text
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "",
});

const header = tv({
  base: "",
});

const body = tv({
  base: "",
});

const footer = tv({
  base: "",
});

const label = tv({
  base: "text-lg text-foreground font-medium",
});

const description = tv({
  base: "text-base text-muted",
});

export const cardClassNames = combineStyles({
  root,
  header,
  body,
  footer,
  label,
  description,
});

/* -------------------------------------------------------------------------------------------------
 * Card.Root
 * -----------------------------------------------------------------------------------------------*/
const CardRoot = forwardRef<ViewRef, CardRootProps>((props, ref) => {
  const { children, variant = "default", className, ...restProps } = props;

  const rootClassName = cardClassNames.root({ className });

  return (
    <Surface ref={ref} variant={variant} className={rootClassName} {...restProps}>
      {children}
    </Surface>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Card.Header
 * -----------------------------------------------------------------------------------------------*/
const CardHeader = forwardRef<ViewRef, CardHeaderProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const headerClassName = cardClassNames.header({ className });

  return (
    <View ref={ref} className={headerClassName} {...restProps}>
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Card.Body
 * -----------------------------------------------------------------------------------------------*/
const CardBody = forwardRef<ViewRef, CardBodyProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const bodyClassName = cardClassNames.body({ className });

  return (
    <View ref={ref} className={bodyClassName} {...restProps}>
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Card.Footer
 * -----------------------------------------------------------------------------------------------*/
const CardFooter = forwardRef<ViewRef, CardFooterProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const footerClassName = cardClassNames.footer({ className });

  return (
    <View ref={ref} className={footerClassName} {...restProps}>
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Card.Title
 * -----------------------------------------------------------------------------------------------*/
const CardTitle = forwardRef<TextRef, CardTitleProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const titleClassName = cardClassNames.label({ className });

  return (
    <HeroText ref={ref} className={titleClassName} {...restProps}>
      {children}
    </HeroText>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Card.Description
 * -----------------------------------------------------------------------------------------------*/
const CardDescription = forwardRef<TextRef, CardDescriptionProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const descriptionClassName = cardClassNames.description({
    className,
  });

  return (
    <HeroText ref={ref} className={descriptionClassName} {...restProps}>
      {children}
    </HeroText>
  );
});

CardRoot.displayName = DISPLAY_NAME.ROOT;
CardHeader.displayName = DISPLAY_NAME.HEADER;
CardBody.displayName = DISPLAY_NAME.BODY;
CardFooter.displayName = DISPLAY_NAME.FOOTER;
CardTitle.displayName = DISPLAY_NAME.TITLE;
CardDescription.displayName = DISPLAY_NAME.DESCRIPTION;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Card - Main container that extends Surface component. Provides base card structure
 *   with configurable surface variants and handles overall layout.
 * @component Card.Header - Header section for top-aligned content like icons or badges.
 * @component Card.Body - Main content area with flex-1 that expands to fill all available space
 *   between Card.Header and Card.Footer.
 * @component Card.Title - Title text with foreground color and medium font weight.
 * @component Card.Description - Description text with muted color and smaller font size.
 * @component Card.Footer - Footer section for bottom-aligned actions like buttons.
 *
 * @see https://pitsiui.com/docs/native/components/card
 * -----------------------------------------------------------------------------------------------*/
const Card = Object.assign(CardRoot, {
  /** @optional Top-aligned header section */
  Header: CardHeader,
  /** @optional Main content area that expands between header and footer */
  Body: CardBody,
  /** @optional Bottom-aligned footer for actions */
  Footer: CardFooter,
  /** @optional Title text with styled typography */
  Title: CardTitle,
  /** @optional Description text with muted styling */
  Description: CardDescription,
});

export { Card };
export default Card;
