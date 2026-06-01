import { Picker } from "@expo/ui/community/picker";
import { Text } from "@pitsi-ui/native/text";
import LottieView from "lottie-react-native";
import type { ReactNode } from "react";
import { Keyboard, Vibration, View } from "react-native";
import { lottieFlight } from "../../../assets/lottie";
import { ChipMultiSelect } from "../../components/chip-multi-select";
import { LiquidGlassInput } from "../../components/liquid-glass-input";
import { OptionListPicker } from "../../components/option-list-picker";
import { ReviewRows } from "../../components/review-rows";
import { clamp } from "./model";
import type { OnboardingPickerOption } from "./onboarding-options";

const LOTTIE_BY_KEY = {
  flight: lottieFlight,
} as const;

const SUBTLE_VIBRATION_MS = 1;

export type LottieKey = keyof typeof LOTTIE_BY_KEY;

export function LottieIntroStep({ kind, size = 320 }: { kind: LottieKey; size?: number }) {
  return (
    <View className="items-center justify-center py-2">
      <LottieView
        autoPlay
        loop
        source={LOTTIE_BY_KEY[kind]}
        style={{ width: size, height: size }}
      />
    </View>
  );
}

function StepInputFrame({ children }: { children: ReactNode }) {
  return <View className="mx-auto w-full max-w-md px-4">{children}</View>;
}

export function NumberStep({
  max,
  min,
  onChange,
  unit,
  value,
}: {
  max: number;
  min: number;
  onChange: (value: number) => void;
  unit: string;
  value: number;
}) {
  return (
    <StepInputFrame>
      <View className="relative w-full">
        <LiquidGlassInput
          keyboardType="numeric"
          onChangeText={(text) => {
            const parsed = Number.parseFloat(text);
            if (Number.isFinite(parsed)) {
              onChange(clamp(parsed, min, max));
            } else {
              onChange(min);
            }
          }}
          onSubmit={() => Keyboard.dismiss()}
          placeholder={String(min)}
          returnKeyType="done"
          value={String(value)}
        />
        <View
          className="absolute right-5 top-0 h-12 items-center justify-center"
          pointerEvents="none"
        >
          <Text className="text-[14px] text-muted">{unit}</Text>
        </View>
      </View>
    </StepInputFrame>
  );
}

export function TextStep({
  onChange,
  placeholder,
  value,
}: {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <StepInputFrame>
      <LiquidGlassInput
        autoCapitalize="words"
        onChangeText={onChange}
        placeholder={placeholder}
        value={value}
      />
    </StepInputFrame>
  );
}

export function PickerStep({
  onSelect,
  options,
  selected,
}: {
  onSelect: (id: string) => void;
  options: OnboardingPickerOption[];
  selected: string | null;
}) {
  return <OptionListPicker onSelect={onSelect} options={options} selected={selected} />;
}

export function NativePickerStep({
  onSelect,
  options,
  selected,
}: {
  onSelect: (id: string) => void;
  options: OnboardingPickerOption[];
  selected: string | null;
}) {
  return (
    <StepInputFrame>
      <Picker
        onValueChange={(value) => {
          if (typeof value === "string") {
            if (value !== selected) {
              Vibration.vibrate(SUBTLE_VIBRATION_MS);
            }
            onSelect(value);
          }
        }}
        selectedValue={selected ?? options[0]?.id ?? ""}
      >
        {options.map((option) => (
          <Picker.Item key={option.id} label={option.title} value={option.id} />
        ))}
      </Picker>
    </StepInputFrame>
  );
}

export function ChipMultiSelectStep({
  onToggle,
  options,
  selected,
}: {
  onToggle: (id: string) => void;
  options: OnboardingPickerOption[];
  selected: string[];
}) {
  return (
    <ChipMultiSelect
      onToggle={(id) => {
        Vibration.vibrate(SUBTLE_VIBRATION_MS);
        onToggle(id);
      }}
      options={options}
      selected={selected}
    />
  );
}

export function ReviewStep({ rows }: { rows: { label: string; value: string }[] }) {
  return <ReviewRows rows={rows} />;
}
