import { useRouter } from "expo-router";
import { type ReactNode, useState } from "react";
import type { PrimaryRoute } from "../lib/api/travel";
import { CustomerTripProvider } from "../lib/client/features/customer-trip/provider";
import { TravelProvider } from "../lib/client/features/travel-shell/provider";
import { CustomerTripContainer } from "./customer-trip";

/** Holds primary-route state and exposes shell actions to the travel screens. */
export function TravelShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [route, setRoute] = useState<PrimaryRoute>("homes");

  return (
    <TravelProvider
      value={{
        openFilters: () => {},
        openMenu: () => router.push("/profile"),
        route,
        setRoute,
      }}
    >
      <CustomerTripProvider>
        {children}
        <CustomerTripContainer />
      </CustomerTripProvider>
    </TravelProvider>
  );
}
