import type { PrimaryRoute } from "@repo/airbnb-core/domain";
import { createContext, type ReactNode, useContext } from "react";

export type TravelContextValue = {
  openFilters: () => void;
  openMenu: () => void;
  route: PrimaryRoute;
  setRoute: (route: PrimaryRoute) => void;
};

const TravelContext = createContext<TravelContextValue | null>(null);

export function TravelProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: TravelContextValue;
}) {
  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
}

export function useTravel(): TravelContextValue {
  const ctx = useContext(TravelContext);
  if (!ctx) {
    throw new Error("useTravel must be used inside TravelProvider");
  }
  return ctx;
}
