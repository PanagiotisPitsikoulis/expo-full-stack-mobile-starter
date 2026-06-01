import { type ComponentType, cloneElement, createElement, forwardRef, isValidElement } from "react";
import { type LayoutChangeEvent, StyleSheet, View, type ViewProps } from "react-native";
import Animated, { useComposedEventHandler } from "react-native-reanimated";
import { tv } from "tailwind-variants";

import { useThemeColor } from "../../helpers/external/hooks";
import { colorKit } from "../../helpers/external/utils";
import type { AnimationRoot, AnimationValue } from "../../helpers/internal/types";
import { combineStyles, easeGradient } from "../../helpers/internal/utils";
import { useScrollShadowRootAnimation } from "./scroll-shadow.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display name constants for ScrollShadow components
 */
export const SCROLL_SHADOW_DISPLAY_NAME = {
  ROOT: "PitsiUINative.ScrollShadow",
} as const;

/**
 * Default size for gradient shadows in pixels
 */
export const DEFAULT_SHADOW_SIZE = 50;

/**
 * Animation duration for shadow opacity transitions in milliseconds
 */
export const SHADOW_EXIT_ANIMATION_DURATION = 200;

/**
 * Default scroll event throttle for performance
 */
export const DEFAULT_SCROLL_EVENT_THROTTLE = 16;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Orientation of the scroll shadow
 * @default 'vertical'
 */
export type ScrollShadowOrientation = "horizontal" | "vertical";

/**
 * Visibility mode for the scroll shadows
 */
export type ScrollShadowVisibility = "auto" | "top" | "bottom" | "left" | "right" | "both" | "none";

export interface LinearGradientProps {
  colors: any;
  locations?: any;
  start?: any;
  end?: any;
  style?: any;
}

export type LinearGradientComponent = ComponentType<LinearGradientProps>;

/**
 * Animation configuration for ScrollShadow root component
 */
export type ScrollShadowRootAnimation = AnimationRoot<{
  /**
   * Opacity animation configuration
   */
  opacity?: AnimationValue<{
    value?: [number, number];
  }>;
}>;

/**
 * Props for the ScrollShadow component
 */
export interface ScrollShadowProps extends ViewProps {
  children: React.ReactElement;
  size?: number;
  orientation?: ScrollShadowOrientation;
  visibility?: ScrollShadowVisibility;
  color?: string;
  isEnabled?: boolean;
  className?: string;
  LinearGradientComponent: LinearGradientComponent;
  animation?: ScrollShadowRootAnimation;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
/**
 * ScrollShadow component styles using tailwind-variants
 */
const root = tv({
  base: "",
});

export const scrollShadowClassNames = combineStyles({
  root,
});

/**
 * Native styles for properties not supported by NativeWind
 */
export const scrollShadowStyleSheet = StyleSheet.create({
  topShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: "none",
  },
  bottomShadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: "none",
  },
  leftShadow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    pointerEvents: "none",
  },
  rightShadow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: "none",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/
/**
 * Cache for animated components to prevent remounting on every render.
 */
const animatedComponentCache = new WeakMap<ComponentType<any>, ComponentType<any>>();

/**
 * Gets or creates a cached animated component for the given component type.
 */
