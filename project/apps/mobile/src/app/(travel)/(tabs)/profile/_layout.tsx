import { Stack } from "expo-router";
import { useAirbnbHeaderOptions } from "@/ui/components/header-options";

export default function ProfileLayout() {
  const headerOptions = useAirbnbHeaderOptions();
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen name="trips" options={{ title: "Reservations" }} />
      <Stack.Screen name="wishlists" options={{ title: "Wishlists" }} />
      <Stack.Screen name="settings/index" options={{ title: "Settings" }} />
      <Stack.Screen name="settings/kitchen-sink" options={{ title: "Kitchen sink" }} />
      <Stack.Screen name="settings/[category]" options={{ title: "Settings" }} />
    </Stack>
  );
}
