/**
 * Display names for the Popover components
 */

import type BottomSheet from "@gorhom/bottom-sheet";
import type { BottomSheetProps } from "@gorhom/bottom-sheet";
import {
  createContext as createReactContext,
  forwardRef,
  type ReactNode,
  use,
  useMemo,
} from "react";
import {
  type GestureResponderEvent,
  type Text as RNText,
  type StyleProp,
  StyleSheet,
  type TextProps,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import Animated, { type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { cn } from "../../helpers/external/utils";
import { BottomSheetContent, FullWindowOverlay, HeroText } from "../../helpers/internal/components";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import {
  usePopupOverlayAnimation,
  usePopupPopoverContentAnimation,
  usePopupRootAnimation,
} from "../../helpers/internal/hooks";
import type {
  AnimationRootDisableAll,
  BaseBottomSheetContentProps,
  PopupOverlayAnimation,
  PopupPopoverContentAnimation,
  PressableRef,
} from "../../helpers/internal/types";
import { combineStyles, createContext } from "../../helpers/internal/utils";
import * as PopoverPrimitives from "../../primitives/popover";
import type * as PopoverPrimitivesTypes from "../../primitives/popover/popover.types";
import { CloseButton, type CloseButtonProps } from "../close-button";
import { ArrowSvg } from "./arrow-svg";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Popover.Root",
  TRIGGER: "PitsiUINative.Popover.Trigger",
  PORTAL: "PitsiUINative.Popover.Portal",
  OVERLAY: "PitsiUINative.Popover.Overlay",
  CONTENT: "PitsiUINative.Popover.Content",
  CLOSE: "PitsiUINative.Popover.Close",
  TITLE: "PitsiUINative.Popover.Title",
  DESCRIPTION: "PitsiUINative.Popover.Description",
  ARROW: "PitsiUINative.Popover.Arrow",
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
 * Context value for popover animation state
 */
export interface PopoverAnimationContextValue {
  /** Animation progress shared value (0=idle, 1=open, 2=close) */
  progress: SharedValue<number>;
  /** Dragging state shared value */
  isDragging: SharedValue<boolean>;
}

/**
 * Ref type for the Popover Trigger component
 */
export type PopoverTriggerRef = PopoverPrimitivesTypes.TriggerRef;

/**
 * Presentation mode for the popover content
 */
export type PopoverPresentation = "popover" | "bottom-sheet";

/**
 * Popover placement options
 */
export type PopoverPlacement = "top" | "bottom" | "left" | "right";

/**
 * Popover alignment options
 */
export type PopoverAlign = "start" | "center" | "end";

/**
 * Popover context value with presentation and placement
 */
export interface PopoverContentContextValue {
  /**
   * Current placement of the popover
   */
  placement?: PopoverPlacement;
}

/**
 * Popover Root component props
 */
export interface PopoverRootProps extends PopoverPrimitivesTypes.RootProps {
  /**
   * The content of the popover
   */
  children?: ReactNode;
  /**
   * Animation configuration for popover root
   * - `"disable-all"`: Disable all animations including children
   * - `false` or `"disabled"`: Disable only root animations
   * - `true` or `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Popover Trigger component props
 */
export interface PopoverTriggerProps extends PopoverPrimitivesTypes.TriggerProps {
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
 * Popover Portal component props
 */
export interface PopoverPortalProps extends PopoverPrimitivesTypes.PortalProps {
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
 * Popover Overlay component props
 */
export interface PopoverOverlayProps extends Omit<PopoverPrimitivesTypes.OverlayProps, "asChild"> {
  /**
   * Additional CSS class for the overlay
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `opacity` - Animated for overlay show/hide transitions (idle: 0, open: 1, close: 0) - only for bottom-sheet/dialog presentation
   *
   * To customize this property, use the `animation` prop:
   * ```tsx
   * <Popover.Overlay
   *   animation={{
   *     opacity: { value: [0, 1, 0] } // for bottom-sheet/dialog
   *   }}
   * />
   * ```
   *
   * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
   */
  className?: string;
  /**
   * Animation configuration for overlay
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   *   - `opacity`: Progress-based opacity animation (for bottom-sheet/dialog presentation)
   *   - `entering`: Entering animation (for popover presentation)
   *   - `exiting`: Exiting animation (for popover presentation)
   */
  animation?: PopupOverlayAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Popover Content props for 'popover' presentation
 */
export interface PopoverContentPopoverProps extends PopoverPrimitivesTypes.ContentProps {
  /**
   * Presentation mode for the popover content
   */
  presentation: "popover";
  /**
   * Additional CSS class for the content container
   */
  className?: string;
  /**
   * The popover content
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
 * Popover Content props for 'bottom-sheet' presentation
 */
export interface PopoverContentBottomSheetProps
  extends Partial<BottomSheetProps>,
    BaseBottomSheetContentProps {
  /**
   * Presentation mode for the popover
   */
  presentation: "bottom-sheet";
}

/**
 * Popover Content component props
 */
export type PopoverContentProps = PopoverContentPopoverProps | PopoverContentBottomSheetProps;

/**
 * Popover Close component props
 *
 * Extends CloseButtonProps, allowing full override of all close button props.
 * Automatically handles popover close functionality when pressed.
 */
export type PopoverCloseProps = CloseButtonProps;

/**
 * Popover Title component props
 */
export interface PopoverTitleProps extends TextProps {
  /**
   * Additional CSS class for the title
   */
  className?: string;
}

/**
 * Popover Description component props
 */
export interface PopoverDescriptionProps extends TextProps {
  /**
   * Additional CSS class for the description
   */
  className?: string;
}

/**
 * Return type for the usePopover hook
 */
export type UsePopoverReturn = PopoverPrimitivesTypes.IRootContext;

/**
 * Popover Arrow component props
 */
export interface PopoverArrowProps {
  /**
   * The arrow content
   */
  children?: ReactNode;
  /**
   * Style for the arrow
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Additional CSS class for the arrow
   */
  className?: string;
  /**
   * Height of the arrow in pixels
   * @default 12
   */
  height?: number;
  /**
   * Width of the arrow in pixels
   * @default 20
   */
  width?: number;
  /**
   * Fill color of the arrow (defaults to content background)
   */
  fill?: string;
  /**
   * Stroke (border) color of the arrow (defaults to content border color)
   */
  stroke?: string;
  /**
   * Stroke width of the arrow border in pixels
   * @default 1
   */
  strokeWidth?: number;
  /**
   * Baseline inset in pixels for stroke alignment (defaults to 1)
   * Set this to match the popover's border width so the arrow stroke
   * aligns seamlessly with the popover border. For example, if your
   * popover has a 2px border, set this to 2
   */
  strokeBaselineInset?: number;
  /**
   * Placement of the popover (inherited from content)
   */
  placement?: PopoverPlacement;
}

/**
 * Return type for the usePopoverAnimation hook
 */
export interface UsePopoverAnimationReturn {
  /**
   * Animation progress shared value (0=idle, 1=open, 2=close)
   */
  progress: SharedValue<number>;
  /**
   * Dragging state shared value
   */
  isDragging: SharedValue<boolean>;
}

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
 * The following property is animated and cannot be overridden using Tailwind classes:
 * - `opacity` - Animated for overlay show/hide transitions (idle: 0, open: 1, close: 0)
 *
 * To customize this property, use the `animation` prop on `Popover.Overlay`:
 * ```tsx
 * <Popover.Overlay
 *   animation={{
 *     opacity: { value: [0, 1, 0] }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Popover.Overlay`.
 */
const overlay = tv({
  base: "absolute inset-0",
});

/**
 * Popover content style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following properties are animated and cannot be overridden using Tailwind classes:
 * - `opacity` - Animated for content show/hide transitions (idle: 0, open: 1, close: 0)
 * - `transform` (specifically `scale`, `translateX`, `translateY`) - Animated for content show/hide transitions (scale: idle: 0.95, open: 1, close: 0.95; translateX/translateY: based on placement)
 * - `transformOrigin` - Animated for content show/hide transitions (based on placement: 'top', 'bottom', 'left', 'right')
 *
 * To customize these properties, use the `animation` prop on `Popover.Content`:
 * ```tsx
 * <Popover.Content
 *   presentation="popover"
 *   animation={{
 *     opacity: { value: [0, 1, 0] },
 *     scale: { value: [0.95, 1, 0.95] },
 *     translateX: { value: [4, 0, 4] },
 *     translateY: { value: [4, 0, 4] },
 *     transformOrigin: { value: 'top' }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Popover.Content`.
 */
const content = tv({
  base: "absolute bg-overlay p-3 px-4 rounded-3xl shadow-overlay",
});

/**
 * @note When Popover.Content uses `presentation="bottom-sheet"`, it uses `bottomSheetClassNames`
 * from `../bottom-sheet/bottom-sheet.styles` instead of `popoverClassNames.content`.
 * See `popover.tsx` PopoverContentBottomSheet component for usage.
 */

const close = tv({
  base: "",
});

const label = tv({
  base: "text-lg font-medium text-foreground",
});

const description = tv({
  base: "text-base/snug text-muted",
});

const arrow = tv({
  base: "absolute z-50",
});

export const popoverClassNames = combineStyles({
  portal,
  overlay,
  content,
  close,
  label,
  description,
  arrow,
});

export const popoverStyleSheet = StyleSheet.create({
  contentContainer: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/
const [PopoverAnimationProvider, usePopoverAnimation] = createContext<PopoverAnimationContextValue>(
  {
    name: "PopoverAnimationContext",
  },
);

export { PopoverAnimationProvider, usePopoverAnimation };

/* -------------------------------------------------------------------------------------------------
 * Components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedOverlay = Animated.createAnimatedComponent(PopoverPrimitives.Overlay);

const AnimatedContent = Animated.createAnimatedComponent(PopoverPrimitives.Content);

const usePopover = PopoverPrimitives.useRootContext;

const PopoverContentContext = createReactContext<PopoverContentContextValue>({
  placement: undefined,
});

// --------------------------------------------------

const PopoverRoot = forwardRef<PopoverPrimitivesTypes.RootRef, PopoverRootProps>(
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
        <PopoverAnimationProvider value={animationContextValue}>
          <PopoverPrimitives.Root
            ref={ref}
            presentation={presentation}
            isOpen={isOpenProp}
            isDefaultOpen={isDefaultOpen}
            onOpenChange={onOpenChangeProp}
            {...props}
          >
            {children}
          </PopoverPrimitives.Root>
        </PopoverAnimationProvider>
      </AnimationSettingsProvider>
    );
  },
);

// --------------------------------------------------

const PopoverTrigger = forwardRef<PopoverPrimitivesTypes.TriggerRef, PopoverTriggerProps>(
  (props, ref) => {
    return <PopoverPrimitives.Trigger ref={ref} {...props} />;
  },
);

// --------------------------------------------------

const PopoverPortal = ({
  className,
  children,
  disableFullWindowOverlay = false,
  unstable_accessibilityContainerViewIsModal,
  ...props
}: PopoverPortalProps) => {
  const animationSettingsContext = useAnimationSettings();
  const animationContext = usePopoverAnimation();

  const portalClassName = popoverClassNames.portal({ className });

  return (
    <PopoverPrimitives.Portal {...props}>
      <AnimationSettingsProvider value={animationSettingsContext}>
        <PopoverAnimationProvider value={animationContext}>
          <FullWindowOverlay
            disableFullWindowOverlay={disableFullWindowOverlay}
            unstable_accessibilityContainerViewIsModal={unstable_accessibilityContainerViewIsModal}
          >
            <View className={portalClassName} pointerEvents="box-none">
              {children}
            </View>
          </FullWindowOverlay>
        </PopoverAnimationProvider>
      </AnimationSettingsProvider>
    </PopoverPrimitives.Portal>
  );
};

// --------------------------------------------------

const PopoverOverlay = forwardRef<PopoverPrimitivesTypes.OverlayRef, PopoverOverlayProps>(
  ({ className, style, animation, isAnimatedStyleActive = true, ...props }, ref) => {
    const { isOpen, presentation } = usePopover();
    const { progress, isDragging } = usePopoverAnimation();

    const overlayClassName = popoverClassNames.overlay({ className });

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

const PopoverContentPopover = forwardRef<
  PopoverPrimitivesTypes.ContentRef,
  PopoverContentPopoverProps
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
    const { contentLayout } = usePopover();

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

    const contentClassName = popoverClassNames.content({
      className,
    });

    const { entering, exiting } = usePopupPopoverContentAnimation({
      placement,
      offset,
      animation,
    });

    return (
      <PopoverContentContext value={{ placement }}>
        {isReady && (
          <AnimatedContent
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
            style={[popoverStyleSheet.contentContainer, style]}
            {...props}
          >
            {children}
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
          style={[popoverStyleSheet.contentContainer, style]}
          {...props}
        >
          {children}
        </AnimatedContent>
      </PopoverContentContext>
    );
  },
);

// --------------------------------------------------

const PopoverContentBottomSheet = forwardRef<BottomSheet, PopoverContentBottomSheetProps>(
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
    const { isOpen, onOpenChange } = usePopover();

    const { progress, isDragging } = usePopoverAnimation();

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
        backgroundStyle={[popoverStyleSheet.contentContainer, restProps.backgroundStyle]}
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

const PopoverContent = forwardRef<
  PopoverPrimitivesTypes.ContentRef | BottomSheet,
  PopoverContentProps
>((props, ref) => {
  const { presentation: contextPresentation } = usePopover();

  if (__DEV__) {
    if (props.presentation !== contextPresentation) {
      throw new Error(
        `Popover.Content presentation prop ("${props.presentation}") does not match Popover.Root presentation prop ("${contextPresentation}"). They must be the same.`,
      );
    }
  }

  if (props.presentation === "bottom-sheet") {
    return (
      <PopoverContentBottomSheet
        ref={ref as React.Ref<BottomSheet>}
        {...(props as PopoverContentBottomSheetProps)}
      />
    );
  }

  return (
    <PopoverContentPopover
      ref={ref as React.Ref<PopoverPrimitivesTypes.ContentRef>}
      {...(props as PopoverContentPopoverProps)}
    />
  );
});

// --------------------------------------------------

const PopoverClose = forwardRef<PressableRef, PopoverCloseProps>((props, ref) => {
  const { onPress: onPressProp, ...restProps } = props;
  const { onOpenChange } = usePopover();

  const onPress = (ev: GestureResponderEvent) => {
    onOpenChange(false);
    if (typeof onPressProp === "function") {
      onPressProp(ev);
    }
  };

  return <CloseButton ref={ref} onPress={onPress} {...restProps} />;
});

// --------------------------------------------------

const PopoverTitle = forwardRef<RNText, PopoverTitleProps>(
  ({ className, children, ...props }, ref) => {
    const titleClassName = popoverClassNames.label({ className });

    return (
      <HeroText
        ref={ref}
        role="heading"
        accessibilityRole="header"
        className={titleClassName}
        {...props}
      >
        {children}
      </HeroText>
    );
  },
);

// --------------------------------------------------

const PopoverDescription = forwardRef<RNText, PopoverDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const descriptionClassName = popoverClassNames.description({
      className,
    });

    return (
      <HeroText ref={ref} accessibilityRole="text" className={descriptionClassName} {...props}>
        {children}
      </HeroText>
    );
  },
);

// --------------------------------------------------

const PopoverArrow = forwardRef<View, PopoverArrowProps>(
  (
    {
      children,
      style,
      className,
      height = 12,
      width = 20,
      fill,
      stroke,
      strokeWidth = 1,
      placement: placementLocal,
      strokeBaselineInset = 1,
    },
    ref,
  ) => {
    const [themeColorOverlay, themeColorBorder] = useThemeColor(["overlay", "border"]);
    const { triggerPosition, contentLayout } = usePopover();
    const { placement: placementContext } = use(PopoverContentContext);

    const placement = placementLocal || placementContext;

    const arrowClassName = popoverClassNames.arrow({ className });

    if (
      !triggerPosition ||
      !contentLayout ||
      contentLayout.x === 0 ||
      contentLayout.y === 0 ||
      !placement
    ) {
      return null;
    }

    const arrowFill = fill || themeColorOverlay;
    const arrowStroke = stroke || themeColorBorder;

    const getArrowPosition = (): StyleProp<ViewStyle> => {
      const triggerCenterX = triggerPosition.pageX + triggerPosition.width / 2;
      const triggerCenterY = triggerPosition.pageY + triggerPosition.height / 2;

      const baseStyle: ViewStyle = {
        position: "absolute",
      };

      switch (placement) {
        case "top":
          return {
            ...baseStyle,
            bottom: -height + strokeBaselineInset,
            left: Math.min(
              Math.max(12, triggerCenterX - contentLayout.x - width / 2),
              contentLayout.width - width - 12,
            ),
          };
        case "bottom":
          return {
            ...baseStyle,
            top: -height + strokeBaselineInset,
            left: Math.min(
              Math.max(12, triggerCenterX - contentLayout.x - width / 2),
              contentLayout.width - width - 12,
            ),
          };

        case "left":
          return {
            ...baseStyle,
            right: -height + strokeBaselineInset,
            top: Math.min(
              Math.max(12, triggerCenterY - contentLayout.y - width / 2),
              contentLayout.height - width - 12,
            ),
          };

        case "right":
          return {
            ...baseStyle,
            left: -height + strokeBaselineInset,
            top: Math.min(
              Math.max(12, triggerCenterY - contentLayout.y - width / 2),
              contentLayout.height - width - 12,
            ),
          };
        default:
          return baseStyle;
      }
    };

    const arrowPositionStyle = getArrowPosition();

    return (
      <Animated.View
        ref={ref}
        className={arrowClassName}
        style={[arrowPositionStyle, style]}
        pointerEvents="none"
      >
        {children ? (
          children
        ) : (
          <ArrowSvg
            width={width}
            height={height}
            placement={placement}
            fill={arrowFill}
            stroke={arrowStroke}
            strokeWidth={strokeWidth}
          />
        )}
      </Animated.View>
    );
  },
);

// --------------------------------------------------

PopoverRoot.displayName = DISPLAY_NAME.ROOT;
PopoverTrigger.displayName = DISPLAY_NAME.TRIGGER;
PopoverPortal.displayName = DISPLAY_NAME.PORTAL;
PopoverOverlay.displayName = DISPLAY_NAME.OVERLAY;
PopoverContent.displayName = DISPLAY_NAME.CONTENT;
PopoverClose.displayName = DISPLAY_NAME.CLOSE;
PopoverTitle.displayName = DISPLAY_NAME.TITLE;
PopoverDescription.displayName = DISPLAY_NAME.DESCRIPTION;
PopoverArrow.displayName = DISPLAY_NAME.ARROW;

/**
 * Compound Popover component with sub-components
 *
 * @component Popover - Main container that manages open/close state, positioning,
 * and provides context to child components. Handles placement, alignment, and collision detection.
 *
 * @component Popover.Trigger - Clickable element that toggles the popover visibility.
 * Wraps any child element with press handlers.
 *
 * @component Popover.Portal - Renders popover content in a portal layer above other content.
 * Ensures proper stacking and positioning.
 *
 * @component Popover.Overlay - Optional background overlay. Can be transparent or
 * semi-transparent to capture outside clicks.
 *
 * @component Popover.Content - Container for popover content with two presentation modes:
 * default floating popover with positioning and collision detection, or bottom sheet modal.
 * Supports arrow indicators and custom animations.
 *
 * @component Popover.Arrow - Optional arrow indicator pointing to the trigger element.
 * Automatically positions itself based on popover placement.
 *
 * @component Popover.Close - Close button for the popover.
 * Can accept custom children or uses default close icon.
 *
 * @component Popover.Title - Optional title text with pre-styled typography.
 *
 * @component Popover.Description - Optional description text with muted styling.
 *
 * Props flow from Popover to sub-components via context (placement, align, offset, etc.).
 * The popover automatically positions itself relative to the trigger element.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/popover
 */
const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Overlay: PopoverOverlay,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
  Title: PopoverTitle,
  Description: PopoverDescription,
});

export { usePopover };
export default Popover;
