import { Color } from "expo-router";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

function c(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function androidMaterialYouVariables() {
  const dynamic = Color.android.dynamic;
  const primary = c(dynamic.primary, "#6750A4");
  const onPrimary = c(dynamic.onPrimary, "#FFFFFF");
  const primaryContainer = c(dynamic.primaryContainer, "#EADDFF");
  const onPrimaryContainer = c(dynamic.onPrimaryContainer, "#21005D");
  const secondary = c(dynamic.secondary, "#625B71");
  const onSecondary = c(dynamic.onSecondary, "#FFFFFF");
  const secondaryContainer = c(dynamic.secondaryContainer, "#E8DEF8");
  const onSecondaryContainer = c(dynamic.onSecondaryContainer, "#1D192B");
  const tertiary = c(dynamic.tertiary, "#7D5260");
  const onTertiary = c(dynamic.onTertiary, "#FFFFFF");
  const tertiaryContainer = c(dynamic.tertiaryContainer, "#FFD8E4");
  const onTertiaryContainer = c(dynamic.onTertiaryContainer, "#31111D");
  const error = c(dynamic.error, "#B3261E");
  const onError = c(dynamic.onError, "#FFFFFF");
  const errorContainer = c(dynamic.errorContainer, "#F9DEDC");
  const onErrorContainer = c(dynamic.onErrorContainer, "#410E0B");
  const surface = c(dynamic.surface, "#FFFBFE");
  const onSurface = c(dynamic.onSurface, "#1C1B1F");
  const onSurfaceVariant = c(dynamic.onSurfaceVariant, "#49454F");
  const surfaceVariant = c(dynamic.surfaceVariant, "#E7E0EC");
  const surfaceContainer = c(dynamic.surfaceContainer, "#F3EDF7");
  const surfaceContainerLow = c(dynamic.surfaceContainerLow, "#F7F2FA");
  const surfaceContainerHigh = c(dynamic.surfaceContainerHigh, "#ECE6F0");
  const surfaceContainerHighest = c(dynamic.surfaceContainerHighest, "#E6E0E9");
  const outline = c(dynamic.outline, "#79747E");
  const outlineVariant = c(dynamic.outlineVariant, "#CAC4D0");

  return {
    "--accent": primary,
    "--accent-foreground": onPrimary,
    "--accent-hover": primary,
    "--accent-soft": primaryContainer,
    "--accent-soft-foreground": onPrimaryContainer,
    "--accent-soft-hover": primaryContainer,
    "--background": surface,
    "--background-inverse": onSurface,
    "--background-secondary": surfaceContainerLow,
    "--background-tertiary": surfaceContainer,
    "--border": outlineVariant,
    "--border-secondary": outline,
    "--border-tertiary": outline,
    "--card": surfaceContainerLow,
    "--card-foreground": onSurface,
    "--danger": error,
    "--danger-foreground": onError,
    "--danger-hover": error,
    "--danger-soft": errorContainer,
    "--danger-soft-foreground": onErrorContainer,
    "--danger-soft-hover": errorContainer,
    "--default": surfaceContainerHigh,
    "--default-foreground": onSurface,
    "--default-hover": surfaceContainerHighest,
    "--field-background": surfaceContainerLow,
    "--field-border": outlineVariant,
    "--field-border-focus": primary,
    "--field-border-hover": outline,
    "--field-focus": surfaceContainer,
    "--field-foreground": onSurface,
    "--field-hover": surfaceContainer,
    "--field-placeholder": onSurfaceVariant,
    "--focus": primary,
    "--foreground": onSurface,
    "--link": primary,
    "--muted": onSurfaceVariant,
    "--muted-foreground": onSurfaceVariant,
    "--on-surface": surfaceContainerHigh,
    "--on-surface-focus": surfaceContainerHighest,
    "--on-surface-foreground": onSurface,
    "--on-surface-hover": surfaceContainerHighest,
    "--on-surface-secondary": surfaceContainer,
    "--on-surface-secondary-focus": surfaceContainerHighest,
    "--on-surface-secondary-foreground": onSurface,
    "--on-surface-secondary-hover": surfaceContainerHigh,
    "--on-surface-tertiary": surfaceVariant,
    "--on-surface-tertiary-focus": outlineVariant,
    "--on-surface-tertiary-foreground": onSurface,
    "--on-surface-tertiary-hover": surfaceContainerHighest,
    "--overlay": surfaceContainerHigh,
    "--overlay-foreground": onSurface,
    "--primary": primary,
    "--primary-foreground": onPrimary,
    "--ring": primary,
    "--scrollbar": outlineVariant,
    "--segment": surfaceContainerHighest,
    "--segment-foreground": onSurface,
    "--separator": outlineVariant,
    "--separator-secondary": outlineVariant,
    "--separator-tertiary": outline,
    "--success": tertiary,
    "--success-foreground": onTertiary,
    "--success-hover": tertiary,
    "--success-soft": tertiaryContainer,
    "--success-soft-foreground": onTertiaryContainer,
    "--success-soft-hover": tertiaryContainer,
    "--surface": surfaceContainerLow,
    "--surface-foreground": onSurface,
    "--surface-hover": surfaceContainer,
    "--surface-secondary": surfaceContainer,
    "--surface-secondary-foreground": onSurface,
    "--surface-tertiary": surfaceContainerHigh,
    "--surface-tertiary-foreground": onSurface,
    "--warning": secondary,
    "--warning-foreground": onSecondary,
    "--warning-hover": secondary,
    "--warning-soft": secondaryContainer,
    "--warning-soft-foreground": onSecondaryContainer,
    "--warning-soft-hover": secondaryContainer,
  };
}

export function AndroidMaterialYouTheme() {
  const systemScheme = useColorScheme();
  const { theme } = useUniwind();

  useEffect(() => {
    if (Platform.OS !== "android") return;
    void systemScheme;
    Uniwind.updateCSSVariables(theme, androidMaterialYouVariables());
  }, [systemScheme, theme]);

  return null;
}
