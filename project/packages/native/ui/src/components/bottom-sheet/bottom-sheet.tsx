import type GorhomBottomSheet from "@gorhom/bottom-sheet";
import type { BottomSheetProps } from "@gorhom/bottom-sheet";
import { forwardRef, type ReactNode, useMemo } from "react";
import {
  type GestureResponderEvent,
  type Text as RNText,
  StyleSheet,
  type TextProps,
} from "react-native";
import Animated, { type SharedValue, useSharedValue } from "react-native-reanimated";
import { BottomSheetContent as InternalBottomSheetContent } from "../../helpers/internal/components/bottom-sheet-content";
import { FullWindowOverlay } from "../../helpers/internal/components/full-window-overlay";
import { HeroText } from "../../helpers/internal/components/hero-text";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import { usePopupOverlayAnimation, usePopupRootAnimation } from "../../helpers/internal/hooks";
import type {
  AnimationRootDisableAll,
  BaseBottomSheetContentProps,
  PopupOverlayAnimation,
  PressableRef,
} from "../../helpers/internal/types";
import { createContext } from "../../helpers/internal/utils";
import * as BottomSheetPrimitives from "../../primitives/bottom-sheet";
import type * as BottomSheetPrimitivesTypes from "../../primitives/bottom-sheet/bottom-sheet.types";
import { CloseButton, type CloseButtonProps } from "../close-button";
import { bottomSheetClassNames, bottomSheetStyleSheet } from "./bottom-sheet.shared";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for BottomSheet components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.BottomSheet.Root",
  TRIGGER: "PitsiUINative.BottomSheet.Trigger",
  PORTAL: "PitsiUINative.BottomSheet.Portal",
  OVERLAY: "PitsiUINative.BottomSheet.Overlay",
  CONTENT: "PitsiUINative.BottomSheet.Content",
  CLOSE: "PitsiUINative.BottomSheet.Close",
  TITLE: "PitsiUINative.BottomSheet.Title",
  DESCRIPTION: "PitsiUINative.BottomSheet.Description",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Context value for bottom sheet animation state
 */
export interface BottomSheetAnimationContextValue {
  /** Animation progress shared value (0=idle, 1=open, 2=close) */
  progress: SharedValue<number>;
  /** Dragging state shared value */
  isDragging: SharedValue<boolean>;
}

/**
 * BottomSheet Root component props
 */