function getAnimatedComponent(ComponentType: ComponentType<any>): ComponentType<any> {
  let cached = animatedComponentCache.get(ComponentType);
  if (!cached) {
    try {
      cached = Animated.createAnimatedComponent(ComponentType);
      animatedComponentCache.set(ComponentType, cached);
    } catch (error) {
      throw new Error(
        `ScrollShadow: Failed to create animated component: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return cached;
}

/* -------------------------------------------------------------------------------------------------
 * ScrollShadow
 * -----------------------------------------------------------------------------------------------*/
const ScrollShadowRoot = forwardRef<View, ScrollShadowProps>((props, ref) => {
  const {
    children,
    size = DEFAULT_SHADOW_SIZE,
    orientation: orientationProp,
    visibility = "auto",
    color,
    isEnabled = true,
    className,
    style,
    LinearGradientComponent,
    animation,
    ...restProps
  } = props;

  const themeColorBackground = useThemeColor("background");
  const shadowColor = color || themeColorBackground;

  const rootClassName = scrollShadowClassNames.root({ className });

  const childHorizontal =
    children?.props && typeof children?.props === "object" && "horizontal" in children.props
      ? children.props.horizontal
      : false;
  const orientation = orientationProp || (childHorizontal ? "horizontal" : "vertical");

  const { contentSize, containerSize, localScrollHandler, topShadowStyle, bottomShadowStyle } =
    useScrollShadowRootAnimation({
      animation,
      orientation,
      size,
      visibility,
      isEnabled,
    });

  const onContentSizeChange = (w: number, h: number) => {
    const contentDimension = orientation === "vertical" ? h : w;
    contentSize.set(contentDimension);
    (children as any).props?.onContentSizeChange?.(w, h);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const containerDimension = orientation === "vertical" ? height : width;
    containerSize.set(containerDimension);
    (children as any).props?.onLayout?.(event);
  };

  const outerScrollHandler = (children as any).props?.onScroll;
  const handlers = outerScrollHandler
    ? [localScrollHandler, outerScrollHandler]
    : [localScrollHandler];

  const onScroll = useComposedEventHandler(handlers);

  const scrollEventThrottle =
    (children as any).props?.scrollEventThrottle || DEFAULT_SCROLL_EVENT_THROTTLE;

  if (!isValidElement(children)) {
    return null;
  }

  const isAnimatedComponent =
    (children.type as any)?.displayName?.includes("AnimatedComponent") ||
    (children.type as any)?.__isAnimatedComponent;

  const enhancedChild = isAnimatedComponent
    ? cloneElement(children as any, {
        onContentSizeChange,
        onLayout,
        scrollEventThrottle,
        onScroll,
      })
    : createElement(getAnimatedComponent(children.type as any), {
        ...(children as any).props,
        onContentSizeChange,
        onLayout,
        scrollEventThrottle,
        onScroll,
      });

  const { colors: topLeftColors, locations: topLeftLocations } = easeGradient({
    colorStops: {
      0: {
        color: colorKit.setAlpha(shadowColor, 1).hex(),
      },
      1: {
        color: colorKit.setAlpha(shadowColor, 0).hex(),
      },
    },
  });

  const { colors: bottomRightColors, locations: bottomRightLocations } = easeGradient({
    colorStops: {
      0: {
        color: colorKit.setAlpha(shadowColor, 0).hex(),
      },
      1: {
        color: colorKit.setAlpha(shadowColor, 1).hex(),
      },
    },
  });

  return (
    <View ref={ref} className={rootClassName} style={style} {...restProps}>
      {enhancedChild}

      {/* Top/Left Shadow */}
      {orientation === "vertical" ? (
        <Animated.View style={[scrollShadowStyleSheet.topShadow, { height: size }, topShadowStyle]}>
          <LinearGradientComponent
            colors={topLeftColors}
            locations={topLeftLocations}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : (
        <Animated.View style={[scrollShadowStyleSheet.leftShadow, { width: size }, topShadowStyle]}>
          <LinearGradientComponent
            colors={topLeftColors}
            locations={topLeftLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* Bottom/Right Shadow */}
      {orientation === "vertical" ? (
        <Animated.View
          style={[scrollShadowStyleSheet.bottomShadow, { height: size }, bottomShadowStyle]}
        >
          <LinearGradientComponent
            colors={bottomRightColors}
            locations={bottomRightLocations}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[scrollShadowStyleSheet.rightShadow, { width: size }, bottomShadowStyle]}
        >
          <LinearGradientComponent
            colors={bottomRightColors}
            locations={bottomRightLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
});

ScrollShadowRoot.displayName = SCROLL_SHADOW_DISPLAY_NAME.ROOT;

/**
 * Compound ScrollShadow component
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/scroll-shadow
 */
export { ScrollShadowRoot as ScrollShadow };
export default ScrollShadowRoot;
