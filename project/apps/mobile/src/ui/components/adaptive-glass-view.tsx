import type { ComponentType } from "react";
import { Platform, View, type ViewProps } from "react-native";

type AdaptiveGlassViewProps = ViewProps & {
  className?: string;
  colorScheme?: string;
  glassEffectStyle?: string;
  isInteractive?: boolean;
};

type GlassEffectPackage = {
  GlassView: ComponentType<AdaptiveGlassViewProps>;
  isGlassEffectAPIAvailable?: () => boolean;
  isLiquidGlassAvailable?: () => boolean;
};

let glassEffect: GlassEffectPackage | null = null;
try {
  // expo-glass-effect is a dev-build native module. Resolve it lazily so stale
  // simulator builds without the native framework still load the JS bundle.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  glassEffect = require("expo-glass-effect") as GlassEffectPackage;
} catch {
  glassEffect = null;
}

function canUseGlassEffect() {
  if (Platform.OS !== "ios" || !glassEffect?.GlassView) {
    return false;
  }

  try {
    const apiAvailable = glassEffect.isGlassEffectAPIAvailable?.() ?? true;
    const liquidGlassAvailable = glassEffect.isLiquidGlassAvailable?.() ?? true;
    return apiAvailable && liquidGlassAvailable;
  } catch {
    return false;
  }
}

export function AdaptiveGlassView({
  className,
  colorScheme: _colorScheme,
  glassEffectStyle: _glassEffectStyle,
  isInteractive: _isInteractive,
  ...viewProps
}: AdaptiveGlassViewProps) {
  if (canUseGlassEffect() && glassEffect?.GlassView) {
    const GlassView = glassEffect.GlassView;
    return (
      <GlassView
        colorScheme={_colorScheme}
        glassEffectStyle={_glassEffectStyle}
        isInteractive={_isInteractive}
        className={className}
        {...viewProps}
      />
    );
  }

  if (Platform.OS !== "ios") {
    return (
      <View
        className={["border border-border bg-surface", className].filter(Boolean).join(" ")}
        {...viewProps}
        style={[
          {
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { height: 8, width: 0 },
            shadowOpacity: 0.14,
            shadowRadius: 18,
          },
          viewProps.style,
        ]}
      />
    );
  }

  return <View className={className} {...viewProps} />;
}
