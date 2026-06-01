import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { type ReactNode, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  Vibration,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Keyframe,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StepIndicator } from "../../components/step-indicator";

export type AirbnbOnboardingStep = {
  canContinue?: boolean;
  description?: ReactNode;
  footer?: () => ReactNode;
  key: string;
  onBeforeNext?: () => boolean | Promise<boolean>;
  render: () => ReactNode;
  title: ReactNode;
};

export type AirbnbOnboardingGroup = {
  enterLabel?: string;
  finalLabel?: string;
  key: string;
  skippable: boolean;
  skipLabel?: string;
  steps: AirbnbOnboardingStep[];
  title: string;
};

type ActiveOnboardingStep = AirbnbOnboardingStep & {
  group: AirbnbOnboardingGroup;
  groupIndex: number;
  stepIndex: number;
};

const FOOTER_BAR_HEIGHT = 96;
const SUBTLE_VIBRATION_MS = 1;
const STEP_LAYOUT = LinearTransition.duration(220).easing(Easing.out(Easing.cubic));
const PANEL_EASING = Easing.bezier(0.22, 1, 0.36, 1);

function pageEntering(direction: number, distance: number) {
  return new Keyframe({
    0: {
      opacity: 0,
      transform: [{ translateX: direction >= 0 ? distance : -distance }, { scale: 0.96 }],
    },
    100: {
      opacity: 1,
      transform: [{ translateX: 0 }, { scale: 1 }],
      easing: PANEL_EASING,
    },
  }).duration(360);
}

function pageExiting(direction: number, distance: number) {
  return new Keyframe({
    0: {
      opacity: 1,
      transform: [{ translateX: 0 }, { scale: 1 }],
    },
    100: {
      opacity: 0,
      transform: [{ translateX: direction >= 0 ? -distance : distance }, { scale: 0.96 }],
      easing: Easing.in(Easing.cubic),
    },
  }).duration(170);
}

