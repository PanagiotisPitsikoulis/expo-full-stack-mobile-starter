import { Button } from "@pitsi-ui/native/button";
import { Text } from "@pitsi-ui/native/text";
import { type ReactNode, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StepIndicator } from "./step-indicator";

export type OnboardingStep = {
  canContinue?: boolean;
  description?: ReactNode;
  footer?: () => ReactNode;
  key: string;
  onBeforeNext?: () => boolean | Promise<boolean>;
  render: () => ReactNode;
  title: ReactNode;
};

export type OnboardingGroup = {
  enterLabel?: string;
  finalLabel?: string;
  key: string;
  skippable: boolean;
  skipLabel?: string;
  steps: OnboardingStep[];
  title: string;
};

type ActiveOnboardingStep = OnboardingStep & {
  group: OnboardingGroup;
  groupIndex: number;
  stepIndex: number;
};

/**
 * Generic multi-step onboarding / wizard shell. Groups carry their own
 * "enter / skip / finish" labels and skip behavior; steps own their
 * render + a `canContinue` gate. The shell handles back / next / skip
 * navigation, the step indicator, and keyboard-avoiding layout.
 */
export function OnboardingFlow({
  groups,
  initialStep = 0,
  onBackToApp,
  onComplete,
  onStepChange,
}: {
  groups: OnboardingGroup[];
  initialStep?: number;
  onBackToApp?: () => void;
  onComplete?: () => void;
  onStepChange?: (step: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const steps = groups.flatMap((group, groupIndex) =>
    group.steps.map((step, stepIndex) => ({
      ...step,
      group,
      groupIndex,
      stepIndex,
    })),
  );
  const [step, setStep] = useState(initialStep);
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
    setStep(clamped);
    onStepChange?.(clamped);
  };

  const skipGroup = () => {
    if (!current?.group.skippable) return;
    const nextGroupIndex = steps.findIndex((item) => item.groupIndex > current.groupIndex);
    if (nextGroupIndex === -1) {
      onComplete?.();
      return;
    }
    goTo(nextGroupIndex);
  };

  const onPrimary = async () => {
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
    if (step === 0) {
      onBackToApp?.();
      return;
    }
    goTo(step - 1);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <View className="mx-auto flex-1 w-full max-w-4xl px-5 pt-4">
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
              <Text className="mx-auto mt-10 max-w-md text-center text-[30px] font-normal leading-[32px] tracking-tight text-foreground">
                {current.title}
              </Text>
            ) : null}
          </View>

          <ScrollView
            className="mt-5 min-h-0 flex-1"
            contentContainerClassName="px-2 py-2"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="mx-auto w-full max-w-3xl flex-1 justify-center">
              {current?.render()}
            </View>
          </ScrollView>

          {current?.description ? (
            <View className="shrink-0 mt-1 mx-auto w-full max-w-md px-4">
              <Text className="text-center text-[16px] leading-[28px] text-muted" numberOfLines={2}>
                {current.description}
              </Text>
            </View>
          ) : null}

          <View
            className="shrink-0 flex-row items-center justify-center gap-2 pt-8"
            style={{ paddingBottom: Math.max(insets.bottom, 12) }}
          >
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
      </KeyboardAvoidingView>
    </View>
  );
}
