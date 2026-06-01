import { Stack } from "expo-router";
import { useAirbnbHeaderOptions } from "@/ui/components/header-options";

export default function AiLayout() {
  const headerOptions = useAirbnbHeaderOptions();
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: "Ainnb AI" }} />
    </Stack>
  );
}
