import { forwardRef, useMemo } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";

import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type { AnimationRootDisableAll, ViewRef } from "../../helpers/internal/types";
import { combineStyles, createContext } from "../../helpers/internal/utils";
import * as Slot from "../../primitives/slot";
import { useSurfaceRootAnimation } from "./surface.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Surface components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.Surface.Root",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Variant options for the Surface component
 */
export type SurfaceVariant = "default" | "secondary" | "tertiary" | "transparent";

/**
 * Props for the Surface.Root component
 */
export interface SurfaceRootProps extends ViewProps {
  /**
   * Children elements to be rendered inside the surface
   */
  children?: React.ReactNode;
  /**
   * Visual variant of the surface
   * @default 'default'
   */
  variant?: SurfaceVariant;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Animation configuration for surface
   * - `"disable-all"`: Disable all animations including children
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
  /**
   * When `true`, merges surface styling onto the single child element (Slot pattern).
   * The child must be one React element. Uses `Slot.View` internally.
   * @default false
   */
  asChild?: boolean;
}

/**
 * Context value for the Surface component
 */
export interface SurfaceContextValue {
  /**
   * Visual variant of the surface
   */
  variant: SurfaceVariant;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "p-4 rounded-3xl shadow-surface overflow-hidden",
  variants: {
    variant: {
      default: "bg-surface",
      secondary: "bg-surface-secondary",
      tertiary: "bg-surface-tertiary",
      transparent: "bg-transparent shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const surfaceClassNames = combineStyles({
  root,
});

export const surfaceStyleSheet = StyleSheet.create({
  root: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const [SurfaceProvider, useSurface] = createContext<SurfaceContextValue>({
  name: "SurfaceContext",
  strict: false,
});

/* -------------------------------------------------------------------------------------------------
 * Surface
 * -----------------------------------------------------------------------------------------------*/
const Surface = forwardRef<ViewRef, SurfaceRootProps>(
  (
    { children, variant = "default", className, style, animation, asChild = false, ...props },
    ref,
  ) => {
    const RootComponent = asChild ? Slot.View : View;

    const rootClassName = surfaceClassNames.root({ variant, className });

    const { isAllAnimationsDisabled } = useSurfaceRootAnimation({
      animation,
    });

    const animationSettingsContextValue = useMemo(
      () => ({
        isAllAnimationsDisabled,
      }),
      [isAllAnimationsDisabled],
    );

    const contextValue = useMemo(() => ({ variant }), [variant]);

    return (
      <AnimationSettingsProvider value={animationSettingsContextValue}>
        <SurfaceProvider value={contextValue}>
          <RootComponent
            ref={ref}
            className={rootClassName}
            style={[surfaceStyleSheet.root, style]}
            {...props}
          >
            {children}
          </RootComponent>
        </SurfaceProvider>
      </AnimationSettingsProvider>
    );
  },
);

Surface.displayName = DISPLAY_NAME.ROOT;

/**
 * Surface component
 *
 * @component Surface - Container component that provides elevation and background styling.
 * - Polymorphic via `asChild` prop (Slot.View merges surface styling onto the child)
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/surface
 */
export default Surface;

export { Surface, useSurface };
