import { Children, forwardRef, useMemo } from "react";
import {
  type StyleProp,
  StyleSheet,
  type TextProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { tv } from "tailwind-variants";

import { useThemeColor } from "../../helpers/external/hooks";
import { HeroText } from "../../helpers/internal/components";
import { CloseIcon } from "../../helpers/internal/components/close-icon";
import { AnimationSettingsProvider, FormFieldProvider } from "../../helpers/internal/contexts";
import type {
  AnimationRootDisableAll,
  PressableRef,
  TextRef,
  ViewRef,
} from "../../helpers/internal/types";
import { childrenToString, combineStyles, createContext } from "../../helpers/internal/utils";
import * as TagGroupPrimitives from "../../primitives/tag-group";
import {
  useItemContext as usePrimitiveItemContext,
  useRootContext as usePrimitiveRootContext,
} from "../../primitives/tag-group";
import type * as TagGroupPrimitivesTypes from "../../primitives/tag-group/tag-group.types";
import { useTagGroupRootAnimation } from "./tag-group.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for TagGroup components
 */
export const DISPLAY_NAME = {
  TAG_GROUP_ROOT: "PitsiUINative.TagGroup.Root",
  TAG_GROUP_LIST: "PitsiUINative.TagGroup.List",
  TAG_GROUP_ITEM: "PitsiUINative.TagGroup.Item",
  TAG_GROUP_ITEM_LABEL: "PitsiUINative.TagGroup.ItemLabel",
  TAG_GROUP_ITEM_REMOVE_BUTTON: "PitsiUINative.TagGroup.ItemRemoveButton",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Size variants for TagGroup tags
 */
export type TagGroupSize = "sm" | "md" | "lg";

/**
 * Visual variant for TagGroup tags
 */
export type TagGroupVariant = "default" | "surface";

/**
 * Render props passed to TagGroup.Item's render function children
 */
export interface TagRenderProps {
  isSelected: boolean;
  isDisabled: boolean;
}

/**
 * Props for the TagGroup root component.
 */
export interface TagGroupProps extends Omit<TagGroupPrimitivesTypes.RootProps, "asChild"> {
  size?: TagGroupSize;
  variant?: TagGroupVariant;
  className?: string;
  animation?: AnimationRootDisableAll;
}

/**
 * Props for the TagGroup.List component.
 */
export interface TagGroupListProps extends ViewProps {
  children?: React.ReactNode;
  className?: string;
  renderEmptyState?: () => React.ReactNode;
}

/**
 * Props for the TagGroup.Item component.
 */
export interface TagGroupItemProps
  extends Omit<TagGroupPrimitivesTypes.ItemProps, "asChild" | "children"> {
  children?: React.ReactNode | ((renderProps: TagRenderProps) => React.ReactNode);
  className?: string;
}

/**
 * Props for the TagGroup.ItemLabel component.
 */
export interface TagGroupItemLabelProps extends TextProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Props for customizing the default remove icon
 */
export interface TagRemoveButtonIconProps {
  size?: number;
  color?: string;
}

/**
 * Props for the TagGroup.ItemRemoveButton component.
 */
export interface TagGroupItemRemoveButtonProps
  extends Omit<TagGroupPrimitivesTypes.RemoveButtonProps, "asChild"> {
  children?: React.ReactNode;
  className?: string;
  iconProps?: TagRemoveButtonIconProps;
}

/**
 * Context value shared between TagGroup and its child components
 */
export interface TagGroupContextValue {
  size: TagGroupSize;
  variant: TagGroupVariant;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "gap-3",
});

const list = tv({
  base: "flex-row flex-wrap gap-2",
});

const tag = tv({
  base: "gap-1 flex-row items-center",
  variants: {
    variant: {
      default: "bg-default",
      surface: "bg-surface",
    },
    size: {
      sm: "p-0.5 px-2 gap-1 rounded-xl",
      md: "p-1 px-2.5 gap-1 rounded-2xl",
      lg: "p-1.5 px-3 gap-1.5 rounded-3xl",
    },
    isSelected: {
      true: "bg-accent-soft",
    },
    isDisabled: {
      true: "disabled:opacity-disabled disabled:pointer-events-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    isSelected: false,
    isDisabled: false,
  },
});

const tagLabel = tv({
  base: "font-medium text-field-foreground",
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    isSelected: {
      true: "text-accent-soft-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    isSelected: false,
  },
});

const removeButton = tv({
  base: "rounded-lg items-center justify-center",
});

export const tagGroupClassNames = combineStyles({
  root,
  list,
  tag,
  tagLabel,
  removeButton,
});

export const tagGroupStyleSheet = StyleSheet.create({
  tag: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
/**
 * Internal context for size and variant.
 */
const [TagGroupProvider, useInnerTagGroupContext] = createContext<TagGroupContextValue>({
  name: "TagGroupContext",
});

/** Re-exports primitive useRootContext */
const useTagGroup = usePrimitiveRootContext;

/** Re-exports primitive useItemContext */
const useTagGroupItem = usePrimitiveItemContext;

/* -------------------------------------------------------------------------------------------------
 * TagGroup components
 * -----------------------------------------------------------------------------------------------*/
const TagGroupRoot = forwardRef<ViewRef, TagGroupProps>((props, ref) => {
  const {
    children,
    size = "md",
    variant = "default",
    className,
    style,
    animation,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    ...restProps
  } = props;

  const rootClassName = tagGroupClassNames.root({
    className,
  });

  const { isAllAnimationsDisabled } = useTagGroupRootAnimation({
    animation,
  });

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const formFieldContextValue = useMemo(
    () => ({
      isDisabled: isDisabled ?? false,
      isInvalid: isInvalid ?? false,
      isRequired: isRequired ?? false,
      hasFieldPadding: false,
    }),
    [isDisabled, isInvalid, isRequired],
  );

  const contextValue = useMemo(
    () => ({
      size,
      variant,
    }),
    [size, variant],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <FormFieldProvider value={formFieldContextValue}>
        <TagGroupProvider value={contextValue}>
          <TagGroupPrimitives.Root
            ref={ref}
            className={rootClassName}
            style={style}
            isDisabled={isDisabled}
            {...restProps}
          >
            {children}
          </TagGroupPrimitives.Root>
        </TagGroupProvider>
      </FormFieldProvider>
    </AnimationSettingsProvider>
  );
});

// --------------------------------------------------

const TagGroupList = forwardRef<ViewRef, TagGroupListProps>((props, ref) => {
  const { children, className, style, renderEmptyState, ...restProps } = props;

  const listClassName = tagGroupClassNames.list({
    className,
  });

  const hasChildren = Children.count(children) > 0;

  return (
    <TagGroupPrimitives.List ref={ref} className={listClassName} style={style} {...restProps}>
      {hasChildren ? children : renderEmptyState?.()}
    </TagGroupPrimitives.List>
  );
});

// --------------------------------------------------

const TagGroupItem = forwardRef<PressableRef, TagGroupItemProps>((props, ref) => {
  const { children, className, style, id, isDisabled: isDisabledProp, ...restProps } = props;

  const { variant, size } = useInnerTagGroupContext();

  const { selectedKeys, disabledKeys, isDisabled: isRootDisabled } = usePrimitiveRootContext();

  const isSelected = selectedKeys.has(id);
  const isDisabled = isRootDisabled || disabledKeys.has(id) || (isDisabledProp ?? false);

  const tagClassName = tagGroupClassNames.tag({
    variant,
    size,
    isSelected,
    isDisabled,
    className,
  });

  if (typeof children === "function") {
    const renderProps: TagRenderProps = {
      isSelected,
      isDisabled,
    };

    return (
      <TagGroupPrimitives.Item
        ref={ref}
        id={id}
        isDisabled={isDisabledProp}
        className={tagClassName}
        style={[tagGroupStyleSheet.tag, style] as StyleProp<ViewStyle>}
        {...restProps}
      >
        {children(renderProps)}
      </TagGroupPrimitives.Item>
    );
  }

  const stringifiedChildren = childrenToString(children);

  return (
    <TagGroupPrimitives.Item
      ref={ref}
      id={id}
      isDisabled={isDisabledProp}
      className={tagClassName}
      style={[tagGroupStyleSheet.tag, style] as StyleProp<ViewStyle>}
      {...restProps}
    >
      {stringifiedChildren ? (
        <TagGroupItemLabel>{stringifiedChildren}</TagGroupItemLabel>
      ) : (
        children
      )}
    </TagGroupPrimitives.Item>
  );
});

// --------------------------------------------------

const TagGroupItemLabel = forwardRef<TextRef, TagGroupItemLabelProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const { isSelected } = usePrimitiveItemContext();
  const { size } = useInnerTagGroupContext();

  const tagLabelClassName = tagGroupClassNames.tagLabel({
    size,
    isSelected,
    className,
  });

  return (
    <TagGroupPrimitives.ItemLabel asChild>
      <HeroText ref={ref} className={tagLabelClassName} {...restProps}>
        {children}
      </HeroText>
    </TagGroupPrimitives.ItemLabel>
  );
});

// --------------------------------------------------
const TagGroupItemRemoveButton = forwardRef<PressableRef, TagGroupItemRemoveButtonProps>(
  (props, ref) => {
    const { children, className, iconProps, hitSlop = 8, ...restProps } = props;

    const { isSelected } = usePrimitiveItemContext();

    const [themeColorFieldForeground, themeColorAccentForeground] = useThemeColor([
      "field-foreground",
      "accent-soft-foreground",
    ]);

    const removeButtonClassName = tagGroupClassNames.removeButton({
      className,
    });

    const defaultIconColor = isSelected ? themeColorAccentForeground : themeColorFieldForeground;

    const defaultIcon = (
      <CloseIcon size={iconProps?.size ?? 12} color={iconProps?.color ?? defaultIconColor} />
    );

    return (
      <TagGroupPrimitives.RemoveButton
        ref={ref}
        className={removeButtonClassName}
        hitSlop={hitSlop}
        {...restProps}
      >
        {children ?? defaultIcon}
      </TagGroupPrimitives.RemoveButton>
    );
  },
);

// --------------------------------------------------

TagGroupRoot.displayName = DISPLAY_NAME.TAG_GROUP_ROOT;
TagGroupList.displayName = DISPLAY_NAME.TAG_GROUP_LIST;
TagGroupItem.displayName = DISPLAY_NAME.TAG_GROUP_ITEM;
TagGroupItemLabel.displayName = DISPLAY_NAME.TAG_GROUP_ITEM_LABEL;
TagGroupItemRemoveButton.displayName = DISPLAY_NAME.TAG_GROUP_ITEM_REMOVE_BUTTON;

/**
 * Compound TagGroup component with sub-components
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/tag-group
 */
const TagGroup = Object.assign(TagGroupRoot, {
  /** Container for the list of tags */
  List: TagGroupList,
  /** Individual tag item within the group */
  Item: TagGroupItem,
  /** Text label for the tag item */
  ItemLabel: TagGroupItemLabel,
  /** Remove button for the tag item */
  ItemRemoveButton: TagGroupItemRemoveButton,
});

export { TagGroup, useTagGroup, useTagGroupItem };
export default TagGroup;
