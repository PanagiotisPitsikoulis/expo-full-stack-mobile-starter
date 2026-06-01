/**
 * Display names for the Menu components
 */

import type BottomSheet from "@gorhom/bottom-sheet";
import type { BottomSheetProps } from "@gorhom/bottom-sheet";
import {
  createContext as createReactContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  type GestureResponderEvent,
  Pressable,
  type Text as RNText,
  StyleSheet,
  type TextProps,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  FadeOut,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  type WithTimingConfig,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { cn, colorKit } from "../../helpers/external/utils";
import {
  BottomSheetContent,
  CheckIcon,
  FullWindowOverlay,
  HeroText,
} from "../../helpers/internal/components";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import {
  usePopupOverlayAnimation,
  usePopupPopoverContentAnimation,
  usePopupRootAnimation,
} from "../../helpers/internal/hooks";
import type {
  Animation,
  AnimationRootDisableAll,
  AnimationValue,
  BaseBottomSheetContentProps,
  PopupOverlayAnimation,
  PopupPopoverContentAnimation,
  PressableRef,
} from "../../helpers/internal/types";
import {
  childrenToString,
  combineStyles,
  createContext,
  getAnimationState,
  getAnimationValueMergedConfig,
  getAnimationValueProperty,
  getIsAnimationDisabledValue,
} from "../../helpers/internal/utils";
import * as MenuPrimitives from "../../primitives/menu";
import type * as MenuPrimitivesTypes from "../../primitives/menu/menu.types";
import type { ItemVariant as MenuItemVariant } from "../../primitives/menu/menu.types";
import { CloseButton, type CloseButtonProps } from "../close-button";
import { useSubMenu } from "../sub-menu";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Menu.Root",
  TRIGGER: "PitsiUINative.Menu.Trigger",
  PORTAL: "PitsiUINative.Menu.Portal",
  OVERLAY: "PitsiUINative.Menu.Overlay",
  CONTENT: "PitsiUINative.Menu.Content",
  CLOSE: "PitsiUINative.Menu.Close",
  LABEL: "PitsiUINative.Menu.Label",
  GROUP: "PitsiUINative.Menu.Group",
  ITEM: "PitsiUINative.Menu.Item",
  ITEM_TITLE: "PitsiUINative.Menu.ItemTitle",
  ITEM_DESCRIPTION: "PitsiUINative.Menu.ItemDescription",
  ITEM_INDICATOR: "PitsiUINative.Menu.ItemIndicator",
};

/**
 * Default offset from trigger element
 */
export const DEFAULT_OFFSET = 9;

/**
 * Default alignment offset
 */
export const DEFAULT_ALIGN_OFFSET = 0;

/**
 * Default screen edge insets
 */
export const DEFAULT_INSETS = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Context value for menu animation state
 */
export interface MenuAnimationContextValue {
  /** Animation progress shared value (0=idle, 1=open, 2=close) */
  progress: SharedValue<number>;
  /** Dragging state shared value */
  isDragging: SharedValue<boolean>;
}

/**
 * Ref type for the Menu Trigger component
 */
export type MenuTriggerRef = MenuPrimitivesTypes.TriggerRef;

/**
 * Presentation mode for the menu content
 */
export type MenuPresentation = "popover" | "bottom-sheet";

/**
 * Menu placement options
 */
export type MenuPlacement = "top" | "bottom" | "left" | "right";

/**
 * Menu alignment options
 */
export type MenuAlign = "start" | "center" | "end";

/**
 * Menu context value with presentation and placement
 */
export interface MenuContentContextValue {
  /**
   * Current placement of the menu
   */
  placement?: MenuPlacement;
}

/**
 * Menu Root component props
 */