export function AirbnbOnboardingFlow({
  groups,
  initialStep = 0,
  onBackToApp,
  onComplete,
  onStepChange,
}: {
  groups: AirbnbOnboardingGroup[];
  initialStep?: number;
  onBackToApp?: () => void;
  onComplete?: () => void;
  onStepChange?: (step: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const dragX = useSharedValue(0);
  const steps = groups.flatMap((group, groupIndex) =>
    group.steps.map((step, stepIndex) => ({
      ...step,
      group,
      groupIndex,
      stepIndex,
    })),
  );
  const [step, setStep] = useState(initialStep);
  const [stepDirection, setStepDirection] = useState(1);
  const current = steps[step] as ActiveOnboardingStep | undefined;
  const next = steps[step + 1];
  const isLast = step === steps.length - 1;
  const isGroupEnd = !next || next.groupIndex !== current?.groupIndex;
  const indicatorGroups = groups.map((group) => ({
    key: group.key,
    title: group.title,
    total: group.steps.length,
  }));
  const primaryLabel = isLast
    ? (current?.group.finalLabel ?? "Finish")
    : isGroupEnd && next
      ? (next.group.enterLabel ?? `Continue to ${next.group.title}`)
      : "Continue";

  const goTo = (target: number) => {
    const clamped = Math.max(0, Math.min(target, steps.length - 1));
    if (clamped !== step) {
      Vibration.vibrate(SUBTLE_VIBRATION_MS);
      setStepDirection(clamped > step ? 1 : -1);
    }
    setStep(clamped);
    onStepChange?.(clamped);
  };

  const skipGroup = () => {
    Keyboard.dismiss();
    if (!current?.group.skippable) return;
    const nextGroupIndex = steps.findIndex((item) => item.groupIndex > current.groupIndex);
    if (nextGroupIndex === -1) {
      onComplete?.();
      return;
    }
    goTo(nextGroupIndex);
  };

  const onPrimary = async () => {
    Keyboard.dismiss();
    if (current?.canContinue === false) return;
    if (current?.onBeforeNext) {
      const ok = await current.onBeforeNext();
      if (!ok) return;
    }
    if (isLast) {
      onComplete?.();
      return;
    }
    goTo(step + 1);
  };

  const onBack = () => {
    Keyboard.dismiss();
    if (step === 0) {
      onBackToApp?.();
      return;
    }
    goTo(step - 1);
  };

  const onSwipeNext = () => {
    if (isLast || current?.canContinue === false) return;
    void onPrimary();
  };

  const onSwipeBack = () => {
    if (step === 0) return;
    onBack();
  };

  const footerBottomPadding = Math.max(insets.bottom, 12) + FOOTER_BAR_HEIGHT;
  const pageDistance = Math.max(width, 320);
  const stepPageEntering = pageEntering(stepDirection, pageDistance);
  const stepPageExiting = pageExiting(stepDirection, pageDistance);
  const pageDragStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(dragX.value) / pageDistance, 1);
    return {
      opacity: 1 - progress * 0.08,
      transform: [{ translateX: dragX.value }, { scale: 1 - progress * 0.025 }],
    };
  });
  const pagePan = Gesture.Pan()
    .activeOffsetX([-18, 18])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      dragX.value = Math.max(
        -pageDistance * 0.32,
        Math.min(pageDistance * 0.32, event.translationX),
      );
    })
    .onEnd((event) => {
      const shouldAdvance = event.translationX < -70 || event.velocityX < -650;
      const shouldGoBack = event.translationX > 70 || event.velocityX > 650;
      dragX.value = withSpring(0, { damping: 22, stiffness: 260 });
      if (shouldAdvance) {
        runOnJS(onSwipeNext)();
      } else if (shouldGoBack) {
        runOnJS(onSwipeBack)();
      }
    });

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <GestureDetector gesture={pagePan}>
          <Animated.View
            className="mx-auto w-full max-w-4xl flex-1 px-5 pt-4"
            entering={stepPageEntering}
            exiting={stepPageExiting}
            key={current?.key ?? "empty"}
            style={pageDragStyle}
          >
            <View className="shrink-0">
              <View className="min-h-11 flex-row items-center justify-center">
                {steps.length > 1 && current ? (
                  <StepIndicator
                    currentGroup={current.groupIndex}
                    currentStep={current.stepIndex}
                    groups={indicatorGroups}
                  />
                ) : null}
              </View>
              {current?.title ? (
                <Text className="mx-auto mt-10 max-w-md text-center text-[30px] font-normal leading-[34px] tracking-tight text-foreground">
                  {current.title}
                </Text>
              ) : null}
              {current?.description ? (
                <Text className="mx-auto mt-3 max-w-md px-4 text-center text-[15px] leading-[22px] text-muted">
                  {current.description}
                </Text>
              ) : null}
            </View>

            <ScrollView
              className="mt-5 min-h-0 flex-1"
              contentContainerStyle={{ paddingBottom: footerBottomPadding, paddingHorizontal: 8 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                className="mx-auto w-full max-w-3xl flex-1 justify-center"
                layout={STEP_LAYOUT}
              >
                {current?.render()}
              </Animated.View>
            </ScrollView>
          </Animated.View>
        </GestureDetector>

        <View
          pointerEvents="box-none"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
        >
          <View
            className="bg-background"
            pointerEvents="box-none"
            style={{ paddingTop: 64, paddingBottom: Math.max(insets.bottom, 12) }}
          >
            <View className="flex-row items-center justify-center gap-2 px-5">
              {isLast && current?.footer ? (
                current.footer()
              ) : (
                <>
                  <Button isDisabled={step === 0} onPress={onBack} size="md" variant="tertiary">
                    <Button.Label>Back</Button.Label>
                  </Button>
                  {current?.group.skippable ? (
                    <Button onPress={skipGroup} size="md" variant="tertiary">
                      <Button.Label>
                        {current.group.skipLabel ?? `Skip ${current.group.title}`}
                      </Button.Label>
                    </Button>
                  ) : null}
                  <Button
                    isDisabled={current?.canContinue === false}
                    onPress={onPrimary}
                    size="md"
                    variant="primary"
                  >
                    <Button.Label>{primaryLabel}</Button.Label>
                  </Button>
                </>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
