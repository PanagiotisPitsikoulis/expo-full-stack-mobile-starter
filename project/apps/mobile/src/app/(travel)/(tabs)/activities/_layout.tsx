import { Stack } from "expo-router";
import { useAirbnbHeaderOptions } from "@/ui/components/header-options";

export default function ActivitiesLayout() {
  const headerOptions = useAirbnbHeaderOptions();
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: "Activities" }} />
      <Stack.Screen name="search" options={{ title: "Search activities" }} />
      <Stack.Screen name="event" />
      <Stack.Screen name="section" />
    </Stack>
  );
}
