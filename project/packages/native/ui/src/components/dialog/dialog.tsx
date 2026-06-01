/**
 * Display names for Dialog components
 */
import { forwardRef, type ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import {
  type GestureResponderEvent,
  type Text as RNText,
  type StyleProp,
  StyleSheet,
  type TextProps,
  type View,
  type ViewStyle,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { type SharedValue } from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { FullWindowOverlay, HeroText } from "../../helpers/internal/components";
import { AnimationSettingsProvider, useAnimationSettings } from "../../helpers/internal/contexts";
import {
  usePopupDialogContentAnimation,
  usePopupOverlayAnimation,
  usePopupRootAnimation,
} from "../../helpers/internal/hooks";
import type {
  AnimationRootDisableAll,
  PopupDialogContentAnimation,
  PopupOverlayAnimation,
  PressableRef,
} from "../../helpers/internal/types";
import { combineStyles, createContext } from "../../helpers/internal/utils";
import * as DialogPrimitives from "../../primitives/dialog";
import type * as DialogPrimitivesTypes from "../../primitives/dialog/dialog.types";
import { CloseButton, type CloseButtonProps } from "../close-button";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Dialog.Root",
  TRIGGER: "PitsiUINative.Dialog.Trigger",
  PORTAL: "PitsiUINative.Dialog.Portal",
  OVERLAY: "PitsiUINative.Dialog.Overlay",
  CONTENT: "PitsiUINative.Dialog.Content",
  CLOSE: "PitsiUINative.Dialog.Close",
  TITLE: "PitsiUINative.Dialog.Title",
  DESCRIPTION: "PitsiUINative.Dialog.Description",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Dialog internal state for animation coordination
 */
export type DialogState = "idle" | "open" | "close";

/**
 * Context value for dialog animation state
 */
export interface DialogAnimationContextValue {
  /** Animation progress shared value (0=idle, 1=open, 2=close) */
  progress: SharedValue<number>;
  /** Dragging state shared value */
  isDragging: SharedValue<boolean>;
  /** Gesture release animation running state shared value */
  isGestureReleaseAnimationRunning: SharedValue<boolean>;
}

/**
 * Dialog Root component props
 */
export interface DialogRootProps extends DialogPrimitivesTypes.RootProps {
  /**
   * The content of the dialog
   */
  children?: ReactNode;
  /**
   * Animation configuration for dialog root
   * - `"disable-all"`: Disable all animations including children
   * - `false` or `"disabled"`: Disable only root animations
   * - `true` or `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Dialog Trigger component props
 */
export interface DialogTriggerProps extends DialogPrimitivesTypes.TriggerProps {
  /**
   * The trigger element content
   */
  children?: ReactNode;
}

/**
 * Dialog Portal component props
 */
export interface DialogPortalProps extends DialogPrimitivesTypes.PortalProps {
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
   * Additional style for the portal container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The portal content
   */
  children: ReactNode;
}

/**
 * Animation configuration for Dialog Overlay component
 */
export type DialogOverlayAnimation = PopupOverlayAnimation;

/**
 * Dialog Overlay component props
 */
export interface DialogOverlayProps extends Omit<DialogPrimitivesTypes.OverlayProps, "asChild"> {
  /**
   * Additional CSS class for the overlay
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `opacity` - Animated for overlay show/hide transitions (idle: 0, open: 1, close: 0)
   *
   * To customize this property, use the `animation` prop:
   * ```tsx
   * <Dialog.Overlay
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
  animation?: DialogOverlayAnimation;
  /**
   * Whether animated styles (react-native-reanimated) are active
   * When `false`, the animated style is removed and you can implement custom logic
   * This prop should only be used when you want to write custom styling logic instead of the default animated styles
   * @default true
   */
  isAnimatedStyleActive?: boolean;
}

/**
 * Animation configuration for Dialog Content component
 * Reuses PopupDialogContentAnimation since they share the same animation behavior
 */
export type DialogContentAnimation = PopupDialogContentAnimation;

/**
 * Dialog Content component props
 */
export interface DialogContentProps extends Omit<DialogPrimitivesTypes.ContentProps, "asChild"> {
  /**
   * Additional CSS class for the content container
   *
   * @note The following style properties are occupied by animations and cannot be set via className:
   * - `opacity` - Animated for content show/hide transitions (idle: 0, open: 1, close: 0)
   * - `transform` (specifically `scale`) - Animated for content show/hide transitions (idle: 0.97, open: 1, close: 0.97)
   *
   * To customize these properties, use the `animation` prop:
   * ```tsx
   * <Dialog.Content
   *   animation={{
   *     opacity: { value: [0, 1, 0] },
   *     scale: { value: [0.97, 1, 0.97] }
   *   }}
   * />
   * ```
   *
   * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
   */
  className?: string;
  /**
   * The dialog content
   */
  children?: ReactNode;
  /**
   * Animation configuration for content
   * - `false` or `"disabled"`: Disable all animations
   * - `true` or `undefined`: Use default animations
   * - `object`: Custom animation configuration
   */
  animation?: DialogContentAnimation;
  /**
   * Whether the dialog content can be swiped to dismiss
   * @default true
   */
  isSwipeable?: boolean;
}

/**
 * Dialog Close component props
 *
 * Extends CloseButtonProps, allowing full override of all close button props.
 * Automatically handles dialog close functionality when pressed.
 */
export type DialogCloseProps = CloseButtonProps;

/**
 * Dialog Title component props
 */
export interface DialogTitleProps extends TextProps {
  /**
   * Additional CSS class for the title
   */
  className?: string;
}

/**
 * Dialog Description component props
 */
export interface DialogDescriptionProps extends TextProps {
  /**
   * Additional CSS class for the description
   */
  className?: string;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const portal = tv({
  base: "absolute inset-0 justify-center p-5",
});

/**
 * Overlay style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property is animated and cannot be overridden using Tailwind classes:
 * - `opacity` - Animated for overlay show/hide transitions (idle: 0, open: 1, close: 0)
 *
 * To customize this property, use the `animation` prop on `Dialog.Overlay`:
 * ```tsx
 * <Dialog.Overlay
 *   animation={{
 *     opacity: { value: [0, 1, 0] }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Dialog.Overlay`.
 */
const overlay = tv({
  base: "absolute inset-0 bg-backdrop",
});

/**
 * Content style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following properties are animated and cannot be overridden using Tailwind classes:
 * - `opacity` - Animated for content show/hide transitions (idle: 0, open: 1, close: 0)
 * - `transform` (specifically `scale`) - Animated for content show/hide transitions (idle: 0.97, open: 1, close: 0.97)
 *
 * To customize these properties, use the `animation` prop on `Dialog.Content`:
 * ```tsx
 * <Dialog.Content
 *   animation={{
 *     opacity: { value: [0, 1, 0] },
 *     scale: { value: [0.97, 1, 0.97] }
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Dialog.Content`.
 */
const content = tv({
  base: "bg-overlay p-5 rounded-3xl shadow-overlay",
});

const label = tv({
  base: "text-lg font-medium text-foreground",
});

const description = tv({
  base: "text-base text-muted",
});

export const dialogClassNames = combineStyles({
  portal,
  overlay,
  content,
  label,
  description,
});

export const dialogStyleSheet = StyleSheet.create({
  contentContainer: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Animation
 * -----------------------------------------------------------------------------------------------*/
const [DialogAnimationProvider, useDialogAnimation] = createContext<DialogAnimationContextValue>({
  name: "DialogAnimationContext",
});

export { DialogAnimationProvider, useDialogAnimation };

/* -------------------------------------------------------------------------------------------------
 * Components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedOverlay = Animated.createAnimatedComponent(DialogPrimitives.Overlay);

const useDialog = DialogPrimitives.useRootContext;

// --------------------------------------------------

const DialogRoot = forwardRef<DialogPrimitivesTypes.RootRef, DialogRootProps>(
  ({ children, isOpen, isDefaultOpen, onOpenChange, animation, ...props }, ref) => {
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
        <DialogAnimationProvider value={animationContextValue}>
          <DialogPrimitives.Root
            ref={ref}
            isOpen={isOpen}
            isDefaultOpen={isDefaultOpen}
            onOpenChange={onOpenChange}
            {...props}
          >
            {children}
          </DialogPrimitives.Root>
        </DialogAnimationProvider>
      </AnimationSettingsProvider>
    );
  },
);

// --------------------------------------------------

const DialogTrigger = forwardRef<DialogPrimitivesTypes.TriggerRef, DialogTriggerProps>(
  (props, ref) => {
    return <DialogPrimitives.Trigger ref={ref} {...props} />;
  },
);

// --------------------------------------------------

const DialogPortal = ({
  className,
  children,
  style,
  disableFullWindowOverlay = false,
  unstable_accessibilityContainerViewIsModal,
  ...props
}: DialogPortalProps) => {
  const animationSettingsContext = useAnimationSettings();
  const animationContext = useDialogAnimation();

  const portalClassName = dialogClassNames.portal({ className });

  return (
    <DialogPrimitives.Portal {...props}>
      <AnimationSettingsProvider value={animationSettingsContext}>
        <DialogAnimationProvider value={animationContext}>
          <FullWindowOverlay
            disableFullWindowOverlay={disableFullWindowOverlay}
            unstable_accessibilityContainerViewIsModal={unstable_accessibilityContainerViewIsModal}
          >
            <Animated.View className={portalClassName} style={style} pointerEvents="box-none">
              {children}
            </Animated.View>
          </FullWindowOverlay>
        </DialogAnimationProvider>
      </AnimationSettingsProvider>
    </DialogPrimitives.Portal>
  );
};

// --------------------------------------------------

const DialogOverlay = forwardRef<DialogPrimitivesTypes.OverlayRef, DialogOverlayProps>(
  ({ className, style, animation, isAnimatedStyleActive = true, ...props }, ref) => {
    const { isOpen } = useDialog();

    const { progress, isDragging, isGestureReleaseAnimationRunning } = useDialogAnimation();

    const overlayClassName = dialogClassNames.overlay({ className });

    const { rContainerStyle, entering, exiting } = usePopupOverlayAnimation({
      progress,
      isDragging,
      isGestureReleaseAnimationRunning,
      animation,
    });

    if (!isOpen) {
      return null;
    }

    const overlayStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;

    return (
      <Animated.View entering={entering} exiting={exiting} style={StyleSheet.absoluteFill}>
        <AnimatedOverlay ref={ref} className={overlayClassName} style={overlayStyle} {...props} />
      </Animated.View>
    );
  },
);

// --------------------------------------------------

const DialogContent = forwardRef<DialogPrimitivesTypes.ContentRef, DialogContentProps>(
  ({ className, style, children, animation, isSwipeable = true, ...props }, ref) => {
    const { isOpen, onOpenChange } = useDialog();

    const { progress, isDragging, isGestureReleaseAnimationRunning } = useDialogAnimation();

    const contentClassName = dialogClassNames.content({ className });

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
      <GestureDetector gesture={panGesture}>
        <Animated.View ref={dragContainerRef} entering={entering} exiting={exiting}>
          <Animated.View style={rDragContainerStyle} pointerEvents="box-none">
            <DialogPrimitives.Content
              ref={ref}
              className={contentClassName}
              style={[dialogStyleSheet.contentContainer, style]}
              {...props}
            >
              {children}
            </DialogPrimitives.Content>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

// --------------------------------------------------

const DialogClose = forwardRef<PressableRef, DialogCloseProps>((props, ref) => {
  const { onPress: onPressProp, ...restProps } = props;
  const { onOpenChange } = useDialog();

  const onPress = (ev: GestureResponderEvent) => {
    onOpenChange(false);
    if (typeof onPressProp === "function") {
      onPressProp(ev);
    }
  };

  return <CloseButton ref={ref} onPress={onPress} {...restProps} />;
});

// --------------------------------------------------

const DialogTitle = forwardRef<RNText, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { nativeID } = useDialog();
    const titleClassName = dialogClassNames.label({ className });

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

const DialogDescription = forwardRef<RNText, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const { nativeID } = useDialog();

    const descriptionClassName = dialogClassNames.description({
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

DialogRoot.displayName = DISPLAY_NAME.ROOT;
DialogTrigger.displayName = DISPLAY_NAME.TRIGGER;
DialogPortal.displayName = DISPLAY_NAME.PORTAL;
DialogOverlay.displayName = DISPLAY_NAME.OVERLAY;
DialogContent.displayName = DISPLAY_NAME.CONTENT;
DialogClose.displayName = DISPLAY_NAME.CLOSE;
DialogTitle.displayName = DISPLAY_NAME.TITLE;
DialogDescription.displayName = DISPLAY_NAME.DESCRIPTION;

/**
 * Compound Dialog component with sub-components
 *
 * @component Dialog.Root - Main container that manages open/close state.
 * Provides the dialog context to child components.
 *
 * @component Dialog.Trigger - Button or element that opens the dialog.
 * Accepts any pressable element as children.
 *
 * @component Dialog.Portal - Portal container for dialog overlay and content.
 * Renders children in a portal with centered layout.
 *
 * @component Dialog.Overlay - Background overlay that covers the screen.
 * Typically closes the dialog when clicked.
 *
 * @component Dialog.Content - The dialog content container.
 * Contains the main dialog UI elements.
 *
 * @component Dialog.Close - Close button for the dialog.
 * Can accept custom children or uses default close icon.
 *
 * @component Dialog.Title - The dialog title text.
 * Automatically linked for accessibility.
 *
 * @component Dialog.Description - The dialog description text.
 * Automatically linked for accessibility.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/dialog
 */
const Dialog = Object.assign(DialogRoot, {
  /** @optional Trigger element to open the dialog */
  Trigger: DialogTrigger,
  /** @optional Portal container for overlay and content */
  Portal: DialogPortal,
  /** @optional Background overlay */
  Overlay: DialogOverlay,
  /** @optional Main dialog content container */
  Content: DialogContent,
  /** @optional Close button for the dialog */
  Close: DialogClose,
  /** @optional Dialog title text */
  Title: DialogTitle,
  /** @optional Dialog description text */
  Description: DialogDescription,
});

export { useDialog };
export default Dialog;
