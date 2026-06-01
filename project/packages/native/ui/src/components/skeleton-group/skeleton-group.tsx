import type React from "react";
import type { PropsWithChildren } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { tv } from "tailwind-variants";

import { combineStyles, createContext } from "../../helpers/internal/utils";
import Skeleton, { type SkeletonProps } from "../skeleton";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for SkeletonGroup components
 */
export const DISPLAY_NAME = {
  SKELETON_GROUP_ROOT: "PitsiUINative.SkeletonGroup.Root",
  SKELETON_GROUP_ITEM: "PitsiUINative.SkeletonGroup.Item",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the SkeletonGroup root component
 */
export interface SkeletonGroupRootProps extends Omit<SkeletonProps, "style"> {
  /**
   * When true, hides the entire group when isLoading is false.
   * Use this to prevent layout issues when skeleton contains wrapper elements.
   * @default false
   */
  isSkeletonOnly?: boolean;
  /**
   * Style for the skeleton group container
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Context value for SkeletonGroup provider
 */
export interface SkeletonGroupContextValue extends SkeletonGroupRootProps {}

/**
 * Props for the SkeletonGroup.Item component
 */
export interface SkeletonGroupItemProps extends SkeletonProps {}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "",
});

export const skeletonGroupClassNames = combineStyles({
  root,
});

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const [SkeletonGroupProvider, useSkeletonGroupContext] = createContext<SkeletonGroupContextValue>({
  name: "SkeletonGroupContext",
  errorMessage: "useSkeletonGroupContext: must be used within a SkeletonGroup",
});

/* -------------------------------------------------------------------------------------------------
 * SkeletonGroup.Root
 * -----------------------------------------------------------------------------------------------*/
const SkeletonGroupRoot: React.FC<PropsWithChildren<SkeletonGroupRootProps>> = (props) => {
  const { children, className, style, isSkeletonOnly = false, ...restProps } = props;

  const rootClassName = skeletonGroupClassNames.root({ className });

  const contextValue: SkeletonGroupContextValue = { ...restProps };

  if (isSkeletonOnly && !restProps.isLoading) {
    return null;
  }

  return (
    <SkeletonGroupProvider value={contextValue}>
      <View className={rootClassName} style={style}>
        {children}
      </View>
    </SkeletonGroupProvider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * SkeletonGroup.Item
 * -----------------------------------------------------------------------------------------------*/
const SkeletonGroupItem: React.FC<SkeletonGroupItemProps> = (props) => {
  const context = useSkeletonGroupContext();

  const itemProps = {
    ...context,
    ...props,
  };

  return <Skeleton {...itemProps} />;
};

// --------------------------------------------------

SkeletonGroupRoot.displayName = DISPLAY_NAME.SKELETON_GROUP_ROOT;
SkeletonGroupItem.displayName = DISPLAY_NAME.SKELETON_GROUP_ITEM;

/**
 * Compound SkeletonGroup component for managing multiple skeleton loading states
 *
 * @component SkeletonGroup - Root container that provides centralized control for all skeleton items.
 * Passes isLoading, variant, and animation to child items via context.
 *
 * @component SkeletonGroup.Item - Individual skeleton item that inherits props from the parent group.
 * Can override group props with its own props for specific customization.
 *
 * Props flow from SkeletonGroup to Items via context (isLoading, variant, animation).
 * Items can override any inherited prop by passing their own values.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/skeleton-group
 */
const SkeletonGroup = Object.assign(SkeletonGroupRoot, {
  /** @optional Individual skeleton item that inherits group settings */
  Item: SkeletonGroupItem,
});

export default SkeletonGroup;
export { SkeletonGroup, useSkeletonGroupContext };
