import { forwardRef } from "react";
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  type TextProps,
  View,
  type ViewProps,
} from "react-native";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { ChevronRightIcon, HeroText } from "../../helpers/internal/components";
import type { PressableRef, TextRef, ViewRef } from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";
import Surface, { type SurfaceVariant } from "../surface";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for ListGroup components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUI.ListGroup.Root",
  ITEM: "PitsiUI.ListGroup.Item",
  ITEM_PREFIX: "PitsiUI.ListGroup.ItemPrefix",
  ITEM_CONTENT: "PitsiUI.ListGroup.ItemContent",
  ITEM_TITLE: "PitsiUI.ListGroup.ItemTitle",
  ITEM_DESCRIPTION: "PitsiUI.ListGroup.ItemDescription",
  ITEM_SUFFIX: "PitsiUI.ListGroup.ItemSuffix",
};

/**
 * Default icon size for the suffix chevron-right icon (in pixels)
 */
export const DEFAULT_ICON_SIZE = 16;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the ListGroup.Root component.
 * Renders a Surface-based container for grouped list items.
 */
export interface ListGroupRootProps extends ViewProps {
  /**
   * Children elements to be rendered inside the list group
   */
  children?: React.ReactNode;
  /**
   * Visual variant of the underlying Surface
   * @default "default"
   */
  variant?: SurfaceVariant;
  /**
   * Additional CSS classes for the root container
   */
  className?: string;
}

/**
 * Props for the ListGroup.Item component.
 * Renders a single pressable row inside the list group.
 */
export interface ListGroupItemProps extends PressableProps {
  /**
   * Children elements to be rendered inside the item
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes for the item
   */
  className?: string;
}

/**
 * Props for icon elements used by ListGroup sub-components
 */
export interface ListGroupIconProps {
  /**
   * Size of the icon in pixels
   * @default 16
   */
  size?: number;
  /**
   * Color of the icon
   */
  color?: string;
}

/**
 * Props for the ListGroup.ItemPrefix component.
 * Renders content before the item content area (e.g. an icon or avatar).
 */
export interface ListGroupItemPrefixProps extends ViewProps {
  /**
   * Children elements to be rendered inside the prefix slot
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes for the prefix
   */
  className?: string;
}

/**
 * Props for the ListGroup.ItemContent component.
 * Renders the main content area of an item, typically containing title and description.
 */
export interface ListGroupItemContentProps extends ViewProps {
  /**
   * Children elements to be rendered inside the content area
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes for the content area
   */
  className?: string;
}

/**
 * Props for the ListGroup.ItemTitle component.
 * Renders the primary text label for an item.
 */
export interface ListGroupItemTitleProps extends TextProps {
  /**
   * Title text or custom content
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes for the title
   */
  className?: string;
}

/**
 * Props for the ListGroup.ItemDescription component.
 * Renders secondary descriptive text below the title.
 */
export interface ListGroupItemDescriptionProps extends TextProps {
  /**
   * Description text or custom content
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes for the description
   */
  className?: string;
}

/**
 * Props for the ListGroup.ItemSuffix component.
 * Renders trailing content for an item, with a default chevron-right icon.
 */
export interface ListGroupItemSuffixProps extends ViewProps {
  /**
   * Children elements to override the default chevron-right icon
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes for the suffix
   */
  className?: string;
  /**
   * Props to customise the default chevron-right icon.
   * Only takes effect when no children are provided.
   */
  iconProps?: ListGroupIconProps;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "p-0",
});

const item = tv({
  base: "flex-row items-center p-4 gap-3",
});

const itemContent = tv({
  base: "flex-1",
});

const itemTitle = tv({
  base: "text-base text-foreground font-medium",
});

const itemDescription = tv({
  base: "text-sm text-muted",
});

const listGroupClassNames = combineStyles({
  root,
  item,
  itemContent,
  itemTitle,
  itemDescription,
});

export const styleSheet = StyleSheet.create({
  root: {
    borderCurve: "continuous",
  },
});

export { listGroupClassNames };

/* -------------------------------------------------------------------------------------------------
 * ListGroup.Root
 * -----------------------------------------------------------------------------------------------*/