export interface MenuRootProps extends MenuPrimitivesTypes.RootProps {
  /**
   * The content of the menu
   */
  children?: ReactNode;
  /**
   * Animation configuration for menu root
   * - `"disable-all"`: Disable all animations including children
   * - `true` or `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Menu Trigger component props
 */
export interface MenuTriggerProps extends MenuPrimitivesTypes.TriggerProps {
  /**
   * The trigger element content
   */
  children?: ReactNode;
  /**
   * Additional CSS class for the trigger
   */
  className?: string;
}

/**
 * Menu Portal component props
 */
export interface MenuPortalProps extends MenuPrimitivesTypes.PortalProps {
  /**
   * When true, uses a regular View instead of FullWindowOverlay on iOS.
   * Enables React Native element inspector but overlay won't appear above native modals.
   * @default false
   */
  disableFullWindowOverlay?: boolean;
  /**
   * Controls whether VoiceOver treats the overlay window as a modal container.
   * When `false`, VoiceOver can still access elements behind the overlay.
   * When `true`, VoiceOver is restricted to elements inside the overlay.
   * @default false
   * @platform ios
   * @unstable This prop maps directly to the native `accessibilityViewIsModal`
   * on the container view and may change in a future react-native-screens release.
   */
  unstable_accessibilityContainerViewIsModal?: boolean;
  /**
   * Additional CSS class for the portal container
   */
  className?: string;
  /**
   * The portal content
   */
  children: ReactNode;
}

/**
 * Menu Overlay component props
 */
export interface MenuOverlayProps extends MenuPrimitivesTypes.OverlayProps {
  /**
   * Additional CSS class for the overlay
   */
  className?: string;
  /**
   * Animation configuration for overlay
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: PopupOverlayAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Menu Content props for 'popover' presentation
 */
export interface MenuContentPopoverProps extends MenuPrimitivesTypes.ContentProps {
  /**
   * Presentation mode for the menu content
   */
  presentation: "popover";
  /**
   * Additional CSS class for the content container
   */
  className?: string;
  /**
   * The menu content
   */
  children?: ReactNode;
  /**
   * Animation configuration for content
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: PopupPopoverContentAnimation;
}

/**
 * Menu Content props for 'bottom-sheet' presentation
 */
export interface MenuContentBottomSheetProps
  extends Partial<BottomSheetProps>,
    BaseBottomSheetContentProps {
  /**
   * Presentation mode for the menu
   */
  presentation: "bottom-sheet";
}

/**
 * Menu Content component props
 */
export type MenuContentProps = MenuContentPopoverProps | MenuContentBottomSheetProps;

/**
 * Menu Close component props
 *
 * Extends CloseButtonProps, allowing full override of all close button props.
 * Automatically handles menu close functionality when pressed.
 */
export type MenuCloseProps = CloseButtonProps;

// --------------------------------------------------
// Group
// --------------------------------------------------

/**
 * Menu Group component props
 */
export interface MenuGroupProps extends Omit<MenuPrimitivesTypes.GroupProps, "asChild"> {
  /**
   * Additional CSS class for the group container
   */
  className?: string;
  /**
   * The group content (Menu.Item elements)
   */
  children?: ReactNode;
}

// --------------------------------------------------
// Label
// --------------------------------------------------

/**
 * Menu Label component props
 */
export interface MenuLabelProps extends TextProps {
  /**
   * Additional CSS class for the label
   */
  className?: string;
}

// --------------------------------------------------
// Item
// --------------------------------------------------

/**
 * Animation configuration for a Menu Item.
 * Controls scale and background-color transitions on press.
 *
 * - `true` or `undefined`: Use default animations
 * - `false` or `"disabled"`: Disable all item animations
 * - `object`: Custom animation configuration
 */
export type MenuItemAnimation = Animation<{
  /**
   * Scale animation when pressed
   */
  scale?: AnimationValue<{
    /**
     * Scale value when pressed
     * @default 0.99
     */
    value?: number;
    /**
     * Animation timing configuration
     * @default { duration: 200, easing: Easing.out(Easing.ease) }
     */
    timingConfig?: WithTimingConfig;
  }>;
  /**
   * Background-color animation when pressed
   */
  backgroundColor?: AnimationValue<{
    /**
     * Background color shown while pressed.
     * Resolved from the `default` theme token when omitted.
     * @default useThemeColor('default')
     */
    value?: string;
    /**
     * Animation timing configuration
     * @default { duration: 150 }
     */
    timingConfig?: WithTimingConfig;
  }>;
}>;

/**
 * Render function props for MenuItem children
 */
export interface MenuItemRenderProps {
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Whether the item is disabled */
  isDisabled: boolean;
  /** Whether the item is currently pressed */
  isPressed: SharedValue<boolean>;
  /** Visual variant of the item */
  variant: MenuPrimitivesTypes.ItemVariant;
}

/**
 * Menu Item component props
 */
export interface MenuItemProps extends Omit<MenuPrimitivesTypes.ItemProps, "children"> {
  /**
   * Additional CSS class for the item
   */
  className?: string;
  /**
   * Animation configuration for press feedback (scale + background color).
   * - `false` or `"disabled"`: Disable all item animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: MenuItemAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active.
   * When `false`, the animated style is removed and you can implement custom logic.
   * @default true
   */
  isAnimatedStyleActive?: boolean;
  /**
   * Child elements to render inside the item, or a render function
   */
  children?: ReactNode | ((props: MenuItemRenderProps) => ReactNode);
}

/**
 * Menu ItemTitle component props
 */
export interface MenuItemTitleProps extends TextProps {
  /**
   * Additional CSS class for the item title
   */
  className?: string;
}

/**
 * Menu ItemDescription component props
 */
export interface MenuItemDescriptionProps extends TextProps {
  /**
   * Additional CSS class for the item description
   */
  className?: string;
}

/**
 * Visual variant for the item indicator.
 * - `'checkmark'` – Renders a check icon when selected.
 * - `'dot'`       – Renders a small filled circle when selected.
 */
export type MenuItemIndicatorVariant = "checkmark" | "dot";

/**
 * Menu Item Indicator Icon props (applies to the `'checkmark'` variant)
 */
export interface MenuItemIndicatorIconProps {
  /**
   * Size of the check icon
   * @default 16
   */
  size?: number;
  /**
   * Color of the check icon
   */
  color?: string;
}

/**
 * Menu ItemIndicator component props
 */
export interface MenuItemIndicatorProps extends MenuPrimitivesTypes.ItemIndicatorProps {
  /**
   * Additional CSS class for the item indicator
   */
  className?: string;
  /**
   * Visual variant of the indicator.
   * - `'checkmark'` renders a check icon
   * - `'dot'` renders a filled circle
   * @default 'checkmark'
   */
  variant?: MenuItemIndicatorVariant;
  /**
   * Check icon props (only used when `variant` is `'checkmark'`)
   */
  iconProps?: MenuItemIndicatorIconProps;
}

// --------------------------------------------------
// Hook return types
// --------------------------------------------------

/**
 * Return type for the useMenu hook
 */
export type UseMenuReturn = MenuPrimitivesTypes.IRootContext;

/**
 * Return type for the useMenuAnimation hook
 */
export interface UseMenuAnimationReturn {
  /** Animation progress shared value (0=idle, 1=open, 2=close) */
  progress: SharedValue<number>;
  /** Dragging state shared value */
  isDragging: SharedValue<boolean>;
}

// --------------------------------------------------
// Re-export primitive types used by consumers
// --------------------------------------------------

export type {
  GroupSelectionMode as MenuGroupSelectionMode,
  ItemVariant as MenuItemVariant,
  MenuKey,
} from "../../primitives/menu/menu.types";

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const portal = tv({
  base: "absolute inset-0",
});

/**
 * Overlay style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `opacity` - Animated for overlay show/hide transitions (idle: 0, open: 1, close: 0)
 */
const overlay = tv({
  base: "absolute inset-0",
});

/**
 * Menu content style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `opacity` - Animated for content show/hide transitions
 * - `transform` (scale, translateX, translateY) - Animated for content show/hide transitions
 * - `transformOrigin` - Animated based on placement
 */
const content = tv({
  base: "absolute bg-overlay px-1.5 py-3 rounded-3xl",
  variants: {
    isSubMenuOpen: {
      true: "shadow-none",
      false: "shadow-overlay",
    },
  },
});

const contentBottomSheet = tv({
  base: "px-3",
});

/**
 * @note When Menu.Content uses `presentation="bottom-sheet"`, it uses `bottomSheetClassNames`
 * from `../bottom-sheet/bottom-sheet.styles` instead of `menuClassNames.content`.
 */

const close = tv({
  base: "",
});

const label = tv({
  base: "text-sm font-medium text-muted ml-3",
});

const group = tv({
  base: "",
});

/**
 * Menu item style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `backgroundColor` - Animated for press feedback (transparent → default on press)
 * - `transform` (scale) - Animated for press feedback (1 → 0.98 on press)
 */
const item = tv({
  base: "flex-row items-center gap-2.5 px-2.5 py-2 rounded-2xl",
  variants: {
    isDisabled: {
      true: "disabled:opacity-disabled disabled:pointer-events-none",
    },
    isOutsideSubMenuOnOpen: {
      true: "opacity-40 pointer-events-none",
    },
  },
});

const itemTitle = tv({
  base: "flex-1 text-base font-medium",
  variants: {
    variant: {
      default: "text-foreground",
      danger: "text-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const itemDescription = tv({
  base: "text-sm/snug text-muted",
});

const itemIndicator = tv({
  base: "size-5 items-center justify-center",
});

export const menuClassNames = combineStyles({
  portal,
  overlay,
  content,
  contentBottomSheet,
  close,
  label,
  group,
  item,
  itemTitle,
  itemDescription,
  itemIndicator,
});

export const menuStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/
const [MenuAnimationProvider, useMenuAnimation] = createContext<MenuAnimationContextValue>({
  name: "MenuAnimationContext",
});

// --------------------------------------------------

function useMenuItemAnimation(options: {
  animation: MenuItemAnimation | undefined;
  variant: MenuItemVariant;
  isInsideSubMenu: boolean;
}) {
  const { animation, variant, isInsideSubMenu } = options;

  const themeColorDefault = useThemeColor("default");
  const themeColorDanger = useThemeColor("danger-soft");

  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { animationConfig, isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  const isPressed = useSharedValue(false);

  const animationOnPressIn = useCallback(() => {
    isPressed.set(true);
  }, [isPressed]);

  const animationOnPressOut = useCallback(() => {
    isPressed.set(false);
  }, [isPressed]);

  // -- Scale --
  const scaleValue = getAnimationValueProperty({
    animationValue: animationConfig?.scale,
    property: "value",
    defaultValue: 0.98,
  });

  const scaleTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.scale,
    property: "timingConfig",
    defaultValue: { duration: 150 },
  });

  // -- Background color --
  const bgColorValue = getAnimationValueProperty({
    animationValue: animationConfig?.backgroundColor,
    property: "value",
    defaultValue:
      variant === "danger" ? colorKit.setAlpha(themeColorDanger, 0.1).hex() : themeColorDefault,
  });

  const bgTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.backgroundColor,
    property: "timingConfig",
    defaultValue: { duration: 150 },
  });

