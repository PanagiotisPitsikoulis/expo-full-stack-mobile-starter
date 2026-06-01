/**
 * Text input backed by `@expo/ui`'s universal `TextInput`. Visual styling is
 * applied through SwiftUI view modifiers (padding, background +
 * roundedRectangle, frame, foregroundStyle, font) so the field renders as a
 * real native input rather than a styled rectangle. On iOS 26+ the
 * `glassEffect` modifier layers liquid glass on top; older iOS / Android fall
 * back to the plain modifier chain.
 *
 * Controlled-from-React: pass `value` + `onChangeText`. We mirror the
 * React-owned string into a `useNativeState` cell so the native side doesn't
 * have to round-trip through React on every keystroke, and so imperative
 * resets ("Clear search") still update the on-screen text.
 */

import { Host, TextInput, useNativeState } from "@expo/ui";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useCSSVariable, useUniwind } from "uniwind";

type SwiftUiModifiersModule = typeof import("@expo/ui/swift-ui/modifiers");

let swiftModifiers: SwiftUiModifiersModule | undefined;
if (Platform.OS === "ios") {
  swiftModifiers = require("@expo/ui/swift-ui/modifiers") as SwiftUiModifiersModule;
}

export type LiquidGlassInputProps = {
  /** Controlled value. */
  value?: string;
  /** Fires on every keystroke. */
  onChangeText?: (text: string) => void;
  /** Fires when the user taps the keyboard return key. */
  onSubmit?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "url";
  returnKeyType?: "done" | "go" | "search" | "send" | "next" | "default";
  secureTextEntry?: boolean;
  /** Glass appearance variant — defaults to `regular`. */
  variant?: "regular" | "clear";
  /** Glass shape — defaults to `capsule`. */
  shape?: "capsule" | "roundedRectangle" | "rectangle";
};

export function LiquidGlassInput({
  value = "",
  onChangeText,
  onSubmit,
  onBlur,
  onFocus,
  placeholder,
  autoFocus,
  autoCapitalize = "none",
  autoCorrect = false,
  keyboardType = "default",
  returnKeyType,
  secureTextEntry,
  variant = "regular",
  shape = "capsule",
}: LiquidGlassInputProps) {
  const text = useNativeState(value);
  const lastSeenRef = useRef(value);
  const { theme } = useUniwind();
  const [fg, mutedFg, surface] = useCSSVariable([
    "--foreground",
    "--muted-foreground",
    "--surface",
  ]) as [string, string, string];

  useEffect(() => {
    if (value !== lastSeenRef.current) {
      text.value = value;
      lastSeenRef.current = value;
    }
  }, [value, text]);

  const modifiers = swiftModifiers
    ? [
        swiftModifiers.padding({ horizontal: 18, vertical: 12 }),
        swiftModifiers.background(
          surface,
          swiftModifiers.shapes.roundedRectangle({
            cornerRadius: 22,
            roundedCornerStyle: "continuous",
          }),
        ),
        swiftModifiers.frame({ height: 48 }),
        swiftModifiers.foregroundStyle(fg),
        swiftModifiers.font({ size: 16 }),
        ...(swiftModifiers.glassEffect
          ? [
              swiftModifiers.environment("colorScheme", theme),
              swiftModifiers.glassEffect({
                glass: { variant, interactive: true, tint: surface },
                shape,
              }),
            ]
          : []),
      ]
    : undefined;

  return (
    <Host colorScheme={theme} matchContents={{ vertical: true }} style={{ width: "100%" }}>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        modifiers={modifiers}
        onChangeText={(next) => {
          lastSeenRef.current = next;
          onChangeText?.(next);
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={mutedFg}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        value={text}
      />
    </Host>
  );
}