export interface BottomSheetRootProps extends BottomSheetPrimitivesTypes.RootProps {
  /**
   * The content of the bottom sheet
   */
  children?: ReactNode;
  /**
   * Animation configuration for bottom sheet root
   * - `"disable-all"`: Disable all animations including children
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * BottomSheet Trigger component props
 */
export interface BottomSheetTriggerProps extends BottomSheetPrimitivesTypes.TriggerProps {
  /**
   * The trigger element content
   */
  children?: ReactNode;
}

/**
 * BottomSheet Portal component props
 */
export interface BottomSheetPortalProps extends BottomSheetPrimitivesTypes.PortalProps {
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
   * The portal content
   */
  children: ReactNode;
}

/**
 * BottomSheet Overlay component props
 */
export interface BottomSheetOverlayProps extends BottomSheetPrimitivesTypes.OverlayProps {
  /**
   * Additional CSS class for the overlay
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `opacity` - Animated for overlay show/hide transitions (idle: 0, open: 1, close: 0)
   *
   * To customize this property, use the `animation` prop:
   * ```tsx
   * <BottomSheet.Overlay
   *   animation={{
   *     opacity: { value: [0, 1, 0] }
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
   */
  animation?: Omit<PopupOverlayAnimation, "entering" | "exiting">;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * BottomSheet Content component props
 */
export interface BottomSheetContentProps
  extends Partial<BottomSheetProps>,
    BaseBottomSheetContentProps {}

/**
 * BottomSheet Close component props
 *
 * Extends CloseButtonProps, allowing full override of all close button props.
 * Automatically handles bottom sheet close functionality when pressed.
 */
export type BottomSheetCloseProps = CloseButtonProps;

/**
 * BottomSheet Title component props
 */
export interface BottomSheetTitleProps extends TextProps {
  /**
   * Additional CSS class for the title
   */
  className?: string;
}

/**
 * BottomSheet Description component props
 */
export interface BottomSheetDescriptionProps extends TextProps {
  /**
   * Additional CSS class for the description
   */
  className?: string;
}

/**
 * Return type for the useBottomSheetAnimation hook
 */
export interface UseBottomSheetAnimationReturn {
  /**
   * Animation progress shared value (0=idle, 1=open, 2=close)
   */
  progress: SharedValue<number>;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
/**
 * Overlay style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property is animated and cannot be overridden using Tailwind classes:
 * - `opacity` - Animated for overlay show/hide transitions (idle: 0, open: 1, close: 0)
 *
 * To customize this property, use the `animation` prop on `BottomSheet.Overlay`:
 * ```tsx
 * <BottomSheet.Overlay
 *   animation={{
 *     opacity: { value: [0, 1, 0] }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `BottomSheet.Overlay`.
 */
/* -------------------------------------------------------------------------------------------------
 * Context / Animation
 * -----------------------------------------------------------------------------------------------*/
const [BottomSheetAnimationProvider, useBottomSheetAnimation] =
  createContext<BottomSheetAnimationContextValue>({
    name: "BottomSheetAnimationContext",
  });

export { BottomSheetAnimationProvider, useBottomSheetAnimation };

/* -------------------------------------------------------------------------------------------------
 * Components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedOverlay = Animated.createAnimatedComponent(BottomSheetPrimitives.Overlay);

const useBottomSheet = BottomSheetPrimitives.useRootContext;

// --------------------------------------------------

const BottomSheetRoot = forwardRef<BottomSheetPrimitivesTypes.RootRef, BottomSheetRootProps>(
  ({ children, isOpen, isDefaultOpen, onOpenChange, animation, ...props }, ref) => {
    const { progress, isDragging, isAllAnimationsDisabled } = usePopupRootAnimation({
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
        <BottomSheetAnimationProvider value={animationContextValue}>
          <BottomSheetPrimitives.Root
            ref={ref}
            isOpen={isOpen}
            isDefaultOpen={isDefaultOpen}
            onOpenChange={onOpenChange}
            {...props}
          >
            {children}
          </BottomSheetPrimitives.Root>
        </BottomSheetAnimationProvider>
      </AnimationSettingsProvider>
    );
  },
);

// --------------------------------------------------

const BottomSheetTrigger = forwardRef<
  BottomSheetPrimitivesTypes.TriggerRef,
  BottomSheetTriggerProps
>((props, ref) => {
  return <BottomSheetPrimitives.Trigger ref={ref} {...props} />;
});

// --------------------------------------------------

const BottomSheetPortal = ({
  children,
  disableFullWindowOverlay = false,
  unstable_accessibilityContainerViewIsModal,
  ...props
}: BottomSheetPortalProps) => {
  const animationSettingsContext = useAnimationSettings();
  const animationContext = useBottomSheetAnimation();

  return (
    <BottomSheetPrimitives.Portal {...props}>
      <AnimationSettingsProvider value={animationSettingsContext}>
        <BottomSheetAnimationProvider value={animationContext}>
          <FullWindowOverlay
            disableFullWindowOverlay={disableFullWindowOverlay}
            unstable_accessibilityContainerViewIsModal={unstable_accessibilityContainerViewIsModal}
          >
            <Animated.View style={StyleSheet.absoluteFill} pointerEvents="box-none">
              {children}
            </Animated.View>
          </FullWindowOverlay>
        </BottomSheetAnimationProvider>
      </AnimationSettingsProvider>
    </BottomSheetPrimitives.Portal>
  );
};

// --------------------------------------------------

const BottomSheetOverlay = forwardRef<
  BottomSheetPrimitivesTypes.OverlayRef,
  BottomSheetOverlayProps
>(({ className, style, animation, isAnimatedStyleActive = true, ...props }, ref) => {
  const { isOpen } = useBottomSheet();
  const { progress } = useBottomSheetAnimation();
  const isDragging = useSharedValue(false);

  const overlayClassName = bottomSheetClassNames.overlay({ className });

  const { rContainerStyle } = usePopupOverlayAnimation({
    progress,
    isDragging,
    animation,
  });

  if (!isOpen) {
    return null;
  }

  const overlayStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

  return (
    <AnimatedOverlay
      ref={ref}
      className={overlayClassName}
      style={overlayStyle}
      pointerEvents={isOpen ? "auto" : "none"}
      {...props}
    />
  );
});

// --------------------------------------------------

const BottomSheetContent = forwardRef<GorhomBottomSheet, BottomSheetContentProps>(
  (
    {
      children,
      index: initialIndex,
      backgroundClassName,
      handleIndicatorClassName,
      contentContainerClassName: contentContainerClassNameProp,
      contentContainerProps,
      animationConfigs,
      animation,
      ...restProps
    },
    ref,
  ) => {
    const { isOpen, onOpenChange } = useBottomSheet();

    const { progress, isDragging } = useBottomSheetAnimation();

    return (
      <InternalBottomSheetContent
        ref={ref}
        index={initialIndex}
        backgroundClassName={backgroundClassName}
        handleIndicatorClassName={handleIndicatorClassName}
        contentContainerClassName={contentContainerClassNameProp}
        contentContainerProps={contentContainerProps}
        animation={animation}
        animationConfigs={animationConfigs}
        backgroundStyle={[bottomSheetStyleSheet.contentContainer, restProps.backgroundStyle]}
        isOpen={isOpen}
        progress={progress}
        isDragging={isDragging}
        onOpenChange={onOpenChange}
        {...restProps}
      >
        {children}
      </InternalBottomSheetContent>
    );
  },
);

// --------------------------------------------------

const BottomSheetClose = forwardRef<PressableRef, BottomSheetCloseProps>((props, ref) => {
  const { onPress: onPressProp, ...restProps } = props;
  const { onOpenChange } = useBottomSheet();

  const onPress = (ev: GestureResponderEvent) => {
    onOpenChange(false);
    if (typeof onPressProp === "function") {
      onPressProp(ev);
    }
  };

  return <CloseButton ref={ref} onPress={onPress} {...restProps} />;
});

// --------------------------------------------------

const BottomSheetTitle = forwardRef<RNText, BottomSheetTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { nativeID } = useBottomSheet();
    const titleClassName = bottomSheetClassNames.label({ className });

    return (
      <HeroText
        ref={ref}
        role="heading"
        accessibilityRole="header"
        nativeID={`${nativeID}_label`}
        className={titleClassName}
        {...props}
      >
        {children}
      </HeroText>
    );
  },
);

// --------------------------------------------------

const BottomSheetDescription = forwardRef<RNText, BottomSheetDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const { nativeID } = useBottomSheet();

    const descriptionClassName = bottomSheetClassNames.description({
      className,
    });

    return (
      <HeroText
        ref={ref}
        accessibilityRole="text"
        nativeID={`${nativeID}_desc`}
        className={descriptionClassName}
        {...props}
      >
        {children}
      </HeroText>
    );
  },
);

// --------------------------------------------------

BottomSheetRoot.displayName = DISPLAY_NAME.ROOT;
BottomSheetTrigger.displayName = DISPLAY_NAME.TRIGGER;
BottomSheetPortal.displayName = DISPLAY_NAME.PORTAL;
BottomSheetOverlay.displayName = DISPLAY_NAME.OVERLAY;
BottomSheetContent.displayName = DISPLAY_NAME.CONTENT;
BottomSheetClose.displayName = DISPLAY_NAME.CLOSE;
BottomSheetTitle.displayName = DISPLAY_NAME.TITLE;
BottomSheetDescription.displayName = DISPLAY_NAME.DESCRIPTION;

/**
 * Compound BottomSheet component with sub-components
 */
const BottomSheet = Object.assign(BottomSheetRoot, {
  /** @optional Trigger element to open the bottom sheet */
  Trigger: BottomSheetTrigger,
  /** @optional Portal container for overlay and content */
  Portal: BottomSheetPortal,
  /** @optional Background overlay */
  Overlay: BottomSheetOverlay,
  /** @optional Main bottom sheet content container */
  Content: BottomSheetContent,
  /** @optional Close button for the bottom sheet */
  Close: BottomSheetClose,
  /** @optional Bottom sheet title text */
  Title: BottomSheetTitle,
  /** @optional Bottom sheet description text */
  Description: BottomSheetDescription,
});

export { useBottomSheet };
export default BottomSheet;
