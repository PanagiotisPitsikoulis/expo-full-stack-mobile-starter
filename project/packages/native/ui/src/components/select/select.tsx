/**
 * Display names for the Select components
 */

import type BottomSheet from "@gorhom/bottom-sheet";
import type { BottomSheetProps } from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { GestureResponderEvent, Text as RNText, TextProps, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import type { AnimatedProps, SharedValue, WithSpringConfig } from "react-native-reanimated";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { cn } from "../../helpers/external/utils";
import {
  BottomSheetContent,
  CheckIcon,
  ChevronDownIcon,
  FullWindowOverlay,
  HeroText,
} from "../../helpers/internal/components";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import {
  usePopupDialogContentAnimation,
  usePopupOverlayAnimation,
  usePopupPopoverContentAnimation,
  usePopupRootAnimation,
} from "../../helpers/internal/hooks";
import type {
  Animation,
  AnimationRootDisableAll,
  AnimationValue,
  BaseBottomSheetContentProps,
  ElementSlots,
  PopupDialogContentAnimation,
  PopupOverlayAnimation,
  PopupPopoverContentAnimation,
  PressableRef,
  ViewRef,
} from "../../helpers/internal/types";
import {
  combineStyles,
  createContext,
  getAnimationState,
  getAnimationValueMergedConfig,
  getAnimationValueProperty,
  getIsAnimationDisabledValue,
} from "../../helpers/internal/utils";
import * as SelectPrimitives from "../../primitives/select";
import type * as SelectPrimitivesTypes from "../../primitives/select/select.types";
import { CloseButton, type CloseButtonProps } from "../close-button";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Select.Root",
  TRIGGER: "PitsiUINative.Select.Trigger",
  VALUE: "PitsiUINative.Select.Value",
  PORTAL: "PitsiUINative.Select.Portal",
  OVERLAY: "PitsiUINative.Select.Overlay",
  CONTENT: "PitsiUINative.Select.Content",
  ITEM: "PitsiUINative.Select.Item",
  ITEM_LABEL: "PitsiUINative.Select.ItemLabel",
  ITEM_DESCRIPTION: "PitsiUINative.Select.ItemDescription",
  ITEM_INDICATOR: "PitsiUINative.Select.ItemIndicator",
  LIST_LABEL: "PitsiUINative.Select.ListLabel",
  CLOSE: "PitsiUINative.Select.Close",
  TRIGGER_INDICATOR: "PitsiUINative.Select.TriggerIndicator",
  CHEVRON_DOWN_ICON: "PitsiUINative.Select.ChevronDownIcon",
} as const;

/**
 * Default icon size for the indicator
 */
export const DEFAULT_ICON_SIZE = 16;

/**
 * Spring configuration for indicator animation
 */
export const INDICATOR_SPRING_CONFIG = {
  damping: 140,
  stiffness: 1000,
  mass: 4,
};

/**
 * Default offset from trigger element
 */
export const DEFAULT_OFFSET = 8;

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
 * Select internal state for animation coordination
 */
export type SelectState = "idle" | "open" | "close";

/**
 * Context value for select animation state
 */
export interface SelectAnimationContextValue {
  /** Animation progress shared value (0=idle, 1=open, 2=close) */
  progress: SharedValue<number>;
  /** Dragging state shared value */
  isDragging: SharedValue<boolean>;
  /** Gesture release animation running state shared value */
  isGestureReleaseAnimationRunning: SharedValue<boolean>;
}

/**
 * Ref type for the Select Trigger component
 */
export type SelectTriggerRef = SelectPrimitivesTypes.TriggerRef;

/**
 * Select placement options
 */
export type SelectPlacement = "top" | "bottom" | "left" | "right";

/**
 * Select alignment options
 */
export type SelectAlign = "start" | "center" | "end";

/**
 * Select Root component props.
 * Generic on `M extends SelectionMode` — inherits value/onChange typing from the primitive.
 */
