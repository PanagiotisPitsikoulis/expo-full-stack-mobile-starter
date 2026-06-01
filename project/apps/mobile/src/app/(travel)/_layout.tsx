import { Stack } from "expo-router";
import { useAirbnbHeaderOptions } from "@/ui/components/header-options";
import { TravelShell } from "../../features/travel-shell";

export default function TravelLayout() {
  const headerOptions = useAirbnbHeaderOptions();
  return (
    <TravelShell>
      <Stack screenOptions={headerOptions}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="theatres" options={{ headerShown: false }} />
      </Stack>
    </TravelShell>
  );
}
