import { StyleSheet } from "react-native";
import { tv } from "tailwind-variants";
import { useAnimationSettings } from "../../helpers/internal/contexts";
import type { AnimationDisabled } from "../../helpers/internal/types";
import {
  combineStyles,
  getAnimationState,
  getIsAnimationDisabledValue,
} from "../../helpers/internal/utils";

const overlay = tv({
  base: "absolute inset-0 bg-backdrop",
});

const contentContainer = tv({
  base: "flex-1 p-5 pb-safe-offset-3 bg-transparent",
});

const contentBackground = tv({
  base: "bg-overlay rounded-t-4xl shadow-overlay",
});

const contentHandleIndicator = tv({
  base: "bg-separator",
});

const close = tv({
  base: "",
});

const label = tv({
  base: "text-lg font-medium text-foreground",
});

const description = tv({
  base: "text-base text-muted",
});

export const bottomSheetClassNames = combineStyles({
  overlay,
  contentContainer,
  contentBackground,
  contentHandleIndicator,
  close,
  label,
  description,
});

export const bottomSheetStyleSheet = StyleSheet.create({
  contentContainer: {
    borderCurve: "continuous",
  },
});

/**
 * Animation hook for BottomSheet Content component.
 * Kept outside the compound component module so reusable internal content can
 * consume it without importing the public BottomSheet component back into
 * itself.
 */
export function useBottomSheetContentAnimation(options: {
  /** Animation configuration for bottom sheet content */
  animation: AnimationDisabled | undefined;
}) {
  const { animation } = options;

  const { isAllAnimationsDisabled } = useAnimationSettings();

  const { isAnimationDisabled } = getAnimationState(animation);

  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled,
  });

  return {
    isAnimationDisabledValue,
  };
}
