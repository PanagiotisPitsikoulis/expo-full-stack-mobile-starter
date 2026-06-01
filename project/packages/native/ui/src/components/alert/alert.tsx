import { forwardRef } from "react";
import { StyleSheet } from "react-native";
import { tv } from "tailwind-variants";
import { HeroText } from "../../helpers/internal/components";
import { combineStyles } from "../../helpers/internal/utils";
import * as AlertPrimitives from "../../primitives/alert";
import type * as AlertPrimitiveTypes from "../../primitives/alert/alert.types";
import { useStatusColor } from "./alert.hooks";
import { DefaultIcon } from "./default-icon";
import { SuccessIcon } from "./success-icon";
import { WarningIcon } from "./warning-icon";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Alert components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Alert",
  INDICATOR: "PitsiUINative.Alert.Indicator",
  CONTENT: "PitsiUINative.Alert.Content",
  TITLE: "PitsiUINative.Alert.Title",
  DESCRIPTION: "PitsiUINative.Alert.Description",
};

/** Default icon size in pixels */
export const DEFAULT_ICON_SIZE = 18;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the icon rendered inside the alert indicator.
 */
export interface AlertIconProps {
  /**
   * Icon size in pixels
   *
   * @default 20
   */
  size?: number;
  /**
   * Icon color as a CSS color string
   */
  color?: string;
}

/**
 * Props for the Alert root component.
 * Renders a styled alert container with status-based visual treatment.
 */
