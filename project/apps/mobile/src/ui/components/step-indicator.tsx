import { View } from "react-native";
import Animated, { Easing, FadeIn, LinearTransition } from "react-native-reanimated";

const DOT_LAYOUT = LinearTransition.duration(220).easing(Easing.out(Easing.cubic));
const DOT_ENTERING = FadeIn.duration(140).easing(Easing.out(Easing.cubic));

export type StepIndicatorGroup = {
  key: string;
  title: string;
  total: number;
};

export function StepIndicator({
  currentGroup,
  currentStep,
  groups,
}: {
  currentGroup: number;
  currentStep: number;
  groups: StepIndicatorGroup[];
}) {
  const visibleGroups = groups.filter((group) => group.total > 0);
  if (visibleGroups.length === 0) return null;

  const activeGroup = visibleGroups[currentGroup];

  if (!activeGroup) return null;

  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-accent-soft px-2 py-1.5">
      {Array.from({ length: activeGroup.total }, (_, stepIndex) => {
        const active = stepIndex === currentStep;
        const completed = stepIndex < currentStep;
        const className = active
          ? "h-2 rounded-full bg-primary"
          : completed
            ? "h-2 rounded-full bg-primary/60"
            : "h-2 rounded-full bg-primary/25";
        return (
          <Animated.View
            className={className}
            entering={DOT_ENTERING}
            key={`${activeGroup.key}-${stepIndex}`}
            layout={DOT_LAYOUT}
            style={{
              width: active ? 30 : completed ? 10 : 8,
            }}
          />
        );
      })}
    </View>
  );
}
