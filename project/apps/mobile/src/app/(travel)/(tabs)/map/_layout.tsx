import { Stack } from "expo-router";
import { useAirbnbHeaderOptions } from "@/ui/components/header-options";

export default function MapLayout() {
  const headerOptions = useAirbnbHeaderOptions();
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: "Map" }} />
      <Stack.Screen name="stay" />
      <Stack.Screen name="event" />
    </Stack>
  );
}
