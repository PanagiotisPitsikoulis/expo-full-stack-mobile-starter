import { Stack } from "expo-router";
import { useAirbnbHeaderOptions } from "@/ui/components/header-options";

export default function HomeLayout() {
  const headerOptions = useAirbnbHeaderOptions();
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: "Explore" }} />
      <Stack.Screen name="search" options={{ title: "Search stays" }} />
      <Stack.Screen name="detail" />
      <Stack.Screen name="section" />
      <Stack.Screen name="checkout" options={{ title: "Confirm and pay" }} />
    </Stack>
  );
}