  const bgColorTransparent = colorKit.setAlpha(themeColorDefault, 0).hex();

  const rItemStyle = useAnimatedStyle(() => {
    const pressed = isPressed.get();

    if (isAnimationDisabledValue) {
      return {
        backgroundColor: pressed ? bgColorValue : bgColorTransparent,
        transform: [{ scale: 1 }],
      };
    }

    if (isInsideSubMenu) {
      return {
        backgroundColor: withTiming(pressed ? bgColorValue : bgColorTransparent, bgTimingConfig),
      };
    }
    return {
      backgroundColor: withTiming(pressed ? bgColorValue : bgColorTransparent, bgTimingConfig),
      transform: [
        {
          scale: withTiming(pressed ? scaleValue : 1, scaleTimingConfig),
        },
      ],
    };
  });

  return {
    rItemStyle,
    isPressed,
    animationOnPressIn,
    animationOnPressOut,
  };
}

// --------------------------------------------------

/**
 * Hook providing animated styles for the menu content popover when a sub-menu opens.
 * Delays scale animation until after mount to avoid conflicting with enter animation.
 *
 * @param options.isSubMenuOpen - Whether a sub-menu is currently open
 * @param options.animation - Animation configuration for content popover
 * @returns Animated style object for the content container (scale: 0.98 when sub-menu open, 1 otherwise)
 */
function useMenuContentPopoverAnimation(options: {
  isSubMenuOpen: boolean;
  animation?: PopupPopoverContentAnimation;
}) {
  const { isSubMenuOpen, animation } = options;

  const { isAllAnimationsDisabled } = useAnimationSettings();
  const { isAnimationDisabled } = getAnimationState(animation);
  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  const hasMounted = useSharedValue(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasMounted.value = true;
    }, 500);
    return () => clearTimeout(timer);
  }, [hasMounted]);

  const rContainerStyle = useAnimatedStyle(() => {
    if (!hasMounted.value) {
      return {};
    }
    const scale = isSubMenuOpen ? 0.98 : 1;
    if (isAnimationDisabledValue) {
      return { transform: [{ scale }] };
    }
    return {
      transform: [{ scale: withSpring(scale) }],
    };
  });

  return rContainerStyle;
}