export type SelectRootProps<M extends SelectPrimitivesTypes.SelectionMode = "single"> =
  SelectPrimitivesTypes.RootProps<M> & {
    /**
     * The content of the select
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the select root
     */
    className?: string;
    /**
     * The controlled open state of the select
     */
    isOpen?: boolean;
    /**
     * The open state of the select when initially rendered (uncontrolled)
     */
    isDefaultOpen?: boolean;
    /**
     * Animation configuration for select root
     * - `"disable-all"`: Disable all animations including children
     * - `false` or `"disabled"`: Disable only root animations
     * - `true` or `undefined`: Use default animations
     */
    animation?: AnimationRootDisableAll;
  };

/**
 * Select Trigger component props
 */
export interface SelectTriggerProps extends SelectPrimitivesTypes.TriggerProps {
  /**
   * The variant of the trigger
   * @default 'default'
   */
  variant?: "default" | "unstyled";
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
 * Icon props for the Select.TriggerIndicator component
 */
export interface SelectTriggerIndicatorIconProps {
  /**
   * Size of the icon
   * @default 16
   */
  size?: number;
  /**
   * Color of the icon
   * @default foreground
   */
  color?: string;
}

/**
 * Animation configuration for select trigger indicator component
 */
export type SelectTriggerIndicatorAnimation = Animation<{
  rotation?: AnimationValue<{
    /**
     * Rotation values [closed, open] in degrees
     * @default [0, -180]
     */
    value?: [number, number];
    /**
     * Spring animation configuration for rotation
     * @default { damping: 140, stiffness: 1000, mass: 4 }
     */
    springConfig?: WithSpringConfig;
  }>;
}>;

/**
 * Props for the Select.TriggerIndicator component
 */
export interface SelectTriggerIndicatorProps
  extends AnimatedProps<SelectPrimitivesTypes.TriggerIndicatorProps> {
  /**
   * Custom trigger indicator content, if not provided defaults to animated chevron
   */
  children?: ReactNode;
  /**
   * Additional CSS classes
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `transform` (specifically `rotate`) - Animated for open/close rotation transitions
   *
   * To customize this property, use the `animation` prop:
   * ```tsx
   * <Select.TriggerIndicator
   *   animation={{
   *     rotation: { value: [0, -180], springConfig: { damping: 140, stiffness: 1000, mass: 4 } }
   *   }}
   * />
   * ```
   *
   * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
   */
  className?: string;
  /**
   * Custom styles for the trigger indicator
   */
  style?: ViewStyle;
  /**
   * Icon configuration
   */
  iconProps?: SelectTriggerIndicatorIconProps;
  /**
   * Animation configuration for trigger indicator
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: SelectTriggerIndicatorAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Select Portal component props
 */
export interface SelectPortalProps extends SelectPrimitivesTypes.PortalProps {
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
 * Animation configuration for Select Overlay component
 */
export type SelectOverlayAnimation = PopupOverlayAnimation;

/**
 * Select Overlay component props
 */
export interface SelectOverlayProps extends SelectPrimitivesTypes.OverlayProps {
  /**
   * Additional CSS class for the overlay
   */
  className?: string;
  /**
   * Animation configuration for overlay
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations (progress-based opacity for bottom-sheet/dialog, Keyframe animations for popover)
   * - `object`: Custom animation configuration
   *   - For bottom-sheet/dialog: `opacity` with progress-based values
   *   - For popover: `entering` and/or `exiting` Keyframe animations
   */
  animation?: SelectOverlayAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Animation configuration for Select Content Popover component
 * Reuses PopupPopoverContentAnimation since they share the same animation behavior
 */
export type SelectContentPopoverAnimation = PopupPopoverContentAnimation;

/**
 * Select Content props for 'popover' presentation
 */
export interface SelectContentPopoverProps extends SelectPrimitivesTypes.PopoverContentProps {
  /**
   * Additional CSS class for the content container
   */
  className?: string;
  /**
   * The select content
   */
  children?: ReactNode;
  /**
   * Presentation mode for the select
   */
  presentation: "popover";
  /**
   * Animation configuration for content
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default Keyframe animations (translateY/translateX, scale, opacity based on placement)
   * - `object`: Custom animation configuration with `entering` and/or `exiting` Keyframe animations
   */
  animation?: SelectContentPopoverAnimation;
}

/**
 * Select Content props for 'bottom-sheet' presentation
 */
export interface SelectContentBottomSheetProps
  extends Partial<BottomSheetProps>,
    BaseBottomSheetContentProps {
  /**
   * Presentation mode for the select
   */
  presentation: "bottom-sheet";
}

/**
 * Animation configuration for Select Content component (dialog presentation)
 * Reuses PopupDialogContentAnimation since they share the same animation behavior
 */
export type SelectContentAnimation = PopupDialogContentAnimation;

/**
 * Select Content props for 'dialog' presentation
 */
export interface SelectContentDialogProps extends SelectPrimitivesTypes.DialogContentProps {
  /**
   * Additional CSS classes for the content container
   */
  classNames?: ElementSlots<DialogContentFallbackSlots>;
  /**
   * Styles for different parts of the dialog content
   */
  styles?: Partial<Record<DialogContentFallbackSlots, ViewStyle>>;
  /**
   * The select content
   */
  children?: ReactNode;
  /**
   * Presentation mode for the select
   */
  presentation: "dialog";
  /**
   * Animation configuration for content
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default Keyframe animations (scale and opacity transitions)
   * - `object`: Custom animation configuration with `entering` and/or `exiting` Keyframe animations
   */
  animation?: SelectContentAnimation;
  /**
   * Whether the dialog content can be swiped to dismiss
   * @default true
   */
  isSwipeable?: boolean;
}

/**
 * Select Content component props
 */
export type SelectContentProps =
  | SelectContentPopoverProps
  | SelectContentBottomSheetProps
  | SelectContentDialogProps;

/**
 * Select Close component props
 *
 * Extends CloseButtonProps, allowing full override of all close button props.
 * Automatically handles select close functionality when pressed.
 */
export type SelectCloseProps = CloseButtonProps;

/**
 * Select Value component props
 */
export interface SelectValueProps extends SelectPrimitivesTypes.ValueProps {
  /**
   * Additional CSS class for the value
   */
  className?: string;
}

/**
 * Select List Label component props
 */
export interface SelectListLabelProps extends TextProps {
  /**
   * Additional CSS class for the list label
   */
  className?: string;
}

/**
 * Render function props for SelectItem children
 */
export interface SelectItemRenderProps {
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** The value of the item */
  value: string;
  /** Whether the item is disabled */
  isDisabled: boolean;
}

/**
 * Select Item component props
 */
export interface SelectItemProps extends Omit<SelectPrimitivesTypes.ItemProps, "children"> {
  /**
   * Additional CSS class for the item
   */
  className?: string;
  /**
   * Child elements to render inside the item, or a render function
   */
  children?: ReactNode | ((props: SelectItemRenderProps) => ReactNode);
}

/**
 * Select Item Label component props
 */
export interface SelectItemLabelProps extends Omit<TextProps, "children"> {
  /**
   * Additional CSS class for the item label
   */
  className?: string;
}

/**
 * Select Item Description component props
 */
export interface SelectItemDescriptionProps extends TextProps {
  /**
   * Additional CSS class for the item description
   */
  className?: string;
}

/**
 * Select Item Indicator Icon props
 */
export interface SelectItemIndicatorIconProps {
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
 * Select Item Indicator component props
 */
export interface SelectItemIndicatorProps extends SelectPrimitivesTypes.ItemIndicatorProps {
  /**
   * Additional CSS class for the item indicator
   */
  className?: string;
  /**
   * Check icon props
   */
  iconProps?: SelectItemIndicatorIconProps;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const trigger = tv({
  base: "",
  variants: {
    variant: {
      default:
        "flex-row items-center justify-between gap-3 py-3 px-4 rounded-2xl bg-surface shadow-surface",
      unstyled: "",
    },
    isDisabled: {
      true: "opacity-disabled pointer-events-none",
      false: "",
    },
  },
});

const value = tv({
  base: "flex-1 text-base",
  variants: {
    isSelected: {
      true: "text-foreground",
      false: "text-field-placeholder",
    },
  },
});

/**
 * Trigger Indicator style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property is animated and cannot be overridden using Tailwind classes:
 * - `transform` (specifically `rotate`) - Animated for open/close rotation transitions
 *
 * To customize this property, use the `animation` prop on `Select.TriggerIndicator`:
 * ```tsx
 * <Select.TriggerIndicator
 *   animation={{
 *     rotation: { value: [0, -180], springConfig: { damping: 140, stiffness: 1000, mass: 4 } }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Select.TriggerIndicator`.
 */
const triggerIndicator = tv({
  base: "items-center justify-center",
});

const portal = tv({
  base: "absolute inset-0",
});

/**
 * Overlay style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property is animated and cannot be overridden using Tailwind classes:
 * - `opacity` - Animated for overlay show/hide transitions (idle: 0, open: 1, close: 0)
 *
 * To customize this property, use the `animation` prop on `Select.Overlay`:
 * ```tsx
 * <Select.Overlay
 *   animation={{
 *     opacity: { value: [0, 1, 0] }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Select.Overlay`.
 */
const overlay = tv({
  base: "absolute inset-0",
});

/**
 * Popover content style definition
 */
const content = tv({
  base: "bg-overlay p-3 rounded-3xl shadow-overlay",
});

/**
 * Dialog content style definition
 */
const dialogContent = tv({
  slots: {
    wrapper: "absolute inset-0 justify-center p-5",
    content: "bg-overlay p-5 rounded-3xl shadow-overlay",
  },
});

/**
 * @note When Select.Content uses `presentation="bottom-sheet"`, it uses `bottomSheetClassNames`
 * from `../bottom-sheet/bottom-sheet.styles` instead of `selectClassNames.content`.
 * See `select.tsx` SelectContentBottomSheet component for usage.
 */

const close = tv({
  base: "",
});

const listLabel = tv({
  base: "text-sm text-muted font-medium px-2 py-1.5",
});

const item = tv({
  base: "flex-row items-center gap-2 px-2 py-3",
});

const itemLabel = tv({
  base: "flex-1 text-base text-foreground font-medium",
});

const itemDescription = tv({
  base: "text-sm/snug text-muted",
});

const itemIndicator = tv({
  base: "size-5 items-center justify-center",
});

export const selectClassNames = combineStyles({
  trigger,
  portal,
  overlay,
  content,
  dialogContent,
  close,
  value,
  item,
  itemLabel,
  itemDescription,
  itemIndicator,
  listLabel,
  triggerIndicator,
});

export const selectStyleSheet = StyleSheet.create({
  contentContainer: {
    borderCurve: "continuous",
  },
});

export type DialogContentFallbackSlots = keyof ReturnType<typeof dialogContent>;

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/
const [SelectAnimationProvider, useSelectAnimation] = createContext<SelectAnimationContextValue>({
  name: "SelectAnimationContext",
});

export { SelectAnimationProvider, useSelectAnimation };

// --------------------------------------------------

/**
 * Animation hook for Select Trigger Indicator component
 * Handles rotation animation for the chevron icon
 */
export function useSelectTriggerIndicatorAnimation(options: {
  animation: SelectTriggerIndicatorAnimation | undefined;
  isOpen: boolean;
}) {
  const { animation, isOpen } = options;

  // Read from global animation context (always available in compound parts)
  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { animationConfig, isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  // Rotation animation values
  const rotationValue = getAnimationValueProperty({
    animationValue: animationConfig?.rotation,
    property: "value",
    defaultValue: [0, -180] as [number, number],
  });

  const rotationSpringConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.rotation,
    property: "springConfig",
    defaultValue: INDICATOR_SPRING_CONFIG,
  });

  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isAnimationDisabledValue) {
      rotation.set(isOpen ? 1 : 0);
    } else {
      rotation.set(withSpring(isOpen ? 1 : 0, rotationSpringConfig));
    }
  }, [isOpen, isAnimationDisabledValue, rotation, rotationSpringConfig]);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(rotation.get(), [0, 1], [rotationValue[0], rotationValue[1]])}deg`,
        },
      ],
    };
  });

  return {
    rContainerStyle,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedOverlay = Animated.createAnimatedComponent(SelectPrimitives.Overlay);

const AnimatedPopoverContent = Animated.createAnimatedComponent(SelectPrimitives.PopoverContent);

const AnimatedTriggerIndicator = Animated.createAnimatedComponent(
  SelectPrimitives.TriggerIndicator,
);

const useSelect = SelectPrimitives.useRootContext;

const useSelectItem = SelectPrimitives.useItemContext;

// --------------------------------------------------

function SelectRoot<M extends SelectPrimitivesTypes.SelectionMode = "single">({
  children,
  ref,
  isOpen,
  isDefaultOpen,
  onOpenChange,
  animation,
  ...props
}: SelectRootProps<M> & {
  ref?: React.Ref<SelectPrimitivesTypes.RootRef>;
}) {
  const { progress, isDragging, isGestureReleaseAnimationRunning, isAllAnimationsDisabled } =
    usePopupRootAnimation({
      animation,
    });

  const animationContextValue = useMemo(
    () => ({
      progress,
      isDragging,
      isGestureReleaseAnimationRunning,
    }),
    [progress, isDragging, isGestureReleaseAnimationRunning],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <SelectAnimationProvider value={animationContextValue}>
        <SelectPrimitives.Root
          ref={ref}
          isOpen={isOpen}
          isDefaultOpen={isDefaultOpen}
          onOpenChange={onOpenChange}
          {...props}
        >
          {children}
        </SelectPrimitives.Root>
      </SelectAnimationProvider>
    </AnimationSettingsProvider>
  );
}

// --------------------------------------------------

const SelectTrigger = forwardRef<SelectPrimitivesTypes.TriggerRef, SelectTriggerProps>(
  ({ variant = "default", isDisabled: isDisabledProp, className, ...props }, ref) => {
    const { isDisabled } = useSelect();

    const triggerClassName = selectClassNames.trigger({
      variant,
      isDisabled: isDisabledProp || isDisabled,
      className,
    });

    return <SelectPrimitives.Trigger ref={ref} className={triggerClassName} {...props} />;
  },
);

// --------------------------------------------------

const SelectValue = forwardRef<SelectPrimitivesTypes.ValueRef, SelectValueProps>(
  ({ className, ...props }, ref) => {
    const { value } = useSelect();

    const isSelected = Array.isArray(value) ? value.length > 0 : Boolean(value?.value);

    const valueClassName = selectClassNames.value({
      isSelected,
      className,
    });

    return <SelectPrimitives.Value ref={ref} className={valueClassName} {...props} />;
  },
);

// --------------------------------------------------

const SelectTriggerIndicator = forwardRef<ViewRef, SelectTriggerIndicatorProps>((props, ref) => {
  const {
    children,
    className,
    iconProps,
    animation,
    isAnimatedStyleActive = true,
    style,
    ...restProps
  } = props;

  const { isOpen } = useSelect();

  const themeColorForeground = useThemeColor("foreground");

  const triggerIndicatorClassName = selectClassNames.triggerIndicator({
    className,
  });

  const { rContainerStyle } = useSelectTriggerIndicatorAnimation({
    animation,
    isOpen,
  });

  const triggerIndicatorStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

  if (children) {
    return (
      <AnimatedTriggerIndicator
        ref={ref}
        className={triggerIndicatorClassName}
        style={style}
        {...restProps}
      >
        {children}
      </AnimatedTriggerIndicator>
    );
  }

  return (
    <AnimatedTriggerIndicator
      ref={ref}
      className={triggerIndicatorClassName}
      style={triggerIndicatorStyle}
      {...restProps}
    >
      <ChevronDownIcon
        size={iconProps?.size ?? DEFAULT_ICON_SIZE}
        color={iconProps?.color ?? themeColorForeground}
      />
    </AnimatedTriggerIndicator>
  );
});

// --------------------------------------------------

const SelectPortal = ({
  className,
  children,
  disableFullWindowOverlay = false,
  unstable_accessibilityContainerViewIsModal,
  ...props
}: SelectPortalProps) => {
  const animationSettingsContext = useAnimationSettings();
  const animationContext = useSelectAnimation();

  const portalClassName = selectClassNames.portal({ className });

  return (
    <SelectPrimitives.Portal {...props}>
      <AnimationSettingsProvider value={animationSettingsContext}>
        <SelectAnimationProvider value={animationContext}>
          <FullWindowOverlay
            disableFullWindowOverlay={disableFullWindowOverlay}
            unstable_accessibilityContainerViewIsModal={unstable_accessibilityContainerViewIsModal}
          >
            <View className={portalClassName} pointerEvents="box-none">
              {children}
            </View>
          </FullWindowOverlay>
        </SelectAnimationProvider>
      </AnimationSettingsProvider>
    </SelectPrimitives.Portal>
  );
};

// --------------------------------------------------

const SelectOverlay = forwardRef<SelectPrimitivesTypes.OverlayRef, SelectOverlayProps>(
  ({ className, style, animation, isAnimatedStyleActive = true, ...props }, ref) => {
    const { isOpen, presentation } = useSelect();
    const { progress, isDragging, isGestureReleaseAnimationRunning } = useSelectAnimation();

    const overlayClassName = selectClassNames.overlay({
      className,
    });

    const { rContainerStyle, entering, exiting } = usePopupOverlayAnimation({
      progress: presentation !== "popover" ? progress : undefined,
      isDragging: presentation === "popover" ? isDragging : undefined,
      isGestureReleaseAnimationRunning:
        presentation === "dialog" ? isGestureReleaseAnimationRunning : undefined,
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

const SelectContentPopover = forwardRef<
  SelectPrimitivesTypes.ContentRef,
  SelectContentProps & { presentation?: "popover" }
>(
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
    const { contentLayout } = useSelect();

    const safeAreaInsets = useSafeAreaInsets();
    const { height: screenHeight } = useWindowDimensions();

    // Initially useRelativePosition returns { position: 'absolute', opacity: 0, top: dimensions.height }
    // So we need to wait for the content to be ready before showing it
    const isReady = Boolean(contentLayout?.y && contentLayout.y < screenHeight);

    const insets = {
      top: DEFAULT_INSETS.top + safeAreaInsets.top,
      bottom: DEFAULT_INSETS.bottom + safeAreaInsets.bottom,
      left: DEFAULT_INSETS.left + safeAreaInsets.left,
      right: DEFAULT_INSETS.right + safeAreaInsets.right,
    };

    const contentClassName = selectClassNames.content({
      className,
    });

    const { entering, exiting } = usePopupPopoverContentAnimation({
      placement,
      offset,
      animation,
    });

    return (
      <>
        {isReady && (
          <AnimatedPopoverContent
            ref={ref}
            entering={entering}
            exiting={exiting}
            placement={placement}
            align={align}
            avoidCollisions={avoidCollisions}
            offset={offset}
            alignOffset={alignOffset}
            insets={insets}
            className={contentClassName}
            style={[selectStyleSheet.contentContainer, style]}
            {...props}
          >
            {children}
          </AnimatedPopoverContent>
        )}
        <AnimatedPopoverContent
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
          style={[selectStyleSheet.contentContainer, style]}
          {...props}
        >
          {children}
        </AnimatedPopoverContent>
      </>
    );
  },
);

// --------------------------------------------------

const SelectContentBottomSheet = forwardRef<
  BottomSheet,
  SelectContentProps & { presentation: "bottom-sheet" }
>(
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
    const { isOpen, onOpenChange } = useSelect();

    const { progress, isDragging } = useSelectAnimation();

    return (
      <BottomSheetContent
        ref={ref}
        index={initialIndex}
        backgroundClassName={backgroundClassName}
        handleIndicatorClassName={handleIndicatorClassName}
        contentContainerClassName={contentContainerClassNameProp}
        contentContainerProps={contentContainerProps}
        animation={animation}
        animationConfigs={animationConfigs}
        backgroundStyle={[selectStyleSheet.contentContainer, restProps.backgroundStyle]}
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

const SelectContentDialog = forwardRef<
  SelectPrimitivesTypes.ContentRef,
  SelectContentProps & { presentation: "dialog" }
>(({ classNames, styles, style, children, animation, isSwipeable = true, ...props }, ref) => {
  const { isOpen, onOpenChange } = useSelect();

  const { progress, isDragging, isGestureReleaseAnimationRunning } = useSelectAnimation();

  const { wrapper, content } = selectClassNames.dialogContent();

  const wrapperClassName = wrapper({ className: classNames?.wrapper });
  const contentClassName = content({ className: classNames?.content });

  const dragContainerRef = useRef<View>(null);

  const { contentY, contentHeight, panGesture, rDragContainerStyle, entering, exiting } =
    usePopupDialogContentAnimation({
      progress,
      isDragging,
      isGestureReleaseAnimationRunning,
      isOpen,
      onOpenChange,
      animation,
      isSwipeable,
    });

  useLayoutEffect(() => {
    dragContainerRef.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
      contentY.set(pageY);
      contentHeight.set(height);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentY.set, contentHeight.set]);

  return (
    <View className={wrapperClassName} style={styles?.wrapper}>
      <GestureDetector gesture={panGesture}>
        <Animated.View ref={dragContainerRef} entering={entering} exiting={exiting}>
          <Animated.View style={rDragContainerStyle} pointerEvents="box-none">
            <SelectPrimitives.DialogContent
              ref={ref}
              className={contentClassName}
              style={[selectStyleSheet.contentContainer, styles?.content, style]}
              {...props}
            >
              {children}
            </SelectPrimitives.DialogContent>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

// --------------------------------------------------

const SelectContent = forwardRef<
  SelectPrimitivesTypes.ContentRef | BottomSheet,
  SelectContentProps
>((props, ref) => {
  const presentation = props.presentation || "popover";
  const { presentation: contextPresentation } = useSelect();

  if (__DEV__) {
    if (presentation !== contextPresentation) {
      throw new Error(
        `Select.Content presentation prop ("${props.presentation}") does not match Select.Root presentation prop ("${contextPresentation}"). They must be the same.`,
      );
    }
  }

  if (presentation === "bottom-sheet") {
    return (
      <SelectContentBottomSheet
        ref={ref as React.Ref<BottomSheet>}
        {...(props as SelectContentBottomSheetProps)}
      />
    );
  }

  if (presentation === "dialog") {
    return (
      <SelectContentDialog
        ref={ref as React.Ref<SelectPrimitivesTypes.ContentRef>}
        {...(props as SelectContentDialogProps)}
      />
    );
  }

  return (
    <SelectContentPopover
      ref={ref as React.Ref<SelectPrimitivesTypes.ContentRef>}
      {...(props as SelectContentPopoverProps)}
    />
  );
});

// --------------------------------------------------

const SelectClose = forwardRef<PressableRef, SelectCloseProps>((props, ref) => {
  const { onPress: onPressProp, ...restProps } = props;
  const { onOpenChange } = useSelect();

  const onPress = (ev: GestureResponderEvent) => {
    onOpenChange(false);
    if (typeof onPressProp === "function") {
      onPressProp(ev);
    }
  };

  return <CloseButton ref={ref} onPress={onPress} {...restProps} />;
});

// --------------------------------------------------

const SelectItem = forwardRef<SelectPrimitivesTypes.ItemRef, SelectItemProps>(
  ({ children, className, disabled = false, value: itemValue, label, ...props }, ref) => {
    const { value } = useSelect();

    const isSelected = Array.isArray(value)
      ? value.some((v) => v?.value === itemValue)
      : value?.value === itemValue;
    const isDisabled = disabled ?? false;

    const itemClassName = selectClassNames.item({ className });

    const renderProps: SelectItemRenderProps = {
      isSelected,
      value: itemValue,
      isDisabled,
    };

    const content =
      typeof children === "function"
        ? children(renderProps)
        : (children ?? (
            <>
              <SelectItemLabel />
              <SelectItemIndicator />
            </>
          ));

    return (
      <SelectPrimitives.Item
        ref={ref}
        className={itemClassName}
        disabled={disabled}
        value={itemValue}
        label={label}
        {...props}
      >
        {content}
      </SelectPrimitives.Item>
    );
  },
);

// --------------------------------------------------

const SelectItemLabel = forwardRef<SelectPrimitivesTypes.ItemLabelRef, SelectItemLabelProps>(
  ({ className, ...props }, ref) => {
    const { label } = useSelectItem();

    const itemLabelClassName = selectClassNames.itemLabel({ className });

    return (
      <HeroText ref={ref} accessibilityRole="text" className={itemLabelClassName} {...props}>
        {label}
      </HeroText>
    );
  },
);

// --------------------------------------------------

const SelectItemDescription = forwardRef<RNText, SelectItemDescriptionProps>(
  ({ className, ...props }, ref) => {
    const itemDescriptionClassName = selectClassNames.itemDescription({
      className,
    });

    return (
      <HeroText
        ref={ref}
        accessibilityRole="summary"
        className={itemDescriptionClassName}
        {...props}
      />
    );
  },
);

// --------------------------------------------------

const SelectItemIndicator = forwardRef<
  SelectPrimitivesTypes.ItemIndicatorRef,
  SelectItemIndicatorProps
>(({ className, children, iconProps, ...props }, ref) => {
  const themeColorAccent = useThemeColor("accent");

  const iconSize = iconProps?.size ?? 16;
  const iconColor = iconProps?.color ?? themeColorAccent;

  const itemIndicatorClassName = selectClassNames.itemIndicator({ className });

  return (
    <SelectPrimitives.ItemIndicator ref={ref} className={itemIndicatorClassName} {...props}>
      {children || <CheckIcon size={iconSize} color={iconColor} />}
    </SelectPrimitives.ItemIndicator>
  );
});

// --------------------------------------------------

const SelectListLabel = forwardRef<SelectPrimitivesTypes.GroupLabelRef, SelectListLabelProps>(
  ({ className, ...props }, ref) => {
    const listLabelClassName = selectClassNames.listLabel({
      className,
    });

    return (
      <HeroText ref={ref} className={listLabelClassName} accessibilityRole="header" {...props} />
    );
  },
);

// --------------------------------------------------

SelectRoot.displayName = DISPLAY_NAME.ROOT;
SelectTrigger.displayName = DISPLAY_NAME.TRIGGER;
SelectTriggerIndicator.displayName = DISPLAY_NAME.TRIGGER_INDICATOR;
SelectValue.displayName = DISPLAY_NAME.VALUE;
SelectPortal.displayName = DISPLAY_NAME.PORTAL;
SelectOverlay.displayName = DISPLAY_NAME.OVERLAY;
SelectContent.displayName = DISPLAY_NAME.CONTENT;
SelectClose.displayName = DISPLAY_NAME.CLOSE;
SelectItemDescription.displayName = DISPLAY_NAME.ITEM_DESCRIPTION;
SelectItem.displayName = DISPLAY_NAME.ITEM;
SelectItemLabel.displayName = DISPLAY_NAME.ITEM_LABEL;
SelectItemIndicator.displayName = DISPLAY_NAME.ITEM_INDICATOR;
SelectListLabel.displayName = DISPLAY_NAME.LIST_LABEL;

/**
 * Compound Select component with sub-components
 *
 * @component Select - Main container that manages open/close state, positioning,
 * value selection and provides context to child components. Handles placement, alignment, and collision detection.
 *
 * @component Select.Trigger - Clickable element that toggles the select visibility.
 * Wraps any child element with press handlers.
 *
 * @component Select.TriggerIndicator - Optional visual indicator showing open/close state.
 * Defaults to an animated chevron icon that rotates based on select state.
 * Supports custom animation configuration.
 *
 * @component Select.Value - Displays the selected value or placeholder text.
 * Automatically updates when selection changes.
 *
 * @component Select.Portal - Renders select content in a portal layer above other content.
 * Ensures proper stacking and positioning.
 *
 * @component Select.Overlay - Optional background overlay. Can be transparent or
 * semi-transparent to capture outside clicks.
 *
 * @component Select.Content - Container for select content with three presentation modes:
 * popover (default floating with positioning and collision detection), bottom sheet modal, or dialog modal.
 * Supports custom animations.
 *
 * @component Select.Item - Selectable option item. Handles selection state and press events.
 *
 * @component Select.ItemLabel - Displays the label text for an item.
 *
 * @component Select.ItemIndicator - Optional indicator shown for selected items.
 *
 * @component Select.ListLabel - Label for the list of items.
 *
 * @component Select.Close - Close button for the select.
 * Can accept custom children or uses default close icon.
 *
 * @component Select.ItemDescription - Optional description text for items with muted styling.
 *
 * Props flow from Select to sub-components via context (placement, align, offset, value, etc.).
 * The select automatically positions itself relative to the trigger element.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/select
 */
const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  /** @optional Visual indicator showing open/close state (defaults to chevron) */
  TriggerIndicator: SelectTriggerIndicator,
  Value: SelectValue,
  Portal: SelectPortal,
  Overlay: SelectOverlay,
  Content: SelectContent,
  Item: SelectItem,
  ItemLabel: SelectItemLabel,
  ItemDescription: SelectItemDescription,
  ItemIndicator: SelectItemIndicator,
  ListLabel: SelectListLabel,
  Close: SelectClose,
});

export { useSelect, useSelectItem };
export default Select;
