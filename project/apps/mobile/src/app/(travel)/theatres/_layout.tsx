import { Stack } from "expo-router";
import { useAirbnbHeaderOptions } from "@/ui/components/header-options";

export default function TheatresLayout() {
  const headerOptions = useAirbnbHeaderOptions();
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: "Theatres" }} />
      <Stack.Screen name="search" options={{ title: "Search theatres" }} />
      <Stack.Screen name="detail" options={{ title: "Theatre" }} />
      <Stack.Screen name="showtime" options={{ title: "Select showtime" }} />
      <Stack.Screen name="reserve" options={{ title: "Select seats" }} />
      <Stack.Screen name="confirmation" options={{ title: "Reservation" }} />
    </Stack>
  );
}
