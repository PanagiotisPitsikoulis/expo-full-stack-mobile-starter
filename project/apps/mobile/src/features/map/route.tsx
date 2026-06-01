import { useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { useCustomerTrip } from "../../lib/client/features/customer-trip/provider";
import { useTravel } from "../../lib/client/features/travel-shell/provider";
import { MapScreen } from "../../ui/features/map/screen";

export function MapRoute() {
  const router = useRouter();
  const { setRoute } = useTravel();
  const {
    state: { scope },
  } = useCustomerTrip();

  useLayoutEffect(() => {
    setRoute("map");
  }, [setRoute]);

  return (
    <MapScreen
      events={scope.mapEvents}
      homes={scope.homes}
      onOpenEvent={(eventId) => {
        router.push({ params: { id: eventId }, pathname: "/activities/event" });
      }}
      onOpenHome={(homeId) => {
        router.push({ params: { id: homeId }, pathname: "/home/detail" });
      }}
    />
  );
}
