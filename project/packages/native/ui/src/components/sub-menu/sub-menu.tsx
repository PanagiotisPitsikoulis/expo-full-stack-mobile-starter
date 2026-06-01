import {
  type FC,
  forwardRef,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type LayoutChangeEvent,
  type StyleProp,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  type WithSpringConfig,
  withTiming,
} from "react-native-reanimated";
import { tv } from "tailwind-variants";

import { useThemeColor } from "../../helpers/external/hooks";
import { ChevronRightIcon } from "../../helpers/internal/components";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import type {
  Animation,
  AnimationRoot,
  AnimationValue,
  ViewRef,
} from "../../helpers/internal/types";
import { combineStyles } from "../../helpers/internal/utils";
import { useRootContext as useMenu } from "../../primitives/menu";
import * as SubMenuPrimitives from "../../primitives/sub-menu";
import type * as SubMenuPrimitivesTypes from "../../primitives/sub-menu/sub-menu.types";
import {
  SubMenuAnimationProvider,
  useRootContentContainerAnimation,
  useSubMenuAnimation,
  useSubMenuRootAnimation,
  useSubMenuTriggerIndicatorAnimation,
} from "./sub-menu.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for the SubMenu components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.SubMenu.Root",
  TRIGGER: "PitsiUINative.SubMenu.Trigger",
  TRIGGER_INDICATOR: "PitsiUINative.SubMenu.TriggerIndicator",
  CONTENT: "PitsiUINative.SubMenu.Content",
};

/** Default icon size for the trigger indicator chevron */
export const DEFAULT_INDICATOR_ICON_SIZE = 16;

/** Spring configuration for indicator rotation animation */
export const INDICATOR_SPRING_CONFIG = {
  damping: 140,
  stiffness: 1000,
  mass: 4,
};

/** Default padding above submenu content when expanded */
export const DEFAULT_ROOT_CONTENT_PADDING_TOP = 12;

/** Spring config for root content container expand/collapse animation */
export const ROOT_CONTENT_SPRING_CONFIG = {
  damping: 100,
  stiffness: 950,
  mass: 3,
};

/** Default margin horizontal/vertical when submenu is open */
export const DEFAULT_ROOT_CONTENT_MARGIN = -16;

/** Default padding horizontal when submenu is open */
export const DEFAULT_ROOT_CONTENT_PADDING_HORIZONTAL = 6;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation configuration for SubMenu root content container.
 */
export type SubMenuRootAnimation = AnimationRoot<{
  rootContent?: AnimationValue<{
    marginHorizontal?: number;
    marginVertical?: number;
    paddingHorizontal?: number;
    paddingTop?: number;
    springConfig?: WithSpringConfig;
  }>;
}>;

/**
 * Props for the SubMenu Root component.
 */
export interface SubMenuRootProps extends SubMenuPrimitivesTypes.RootProps {
  children?: ReactNode;
  className?: string;
  animation?: SubMenuRootAnimation;
}

/**
 * Props for the SubMenu Trigger component.
 */
export interface SubMenuTriggerProps extends SubMenuPrimitivesTypes.TriggerProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Icon configuration for the SubMenu trigger indicator
 */
export interface SubMenuTriggerIndicatorIconProps {
  size?: number;
  color?: string;
}

/**
 * Animation configuration for the SubMenu trigger indicator.
 */
export type SubMenuTriggerIndicatorAnimation = Animation<{
  rotation?: AnimationValue<{
    value?: [number, number];
    springConfig?: WithSpringConfig;
  }>;
}>;

/**
 * Props for the SubMenu.TriggerIndicator component.
 */
export interface SubMenuTriggerIndicatorProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  iconProps?: SubMenuTriggerIndicatorIconProps;
  animation?: SubMenuTriggerIndicatorAnimation;
  isAnimatedStyleActive?: boolean;
}

/**
 * Props for the SubMenu Content component.
 */
export interface SubMenuContentProps
  extends Omit<SubMenuPrimitivesTypes.ContentProps, "forceMount"> {
  className?: string;
  children?: ReactNode;
}

/**
 * Context value for sub-menu animation.
 */
export interface SubMenuAnimationContextValue {
  triggerHeight: SharedValue<number>;
  contentHeight: SharedValue<number>;
  contentPaddingTop: SharedValue<number>;
}

