import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

/**
 * Speech-bubble shell for chat surfaces. User messages are right-aligned
 * with the `primary` brand color; agent / assistant messages are left-aligned
 * on a `surface` background. Optionally render an arbitrary payload
 * (chart, card, image...) *inside* the bubble via children.
 *
 * Pass `fullBleed` extras as a sibling on the outside — see how
 * `chat-message-bubble.tsx` paints map / full-grid payloads at screen
 * width while keeping the text in a contained bubble.
 */
export function ChatBubble({
  children,
  role,
  text,
}: {
  children?: ReactNode;
  role: "ai" | "user";
  text?: string;
}) {
  const isUser = role === "user";
  const [primary, primaryForeground, surface, surfaceForeground] = useCSSVariable([
    "--primary",
    "--primary-foreground",
    "--surface",
    "--surface-foreground",
  ]) as [string, string, string, string];

  if (!text && !children) return null;

  return (
    <View
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? primary : surface,
        borderBottomLeftRadius: isUser ? 18 : 6,
        borderBottomRightRadius: isUser ? 6 : 18,
        borderCurve: "continuous",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        maxWidth: "92%",
        paddingHorizontal: 16,
        paddingVertical: 10,
      }}
    >
      {text ? (
        <Text
          style={{
            color: isUser ? primaryForeground : surfaceForeground,
            fontSize: 15,
            lineHeight: 21,
          }}
        >
          {text}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