export interface AlertRootProps extends AlertPrimitiveTypes.RootProps {
  /**
   * Children elements to render inside the alert
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Props for the Alert.Indicator component.
 * Renders a status icon by default when no children are provided.
 */
export interface AlertIndicatorProps extends AlertPrimitiveTypes.IndicatorProps {
  /**
   * Custom children to render instead of the default status icon
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Props passed to the default status icon (size and color overrides)
   */
  iconProps?: AlertIconProps;
}

/**
 * Props for the Alert.Content component.
 * Container for the title and description.
 */
export interface AlertContentProps extends AlertPrimitiveTypes.ContentProps {
  /**
   * Children elements (typically Alert.Title and Alert.Description)
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Props for the Alert.Title component.
 * Renders the alert heading with status-based text color.
 */
export interface AlertTitleProps extends Omit<AlertPrimitiveTypes.TitleProps, "asChild"> {
  /**
   * Title text content
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Props for the Alert.Description component.
 * Renders the alert body text with muted styling.
 */
export interface AlertDescriptionProps
  extends Omit<AlertPrimitiveTypes.DescriptionProps, "asChild"> {
  /**
   * Description text content
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
/**
 * Root style definition for the Alert container
 */
const root = tv({
  base: "p-3 flex-row gap-3 rounded-3xl bg-surface shadow-surface",
});

/**
 * Indicator style definition for the status icon container
 */
const indicator = tv({
  base: "pt-[3.5px]",
});

/**
 * Content style definition for the title/description wrapper
 */
const content = tv({
  base: "flex-1",
});

/**
 * Title style definition with status-based color variants
 */
const title = tv({
  base: "text-base font-medium",
  variants: {
    status: {
      default: "text-foreground",
      accent: "text-accent",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

/**
 * Description style definition
 */
const description = tv({
  base: "text-sm text-muted",
});

export const alertClassNames = combineStyles({
  root,
  indicator,
  content,
  title,
  description,
});

/** StyleSheet for native-only properties */
export const alertStyleSheet = StyleSheet.create({
  root: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/
/**
 * Resolves the default icon component based on the current alert status.
 */
export function getStatusIcon(
  status: AlertPrimitiveTypes.AlertStatus,
  iconProps: AlertIconProps,
): React.ReactElement {
  const { size = DEFAULT_ICON_SIZE, color } = iconProps;

  switch (status) {
    case "success":
      return <SuccessIcon size={size} color={color} />;
    case "warning":
      return <WarningIcon size={size} color={color} />;
    default:
      return <DefaultIcon size={size} color={color} />;
  }
}

/* -------------------------------------------------------------------------------------------------
 * Alert.Root
 * -----------------------------------------------------------------------------------------------*/
const useAlert = AlertPrimitives.useRootContext;

const AlertRoot = forwardRef<AlertPrimitiveTypes.RootRef, AlertRootProps>((props, ref) => {
  const { children, status = "default", className, style, ...restProps } = props;

  const rootClassName = alertClassNames.root({ className });

  return (
    <AlertPrimitives.Root
      ref={ref}
      status={status}
      className={rootClassName}
      style={[alertStyleSheet.root, style]}
      {...restProps}
    >
      {children}
    </AlertPrimitives.Root>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Alert.Indicator
 * -----------------------------------------------------------------------------------------------*/
const AlertIndicator = forwardRef<AlertPrimitiveTypes.IndicatorRef, AlertIndicatorProps>(
  (props, ref) => {
    const { children, className, iconProps, ...restProps } = props;

    const { status } = useAlert();
    const statusColor = useStatusColor(status);

    const indicatorClassName = alertClassNames.indicator({ className });

    /** Merge default color with user-provided iconProps */
    const resolvedIconProps: AlertIconProps = {
      size: iconProps?.size ?? DEFAULT_ICON_SIZE,
      color: iconProps?.color ?? statusColor,
    };

    return (
      <AlertPrimitives.Indicator ref={ref} className={indicatorClassName} {...restProps}>
        {children ?? getStatusIcon(status, resolvedIconProps)}
      </AlertPrimitives.Indicator>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Alert.Content
 * -----------------------------------------------------------------------------------------------*/
const AlertContent = forwardRef<AlertPrimitiveTypes.ContentRef, AlertContentProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const contentClassName = alertClassNames.content({ className });

  return (
    <AlertPrimitives.Content ref={ref} className={contentClassName} {...restProps}>
      {children}
    </AlertPrimitives.Content>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Alert.Title
 * -----------------------------------------------------------------------------------------------*/
const AlertTitle = forwardRef<AlertPrimitiveTypes.TitleRef, AlertTitleProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const { status } = useAlert();

  const titleClassName = alertClassNames.title({ status, className });

  return (
    <AlertPrimitives.Title asChild {...restProps}>
      <HeroText ref={ref} className={titleClassName}>
        {children}
      </HeroText>
    </AlertPrimitives.Title>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Alert.Description
 * -----------------------------------------------------------------------------------------------*/
const AlertDescription = forwardRef<AlertPrimitiveTypes.DescriptionRef, AlertDescriptionProps>(
  (props, ref) => {
    const { children, className, ...restProps } = props;

    const descriptionClassName = alertClassNames.description({ className });

    return (
      <AlertPrimitives.Description asChild {...restProps}>
        <HeroText ref={ref} className={descriptionClassName}>
          {children}
        </HeroText>
      </AlertPrimitives.Description>
    );
  },
);

AlertRoot.displayName = DISPLAY_NAME.ROOT;
AlertIndicator.displayName = DISPLAY_NAME.INDICATOR;
AlertContent.displayName = DISPLAY_NAME.CONTENT;
AlertTitle.displayName = DISPLAY_NAME.TITLE;
AlertDescription.displayName = DISPLAY_NAME.DESCRIPTION;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Alert - Main container that renders a styled alert with role="alert"
 *   and configurable status (default, accent, success, warning, danger).
 * @component Alert.Indicator - Renders a status-appropriate icon by default.
 * @component Alert.Content - Flex-1 wrapper for Alert.Title and Alert.Description.
 * @component Alert.Title - Heading text with status-based color.
 * @component Alert.Description - Body text rendered with muted color.
 *
 * @see https://pitsiui.com/docs/native/components/alert
 * -----------------------------------------------------------------------------------------------*/
const Alert = Object.assign(AlertRoot, {
  /** @optional Status icon rendered as the leading visual element */
  Indicator: AlertIndicator,
  /** @optional Wrapper for title and description content */
  Content: AlertContent,
  /** @optional Primary heading with status-aware text color */
  Title: AlertTitle,
  /** @optional Secondary description with muted text color */
  Description: AlertDescription,
});

export { Alert, useAlert };
export default Alert;
