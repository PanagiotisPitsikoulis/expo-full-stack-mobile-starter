import type { ReactNode } from "react";
import { View } from "react-native";

/**
 * Top-level screen body. iOS uses the transparent blurred Stack header, so
 * scrollable children set `contentInsetAdjustmentBehavior="automatic"` there.
 * Android keeps the native default header bar.
 */
export function Screen({
  children,
  className = "flex-1 bg-background",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <View className={className}>{children}</View>;
}
