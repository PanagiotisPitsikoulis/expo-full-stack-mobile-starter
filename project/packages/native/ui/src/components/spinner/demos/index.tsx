import { View } from "react-native";

import { Spinner, Text } from "../..";

function LabeledSpinner({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <View className="items-center gap-2">
      {children}
      <Text className="text-xs text-muted">{label}</Text>
    </View>
  );
}

export function Basic() {
  return (
    <View className="flex-row items-center gap-4">
      <Spinner />
    </View>
  );
}

export function Colors() {
  return (
    <View className="flex-row flex-wrap items-center gap-8">
      <LabeledSpinner label="Current">
        <Spinner color="#111827" />
      </LabeledSpinner>
      <LabeledSpinner label="Accent">
        <Spinner color="#0a84ff" />
      </LabeledSpinner>
      <LabeledSpinner label="Success">
        <Spinner color="success" />
      </LabeledSpinner>
      <LabeledSpinner label="Warning">
        <Spinner color="warning" />
      </LabeledSpinner>
      <LabeledSpinner label="Danger">
        <Spinner color="danger" />
      </LabeledSpinner>
    </View>
  );
}

export function Sizes() {
  return (
    <View className="flex-row flex-wrap items-center gap-8">
      <LabeledSpinner label="Small">
        <Spinner size="sm" />
      </LabeledSpinner>
      <LabeledSpinner label="Medium">
        <Spinner size="md" />
      </LabeledSpinner>
      <LabeledSpinner label="Large">
        <Spinner size="lg" />
      </LabeledSpinner>
      <LabeledSpinner label="Extra Large">
        <Spinner className="size-10" size="lg" />
      </LabeledSpinner>
    </View>
  );
}