// --------------------------------------------------

export {
  MenuAnimationProvider,
  useMenuAnimation,
  useMenuContentPopoverAnimation,
  useMenuItemAnimation,
};

/* -------------------------------------------------------------------------------------------------
 * Components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedOverlay = Animated.createAnimatedComponent(MenuPrimitives.Overlay);

const AnimatedContent = Animated.createAnimatedComponent(MenuPrimitives.Content);

const AnimatedItem = Animated.createAnimatedComponent(MenuPrimitives.Item);

const useMenu = MenuPrimitives.useRootContext;
const useMenuItem = MenuPrimitives.useItemContext;

const MenuContentContext = createReactContext<MenuContentContextValue>({
  placement: undefined,
});

// --------------------------------------------------

const MenuRoot = forwardRef<MenuPrimitivesTypes.RootRef, MenuRootProps>(
  (
    {
      children,
      isOpen: isOpenProp,
      isDefaultOpen,
      onOpenChange: onOpenChangeProp,
      presentation = "popover",
      animation,
      ...props
    },
    ref,
  ) => {
    const { isAllAnimationsDisabled, progress, isDragging } = usePopupRootAnimation({
      animation,
    });

    const animationContextValue = useMemo(
      () => ({
        progress,
        isDragging,
      }),
      [progress, isDragging],
    );

    const animationSettingsContextValue = useMemo(
      () => ({
        isAllAnimationsDisabled,
      }),
      [isAllAnimationsDisabled],
    );

    return (
      <AnimationSettingsProvider value={animationSettingsContextValue}>
        <MenuAnimationProvider value={animationContextValue}>
          <MenuPrimitives.Root
            ref={ref}
            presentation={presentation}
            isOpen={isOpenProp}
            isDefaultOpen={isDefaultOpen}
            onOpenChange={onOpenChangeProp}
            {...props}
          >
            {children}
          </MenuPrimitives.Root>
        </MenuAnimationProvider>
      </AnimationSettingsProvider>
    );
  },
);

// --------------------------------------------------

const MenuTrigger = forwardRef<MenuPrimitivesTypes.TriggerRef, MenuTriggerProps>((props, ref) => {
  return <MenuPrimitives.Trigger ref={ref} {...props} />;
});

// --------------------------------------------------

const MenuPortal = ({
  className,
  children,
  disableFullWindowOverlay = false,
  unstable_accessibilityContainerViewIsModal,
  ...props
}: MenuPortalProps) => {
  const animationSettingsContext = useAnimationSettings();
  const animationContext = useMenuAnimation();

  const portalClassName = menuClassNames.portal({ className });

  return (
    <MenuPrimitives.Portal {...props}>
      <AnimationSettingsProvider value={animationSettingsContext}>
        <MenuAnimationProvider value={animationContext}>
          <FullWindowOverlay
            disableFullWindowOverlay={disableFullWindowOverlay}
            unstable_accessibilityContainerViewIsModal={unstable_accessibilityContainerViewIsModal}
          >
            <View className={portalClassName} pointerEvents="box-none">
              {children}
            </View>
          </FullWindowOverlay>
        </MenuAnimationProvider>
      </AnimationSettingsProvider>
    </MenuPrimitives.Portal>
  );
};

// --------------------------------------------------

const MenuOverlay = forwardRef<MenuPrimitivesTypes.OverlayRef, MenuOverlayProps>(
  ({ className, style, animation, isAnimatedStyleActive = true, ...props }, ref) => {
    const { isOpen, presentation } = useMenu();
    const { progress, isDragging } = useMenuAnimation();

    const overlayClassName = menuClassNames.overlay({ className });

    const { rContainerStyle, entering, exiting } = usePopupOverlayAnimation({
      progress: presentation === "bottom-sheet" ? progress : undefined,
      isDragging: presentation === "bottom-sheet" ? isDragging : undefined,
      animation,
    });

    const overlayStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

    return (
      <Animated.View
        entering={entering}
        exiting={exiting}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        <AnimatedOverlay
          ref={ref}
          className={overlayClassName}
          style={overlayStyle}
          forceMount={presentation === "bottom-sheet" ? true : undefined}
          pointerEvents={isOpen ? "auto" : "none"}
          {...props}
        />
      </Animated.View>
    );
  },
);

// --------------------------------------------------

const MenuContentPopover = forwardRef<MenuPrimitivesTypes.ContentRef, MenuContentPopoverProps>(
  (
    {
      placement = "bottom",
      align = "center",
      avoidCollisions = true,
      offset = DEFAULT_OFFSET,
      alignOffset = DEFAULT_ALIGN_OFFSET,
      className,
      children,
      style,
      animation,
      ...props
    },
    ref,
  ) => {
    const { contentLayout, isSubMenuOpen, openSubMenuId, closeSubMenu } = useMenu();

    const safeAreaInsets = useSafeAreaInsets();
    const { height: screenHeight } = useWindowDimensions();

    const isReady = Boolean(contentLayout?.y && contentLayout.y < screenHeight);

    const insets = {
      top: DEFAULT_INSETS.top + safeAreaInsets.top,
      bottom: DEFAULT_INSETS.bottom + safeAreaInsets.bottom,
      left: DEFAULT_INSETS.left + safeAreaInsets.left,
      right: DEFAULT_INSETS.right + safeAreaInsets.right,
    };

    const contentClassName = menuClassNames.content({
      isSubMenuOpen,
      className,
    });

    const { entering, exiting } = usePopupPopoverContentAnimation({
      placement,
      offset,
      animation,
    });

    const rContainerStyle = useMenuContentPopoverAnimation({
      isSubMenuOpen,
      animation,
    });

    return (
      <MenuContentContext value={{ placement }}>
        {isReady && (
          <AnimatedContent
            ref={ref}
            entering={entering}
            exiting={isSubMenuOpen ? FadeOut.duration(150) : exiting}
            placement={placement}
            align={align}
            avoidCollisions={avoidCollisions}
            offset={offset}
            alignOffset={alignOffset}
            insets={insets}
            className={contentClassName}
            style={[menuStyleSheet.borderCurve, rContainerStyle, style]}
            {...props}
          >
            {children}
            {isSubMenuOpen && (
              <Pressable
                className="absolute inset-0 z-40"
                onPress={() => {
                  if (openSubMenuId !== null) {
                    closeSubMenu(openSubMenuId);
                  }
                }}
              />
            )}
          </AnimatedContent>
        )}
        <AnimatedContent
          placement={placement}
          accessible={false}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          pointerEvents="none"
          collapsable={false}
          align={align}
          avoidCollisions={avoidCollisions}
          offset={offset}
          alignOffset={alignOffset}
          insets={insets}
          className={cn(contentClassName, "absolute opacity-0")}
          style={[menuStyleSheet.borderCurve, style]}
          {...props}
        >
          {children}
        </AnimatedContent>
      </MenuContentContext>
    );
  },
);

// --------------------------------------------------

const MenuContentBottomSheet = forwardRef<BottomSheet, MenuContentBottomSheetProps>(
  (
    {
      children,
      index: initialIndex,
      backgroundClassName,
      handleIndicatorClassName,
      contentContainerClassName: contentContainerClassNameProp,
      contentContainerProps,
      animation,
      animationConfigs,
      ...restProps
    },
    ref,
  ) => {
    const { isOpen, onOpenChange } = useMenu();

    const { progress, isDragging } = useMenuAnimation();

    const contentContainerClassName = menuClassNames.contentBottomSheet({
      className: contentContainerClassNameProp,
    });

    return (
      <BottomSheetContent
        ref={ref}
        index={initialIndex}
        backgroundClassName={backgroundClassName}
        handleIndicatorClassName={handleIndicatorClassName}
        contentContainerClassName={contentContainerClassName}
        contentContainerProps={contentContainerProps}
        animation={animation}
        animationConfigs={animationConfigs}
        backgroundStyle={[menuStyleSheet.borderCurve, restProps.backgroundStyle]}
        isOpen={isOpen}
        progress={progress}
        isDragging={isDragging}
        onOpenChange={onOpenChange}
        {...restProps}
      >
        {children}
      </BottomSheetContent>
    );
  },
);

// --------------------------------------------------

const MenuContent = forwardRef<MenuPrimitivesTypes.ContentRef | BottomSheet, MenuContentProps>(
  (props, ref) => {
    const { presentation: contextPresentation } = useMenu();

    if (__DEV__) {
      if (props.presentation !== contextPresentation) {
        throw new Error(
          `Menu.Content presentation prop ("${props.presentation}") does not match Menu.Root presentation prop ("${contextPresentation}"). They must be the same.`,
        );
      }
    }

    if (props.presentation === "bottom-sheet") {
      return (
        <MenuContentBottomSheet
          ref={ref as React.Ref<BottomSheet>}
          {...(props as MenuContentBottomSheetProps)}
        />
      );
    }

    return (
      <MenuContentPopover
        ref={ref as React.Ref<MenuPrimitivesTypes.ContentRef>}
        {...(props as MenuContentPopoverProps)}
      />
    );
  },
);

// --------------------------------------------------

const MenuClose = forwardRef<PressableRef, MenuCloseProps>((props, ref) => {
  const { onPress: onPressProp, ...restProps } = props;
  const { onOpenChange } = useMenu();

  const onPress = (ev: GestureResponderEvent) => {
    onOpenChange(false);
    if (typeof onPressProp === "function") {
      onPressProp(ev);
    }
  };

  return <CloseButton ref={ref} onPress={onPress} {...restProps} />;
});

// --------------------------------------------------

const MenuLabel = forwardRef<RNText, MenuLabelProps>(({ className, children, ...props }, ref) => {
  const labelClassName = menuClassNames.label({ className });

  return (
    <MenuPrimitives.Label ref={ref} className={labelClassName} {...props}>
      {children}
    </MenuPrimitives.Label>
  );
});

// --------------------------------------------------

const MenuGroup = forwardRef<MenuPrimitivesTypes.GroupRef, MenuGroupProps>(
  ({ className, children, ...props }, ref) => {
    const groupClassName = menuClassNames.group({ className });

    return (
      <MenuPrimitives.Group ref={ref} className={groupClassName} {...props}>
        {children}
      </MenuPrimitives.Group>
    );
  },
);

// --------------------------------------------------

const MenuItemComponent = forwardRef<MenuPrimitivesTypes.ItemRef, MenuItemProps>(
  (
    {
      children,
      className,
      style,
      isDisabled = false,
      variant = "default",
      animation,
      isAnimatedStyleActive = true,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => {
    const { isSubMenuOpen } = useMenu();
    const subMenuContext = useSubMenu();
    const isInsideSubMenu = subMenuContext !== undefined;

    const isOutsideSubMenuOnOpen = isSubMenuOpen && !isInsideSubMenu;

    const { rItemStyle, isPressed, animationOnPressIn, animationOnPressOut } = useMenuItemAnimation(
      { animation, variant, isInsideSubMenu },
    );

    const itemClassName = menuClassNames.item({
      isDisabled,
      isOutsideSubMenuOnOpen,
      className,
    });

    const isSelected = props.isSelected ?? false;

    const handlePressIn = (event: GestureResponderEvent) => {
      animationOnPressIn();
      onPressIn?.(event);
    };

    const handlePressOut = (event: GestureResponderEvent) => {
      animationOnPressOut();
      onPressOut?.(event);
    };

    const resolvedChildren =
      typeof children === "function"
        ? children({
            isSelected,
            isDisabled,
            isPressed,
            variant,
          })
        : children;

    const stringifiedChildren = typeof children !== "function" ? childrenToString(children) : null;

    const content = stringifiedChildren ? (
      <MenuItemTitle>{stringifiedChildren}</MenuItemTitle>
    ) : (
      resolvedChildren
    );

    const itemStyle = isAnimatedStyleActive
      ? [menuStyleSheet.borderCurve, rItemStyle, style]
      : [menuStyleSheet.borderCurve, style];

    return (
      <AnimatedItem
        ref={ref}
        className={itemClassName}
        style={itemStyle}
        isDisabled={isDisabled}
        variant={variant}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {content}
      </AnimatedItem>
    );
  },
);

// --------------------------------------------------

const MenuItemTitle = forwardRef<RNText, MenuItemTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useMenuItem();
    const itemTitleClassName = menuClassNames.itemTitle({ className, variant });

    return (
      <HeroText ref={ref} accessibilityRole="text" className={itemTitleClassName} {...props}>
        {children}
      </HeroText>
    );
  },
);

// --------------------------------------------------

const MenuItemDescription = forwardRef<RNText, MenuItemDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const itemDescriptionClassName = menuClassNames.itemDescription({
      className,
    });

    return (
      <HeroText
        ref={ref}
        accessibilityRole="summary"
        className={itemDescriptionClassName}
        {...props}
      >
        {children}
      </HeroText>
    );
  },
);

// --------------------------------------------------

const MenuItemIndicator = forwardRef<MenuPrimitivesTypes.ItemIndicatorRef, MenuItemIndicatorProps>(
  ({ className, children, variant = "checkmark", iconProps, forceMount = true, ...props }, ref) => {
    const { isSelected } = useMenuItem();

    const themeColorMuted = useThemeColor("muted");

    const iconSize = iconProps?.size ?? (variant === "dot" ? 8 : 16);
    const iconColor = iconProps?.color ?? themeColorMuted;

    const itemIndicatorClassName = menuClassNames.itemIndicator({ className });

    const defaultContent =
      variant === "dot" ? (
        <View
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
            backgroundColor: iconColor,
          }}
        />
      ) : (
        <CheckIcon size={iconSize} color={iconColor} />
      );

    return (
      <MenuPrimitives.ItemIndicator
        ref={ref}
        className={itemIndicatorClassName}
        forceMount={forceMount}
        {...props}
      >
        {isSelected && (children ?? defaultContent)}
      </MenuPrimitives.ItemIndicator>
    );
  },
);

// --------------------------------------------------

MenuRoot.displayName = DISPLAY_NAME.ROOT;
MenuTrigger.displayName = DISPLAY_NAME.TRIGGER;
MenuPortal.displayName = DISPLAY_NAME.PORTAL;
MenuOverlay.displayName = DISPLAY_NAME.OVERLAY;
MenuContent.displayName = DISPLAY_NAME.CONTENT;
MenuClose.displayName = DISPLAY_NAME.CLOSE;
MenuGroup.displayName = DISPLAY_NAME.GROUP;
MenuLabel.displayName = DISPLAY_NAME.LABEL;
MenuItemComponent.displayName = DISPLAY_NAME.ITEM;
MenuItemTitle.displayName = DISPLAY_NAME.ITEM_TITLE;
MenuItemDescription.displayName = DISPLAY_NAME.ITEM_DESCRIPTION;
MenuItemIndicator.displayName = DISPLAY_NAME.ITEM_INDICATOR;

/**
 * Compound Menu component with sub-components
 *
 * @component Menu - Main container that manages open/close state, positioning,
 * and provides context to child components.
 *
 * @component Menu.Trigger - Clickable element that toggles the menu visibility.
 *
 * @component Menu.Portal - Renders menu content in a portal layer above other content.
 *
 * @component Menu.Overlay - Optional background overlay to capture outside clicks.
 *
 * @component Menu.Content - Container for menu content with two presentation modes:
 * default floating popover with positioning and collision detection, or bottom sheet modal.
 *
 * @component Menu.Close - Close button for the menu.
 *
 * @component Menu.Group - Groups menu items with optional selection state (none, single, multiple).
 *
 * @component Menu.Label - Non-interactive section heading text within the menu.
 *
 * @component Menu.Item - Pressable menu item. Standalone or within a Group for selection.
 *
 * @component Menu.ItemTitle - Primary label text for a menu item.
 *
 * @component Menu.ItemDescription - Secondary description text for a menu item.
 *
 * @component Menu.ItemIndicator - Visual selection indicator (e.g. checkmark) for a menu item.
 */
const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Overlay: MenuOverlay,
  Content: MenuContent,
  Close: MenuClose,
  Group: MenuGroup,
  Label: MenuLabel,
  Item: MenuItemComponent,
  ItemTitle: MenuItemTitle,
  ItemDescription: MenuItemDescription,
  ItemIndicator: MenuItemIndicator,
});

export { useMenu, useMenuItem };
export default Menu;
