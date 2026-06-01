import type { BottomSheetProps } from "@expo/ui";
import { Column, Host, ModalBottomSheet, type ModalBottomSheetRef } from "@expo/ui/jetpack-compose";
import {
  fillMaxHeight,
  type ModifierConfig,
  padding,
  testID as testIDModifier,
} from "@expo/ui/jetpack-compose/modifiers";
import { useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import { getAirbnbAccent } from "@/ui/theme/airbnb-colors";

type SnapPoint = NonNullable<BottomSheetProps["snapPoints"]>[number];

function shouldSkipPartiallyExpanded(snapPoints: BottomSheetProps["snapPoints"]): boolean {
  if (!snapPoints || snapPoints.length === 0) return false;
  return !snapPoints.some(
    (snapPoint: SnapPoint) =>
      snapPoint === "half" ||
      (typeof snapPoint === "object" && "fraction" in snapPoint && snapPoint.fraction < 1) ||
      (typeof snapPoint === "object" && "height" in snapPoint),
  );
}

function shouldFillMaxHeight(snapPoints: BottomSheetProps["snapPoints"]): boolean {
  if (!snapPoints || snapPoints.length === 0) return false;
  return snapPoints.some(
    (snapPoint: SnapPoint) =>
      snapPoint === "full" ||
      (typeof snapPoint === "object" && "fraction" in snapPoint && snapPoint.fraction >= 1),
  );
}

export function BrandedNativeBottomSheet({
  children,
  isPresented,
  modifiers,
  onDismiss,
  showDragIndicator = true,
  snapPoints,
  testID,
}: BottomSheetProps) {
  useColorScheme();
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const [mount, setMount] = useState(isPresented);

  useEffect(() => {
    if (isPresented) {
      setMount(true);
      return;
    }

    let cancelled = false;
    sheetRef.current?.hide().then(() => {
      if (!cancelled) setMount(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isPresented]);

  if (!mount) {
    return null;
  }

  const contentModifiers: ModifierConfig[] = [padding(16, showDragIndicator ? 0 : 16, 16, 0)];
  if (shouldFillMaxHeight(snapPoints)) contentModifiers.push(fillMaxHeight());
  if (testID) contentModifiers.push(testIDModifier(testID));

  return (
    <Host pointerEvents="none" seedColor={getAirbnbAccent()} style={{ position: "absolute" }}>
      <ModalBottomSheet
        ref={sheetRef}
        modifiers={modifiers}
        onDismissRequest={onDismiss}
        showDragHandle={showDragIndicator}
        skipPartiallyExpanded={shouldSkipPartiallyExpanded(snapPoints)}
      >
        <Column modifiers={contentModifiers}>{children}</Column>
      </ModalBottomSheet>
    </Host>
  );
}
