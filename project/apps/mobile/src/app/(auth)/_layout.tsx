import { Stack } from "expo-router";
import { useAirbnbHeaderOptions } from "@/ui/components/header-options";

export default function AuthLayout() {
  const headerOptions = useAirbnbHeaderOptions();
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="login" options={{ title: "" }} />
      <Stack.Screen name="signup" options={{ title: "" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Reset password" }} />
      <Stack.Screen name="otp" options={{ title: "Verify" }} />
    </Stack>
  );
}
