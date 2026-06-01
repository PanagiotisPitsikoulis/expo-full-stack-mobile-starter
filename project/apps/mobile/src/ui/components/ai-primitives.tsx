import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, type TextStyle, View, type ViewStyle } from "react-native";
import { useCSSVariable } from "uniwind";

export function useAiTheme() {
  const [
    surface,
    surfaceSecondary,
    surfaceForeground,
    muted,
    border,
    accent,
    accentForeground,
    accentSoft,
    backdrop,
    overlay,
  ] = useCSSVariable([
    "--surface",
    "--surface-secondary",
    "--surface-foreground",
    "--muted",
    "--border",
    "--accent",
    "--accent-foreground",
    "--accent-soft",
    "--backdrop",
    "--overlay",
  ]) as string[];

  return {
    accent,
    accentForeground,
    accentSoft: accentSoft || surfaceSecondary,
    backdrop,
    cardBg: surface,
    cardBorder: border,
    chipBg: surfaceSecondary,
    overlay,
    textMuted: muted,
    textPrimary: surfaceForeground,
  };
}

/** Text styled for AI chat surfaces. Pass `muted` for secondary tone. */
export function AiSmartText({
  children,
  muted,
  numberOfLines,
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  numberOfLines?: number;
  style?: TextStyle | TextStyle[];
}) {
  const theme = useAiTheme();
  const flat = Array.isArray(style) ? Object.assign({}, ...style) : style;
  const color =
    (flat && (flat as TextStyle).color) ?? (muted ? theme.textMuted : theme.textPrimary);
  return (
    <Text numberOfLines={numberOfLines} style={[{ color }, style]}>
      {children}
    </Text>
  );
}

/** Pill chip used for tags / categories / mini badges. */
export function AiSmartBadge({ children, tone }: { children: ReactNode; tone?: "accent" }) {
  const theme = useAiTheme();
  const bg = tone === "accent" ? theme.accentSoft : theme.chipBg;
  const color = tone === "accent" ? theme.accent : theme.textPrimary;
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Text style={{ color, fontSize: 11, fontWeight: "600", letterSpacing: 0.2 }}>{children}</Text>
    </View>
  );
}

/**
 * Premium card shell used for trip-map / budget / itinerary payloads. All three
 * share the same chrome (header with leading icon + title, body, optional CTA)
 * so the chat surface reads as one widget archetype instead of three.
 */
export function PlanCard({
  children,
  cta,
  rightSlot,
  title,
}: {
  children: ReactNode;
  cta?: { label: string; onPress: () => void };
  /** Kept for back-compat; no longer rendered. */
  icon?: ComponentProps<typeof Ionicons>["name"];
  rightSlot?: ReactNode;
  title: string;
}) {
  const theme = useAiTheme();
  return (
    <View
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
        borderCurve: "continuous",
        borderRadius: 22,
        borderWidth: 1,
        gap: 16,
        padding: 18,
      }}
    >
      <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
        <AiSmartText
          numberOfLines={1}
          style={{ flex: 1, fontSize: 17, fontWeight: "700", letterSpacing: -0.2 }}
        >
          {title}
        </AiSmartText>
        {rightSlot}
      </View>
      {children}
      {cta ? (
        <Pressable
          accessibilityRole="button"
          onPress={cta.onPress}
          style={{
            alignItems: "center",
            backgroundColor: theme.accentSoft,
            borderCurve: "continuous",
            borderRadius: 14,
            flexDirection: "row",
            gap: 6,
            justifyContent: "center",
            paddingVertical: 12,
          }}
        >
          <AiSmartText style={{ color: theme.accent, fontSize: 14, fontWeight: "700" }}>
            {cta.label}
          </AiSmartText>
          <Ionicons color={theme.accent} name="arrow-forward" size={14} />
        </Pressable>
      ) : null}
    </View>
  );
}

/**
 * @deprecated Use {@link PlanCard} for premium payloads. Kept only for any
 * remaining callers; will be removed once they migrate.
 */
export function AiSmartCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  const theme = useAiTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
          borderCurve: "continuous",
          borderRadius: 22,
          borderWidth: 1,
          gap: 16,
          padding: 18,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
