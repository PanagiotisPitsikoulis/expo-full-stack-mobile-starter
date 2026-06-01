import { View } from "react-native";

import { Button, Text, Toast, ToastProvider, useToast } from "../..";

function ToastActions() {
  const { toast, isToastVisible } = useToast();

  return (
    <View className="gap-3">
      <Button
        onPress={() =>
          toast.show({
            label: "Saved",
            description: "Your changes are now synced.",
            variant: "success",
            duration: "persistent",
          })
        }
      >
        Show toast
      </Button>
      <Button variant="secondary" onPress={() => toast.hide("all")}>
        Hide all
      </Button>
      <Text className="text-sm text-muted">
        {isToastVisible ? "A toast is visible" : "No toast visible"}
      </Text>
    </View>
  );
}

export function Basic() {
  return (
    <ToastProvider>
      <ToastActions />
    </ToastProvider>
  );
}

export function StaticToast() {
  return (
    <Toast
      id="static-toast"
      index={0}
      total={{ get: () => 1, set: () => {}, modify: () => {} } as any}
      heights={{ get: () => ({}), set: () => {}, modify: () => {} } as any}
      hide={() => {}}
      show={() => "static-toast"}
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <Toast.Title>Invite sent</Toast.Title>
          <Toast.Description>Workspace members will receive an email.</Toast.Description>
        </View>
        <Toast.Close />
      </View>
    </Toast>
  );
}

export function Variants() {
  return (
    <View className="w-full max-w-[360px] gap-3">
      {(["default", "accent", "success", "warning", "danger"] as const).map((variant) => (
        <Toast
          id={`toast-${variant}`}
          index={0}
          key={variant}
          total={{ get: () => 1, set: () => {}, modify: () => {} } as any}
          heights={{ get: () => ({}), set: () => {}, modify: () => {} } as any}
          hide={() => {}}
          show={() => `toast-${variant}`}
          variant={variant}
        >
          <Toast.Title>{variant}</Toast.Title>
          <Toast.Description>Toast message preview.</Toast.Description>
        </Toast>
      ))}
    </View>
  );
}