export type {
  ContentRef as SubMenuContentRef,
  ISubMenuContext,
  RootRef as SubMenuRootRef,
  TriggerRef as SubMenuTriggerRef,
} from "../../primitives/sub-menu/sub-menu.types";

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "absolute top-0 left-0 right-0 bg-overlay rounded-3xl overflow-hidden",
  variants: {
    isOpen: {
      true: "outline outline-border/20 shadow-overlay",
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

/** Trigger styled as a menu item row. */
const trigger = tv({
  base: "flex-row items-center gap-2.5 px-2.5 py-2",
  variants: {
    isDisabled: {
      true: "opacity-disabled pointer-events-none",
    },
    isOtherSubMenuOpen: {
      true: "opacity-40 pointer-events-none",
    },
  },
});

const triggerIndicator = tv({
  base: "items-center justify-center",
});

/** SubMenu content positioned absolutely below the trigger. */
const content = tv({
  base: "absolute left-0 right-0 px-1.5 pb-3",
});

export const subMenuClassNames = combineStyles({
  root,
  trigger,
  triggerIndicator,
  content,
});

export const subMenuStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * SubMenu components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedContent = Animated.createAnimatedComponent(SubMenuPrimitives.Content);

const useSubMenu = SubMenuPrimitives.useSubMenuContext;

// --------------------------------------------------

const SubMenuRoot = forwardRef<SubMenuPrimitivesTypes.RootRef, SubMenuRootProps>(
  ({ children, isOpen: isOpenProp, isDefaultOpen, animation, className, style, ...props }, ref) => {
    const { presentation } = useMenu();

    if (__DEV__) {
      if (presentation === "bottom-sheet") {
        throw new Error(
          'SubMenu cannot be used inside a Menu with presentation="bottom-sheet". Use presentation="popover" instead.',
        );
      }
    }

    const animationSettingsContext = useAnimationSettings();
    const { isAllAnimationsDisabled, triggerHeight, contentHeight, contentPaddingTop } =
      useSubMenuRootAnimation({ animation });

    const animationContextValue = useMemo(
      () => ({ triggerHeight, contentHeight, contentPaddingTop }),
      [triggerHeight, contentHeight, contentPaddingTop],
    );

    return (
      <AnimationSettingsProvider
        value={{
          ...animationSettingsContext,
          isAllAnimationsDisabled,
        }}
      >
        <SubMenuAnimationProvider value={animationContextValue}>
          <SubMenuPrimitives.Root
            ref={ref}
            isOpen={isOpenProp}
            isDefaultOpen={isDefaultOpen}
            {...props}
          >
            <RootContentContainer animation={animation} className={className} style={style}>
              {children}
            </RootContentContainer>
          </SubMenuPrimitives.Root>
        </SubMenuAnimationProvider>
      </AnimationSettingsProvider>
    );
  },
);

// --------------------------------------------------

const RootContentContainer: FC<
  PropsWithChildren<{
    animation?: SubMenuRootAnimation;
    className?: string;
    style?: StyleProp<ViewStyle>;
  }>
> = ({ children, animation, className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onOpenChange, nativeID } = useSubMenu();
  const { openSubMenuId, openSubMenu, closeSubMenu } = useMenu();
  const { rOuterContainerStyle, rInnerContentStyle } = useRootContentContainerAnimation({
    animation,
  });

  const rootClassName = subMenuClassNames.root({ isOpen, className });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  /** Register / unregister this sub-menu with the parent Menu context. */
  useEffect(() => {
    if (isOpen) {
      openSubMenu(nativeID);
    } else {
      closeSubMenu(nativeID);
    }
    return () => {
      closeSubMenu(nativeID);
    };
  }, [isOpen, nativeID, openSubMenu, closeSubMenu]);

  /** Close this sub-menu when it's no longer the active one (e.g. backdrop press). */
  useEffect(() => {
    if (openSubMenuId !== nativeID && isOpen) {
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSubMenuId, onOpenChange, nativeID, isOpen]);

  return (
    <Animated.View className={isOpen ? "z-50" : "z-40"} style={rOuterContainerStyle}>
      {isMounted ? (
        <Animated.View className={rootClassName} style={rInnerContentStyle}>
          {children}
        </Animated.View>
      ) : (
        children
      )}
    </Animated.View>
  );
};

// --------------------------------------------------

const SubMenuTrigger = forwardRef<SubMenuPrimitivesTypes.TriggerRef, SubMenuTriggerProps>(
  ({ children, className, style, onLayout: onLayoutProp, isDisabled = false, ...props }, ref) => {
    const { triggerHeight } = useSubMenuAnimation();
    const { openSubMenuId } = useMenu();
    const subMenuContext = useSubMenu();

    const isOtherSubMenuOpen = openSubMenuId !== null && openSubMenuId !== subMenuContext.nativeID;

    const triggerClassName = subMenuClassNames.trigger({
      className,
      isDisabled,
      isOtherSubMenuOpen,
    });

    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        triggerHeight.value = event.nativeEvent.layout.height;
        onLayoutProp?.(event);
      },
      [triggerHeight, onLayoutProp],
    );

    return (
      <SubMenuPrimitives.Trigger
        ref={ref}
        className={triggerClassName}
        style={
          typeof style === "function"
            ? (state) => [subMenuStyleSheet.borderCurve, style(state)]
            : [subMenuStyleSheet.borderCurve, style]
        }
        isDisabled={isDisabled || isOtherSubMenuOpen}
        onLayout={handleLayout}
        {...props}
      >
        {children}
      </SubMenuPrimitives.Trigger>
    );
  },
);

// --------------------------------------------------

const SubMenuTriggerIndicator = forwardRef<ViewRef, SubMenuTriggerIndicatorProps>(
  (
    {
      children,
      className,
      iconProps,
      animation,
      isAnimatedStyleActive = true,
      style,
      ...restProps
    },
    ref,
  ) => {
    const { isOpen } = useSubMenu();

    const themeColorMuted = useThemeColor("muted");

    const indicatorClassName = subMenuClassNames.triggerIndicator({
      className,
    });

    const { rContainerStyle } = useSubMenuTriggerIndicatorAnimation({
      animation,
      isOpen,
    });

    const indicatorStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

    if (children) {
      return (
        <Animated.View ref={ref} className={indicatorClassName} style={style} {...restProps}>
          {children}
        </Animated.View>
      );
    }

    return (
      <Animated.View ref={ref} className={indicatorClassName} style={indicatorStyle} {...restProps}>
        <ChevronRightIcon
          size={iconProps?.size ?? DEFAULT_INDICATOR_ICON_SIZE}
          color={iconProps?.color ?? themeColorMuted}
        />
      </Animated.View>
    );
  },
);

// --------------------------------------------------

const SubMenuContent = forwardRef<SubMenuPrimitivesTypes.ContentRef, SubMenuContentProps>(
  ({ children, className, style, onLayout: onLayoutProp, ...props }, ref) => {
    const { isOpen } = useSubMenu();

    const contentClassName = subMenuClassNames.content({ className });

    const { triggerHeight, contentHeight, contentPaddingTop } = useSubMenuAnimation();

    const rContainerStyle = useAnimatedStyle(() => ({
      top: triggerHeight.get() + contentPaddingTop.get(),
      opacity: withTiming(isOpen ? 1 : 0, { duration: 150 }),
    }));

    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        contentHeight.value = event.nativeEvent.layout.height;
        onLayoutProp?.(event);
      },
      [contentHeight, onLayoutProp],
    );

    return (
      <AnimatedContent
        ref={ref}
        className={contentClassName}
        style={
          typeof style === "function"
            ? (state) => [rContainerStyle, style(state)]
            : [rContainerStyle, style]
        }
        pointerEvents={isOpen ? "auto" : "none"}
        onLayout={handleLayout}
        forceMount
        {...props}
      >
        {children}
      </AnimatedContent>
    );
  },
);

// --------------------------------------------------

SubMenuRoot.displayName = DISPLAY_NAME.ROOT;
SubMenuTrigger.displayName = DISPLAY_NAME.TRIGGER;
SubMenuTriggerIndicator.displayName = DISPLAY_NAME.TRIGGER_INDICATOR;
SubMenuContent.displayName = DISPLAY_NAME.CONTENT;

/**
 * Compound SubMenu component with sub-components.
 */
const SubMenu = Object.assign(SubMenuRoot, {
  Trigger: SubMenuTrigger,
  TriggerIndicator: SubMenuTriggerIndicator,
  Content: SubMenuContent,
});

export { SubMenu, useSubMenu, useSubMenuAnimation };
export default SubMenu;