const ListGroupRoot = forwardRef<ViewRef, ListGroupRootProps>((props, ref) => {
  const { children, variant = "default", className, style, ...restProps } = props;

  const rootClassName = listGroupClassNames.root({ className });

  return (
    <Surface
      ref={ref}
      variant={variant}
      className={rootClassName}
      style={[styleSheet.root, style]}
      {...restProps}
    >
      {children}
    </Surface>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ListGroup.Item
 * -----------------------------------------------------------------------------------------------*/
const ListGroupItem = forwardRef<PressableRef, ListGroupItemProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const itemClassName = listGroupClassNames.item({ className });

  return (
    <Pressable ref={ref} className={itemClassName} {...restProps}>
      {children}
    </Pressable>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ListGroup.ItemPrefix
 * -----------------------------------------------------------------------------------------------*/
const ListGroupItemPrefix = forwardRef<ViewRef, ListGroupItemPrefixProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <View ref={ref} {...restProps}>
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ListGroup.ItemContent
 * -----------------------------------------------------------------------------------------------*/
const ListGroupItemContent = forwardRef<ViewRef, ListGroupItemContentProps>((props, ref) => {
  const { children, className, style, ...restProps } = props;

  const contentClassName = listGroupClassNames.itemContent({ className });

  return (
    <View ref={ref} className={contentClassName} style={style} {...restProps}>
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ListGroup.ItemTitle
 * -----------------------------------------------------------------------------------------------*/
const ListGroupItemTitle = forwardRef<TextRef, ListGroupItemTitleProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const titleClassName = listGroupClassNames.itemTitle({ className });

  return (
    <HeroText ref={ref} className={titleClassName} {...restProps}>
      {children}
    </HeroText>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ListGroup.ItemDescription
 * -----------------------------------------------------------------------------------------------*/
const ListGroupItemDescription = forwardRef<TextRef, ListGroupItemDescriptionProps>(
  (props, ref) => {
    const { children, className, ...restProps } = props;

    const descriptionClassName = listGroupClassNames.itemDescription({
      className,
    });

    return (
      <HeroText ref={ref} className={descriptionClassName} {...restProps}>
        {children}
      </HeroText>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * ListGroup.ItemSuffix
 * -----------------------------------------------------------------------------------------------*/
const ListGroupItemSuffix = forwardRef<ViewRef, ListGroupItemSuffixProps>((props, ref) => {
  const { children, iconProps, ...restProps } = props;

  const themeColorMuted = useThemeColor("muted");

  const resolvedIconProps: ListGroupIconProps = {
    size: iconProps?.size ?? DEFAULT_ICON_SIZE,
    color: iconProps?.color ?? themeColorMuted,
  };

  return (
    <View ref={ref} {...restProps}>
      {children ?? (
        <ChevronRightIcon size={resolvedIconProps.size} color={resolvedIconProps.color} />
      )}
    </View>
  );
});

ListGroupRoot.displayName = DISPLAY_NAME.ROOT;
ListGroupItem.displayName = DISPLAY_NAME.ITEM;
ListGroupItemPrefix.displayName = DISPLAY_NAME.ITEM_PREFIX;
ListGroupItemContent.displayName = DISPLAY_NAME.ITEM_CONTENT;
ListGroupItemTitle.displayName = DISPLAY_NAME.ITEM_TITLE;
ListGroupItemDescription.displayName = DISPLAY_NAME.ITEM_DESCRIPTION;
ListGroupItemSuffix.displayName = DISPLAY_NAME.ITEM_SUFFIX;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component ListGroup - Surface-based container that groups related list items.
 * Supports all Surface variants (default, secondary, tertiary, transparent).
 *
 * @component ListGroup.Item - Horizontal flex-row container for a single item,
 * providing consistent spacing and alignment.
 *
 * @component ListGroup.ItemPrefix - Optional leading content slot for icons,
 * avatars, or other visual elements.
 *
 * @component ListGroup.ItemContent - Flex-1 wrapper for title and description,
 * occupying the remaining horizontal space.
 *
 * @component ListGroup.ItemTitle - Primary text label styled with foreground color
 * and medium font weight.
 *
 * @component ListGroup.ItemDescription - Secondary text styled with muted color
 * and smaller font size.
 *
 * @component ListGroup.ItemSuffix - Optional trailing content slot. Renders a
 * chevron-right icon by default; accepts children to override the default icon.
 * Supports iconProps (size, color) for customising the default chevron.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/list-group
 * -----------------------------------------------------------------------------------------------*/
const ListGroup = Object.assign(ListGroupRoot, {
  /** @optional Single item row with flex-row layout */
  Item: ListGroupItem,
  /** @optional Leading visual element (icon / avatar) */
  ItemPrefix: ListGroupItemPrefix,
  /** @optional Flex-1 content wrapper for title and description */
  ItemContent: ListGroupItemContent,
  /** @optional Primary text label */
  ItemTitle: ListGroupItemTitle,
  /** @optional Secondary descriptive text */
  ItemDescription: ListGroupItemDescription,
  /** @optional Trailing element, defaults to chevron-right icon */
  ItemSuffix: ListGroupItemSuffix,
});

export { ListGroup };
export default ListGroup;
