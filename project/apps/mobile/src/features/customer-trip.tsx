import { useSegments } from "expo-router";
import { useMemo } from "react";
import { useAppData } from "../lib/client";
import { useCustomerTrip } from "../lib/client/features/customer-trip/provider";
import { CustomerTripSheet } from "../ui/features/customer-trip/customer-trip-sheet";

export function CustomerTripContainer() {
  const segments = useSegments();
  const {
    actions: { goNext, selectDay, setTab, shiftMonth, updateForm },
    meta: { resultCount },
    state: { form, isOpen, routeLabel, tab },
  } = useCustomerTrip();
  const {
    state: { listings },
  } = useAppData();

  // Derive picker options from the real catalog so the wheels only show
  // destinations we actually have stays for. Picking France → cities of
  // France, and only cities we've seeded; no dead ends.
  const catalog = useMemo(() => {
    const byCountry = new Map<string, Set<string>>();
    for (const home of listings.homes) {
      if (!home.country || !home.city) continue;
      const cities = byCountry.get(home.country) ?? new Set<string>();
      cities.add(home.city);
      byCountry.set(home.country, cities);
    }
    return Array.from(byCountry.entries())
      .map(([country, cities]) => ({
        country,
        cities: Array.from(cities).sort((a, b) => a.localeCompare(b)),
      }))
      .sort((a, b) => a.country.localeCompare(b.country));
  }, [listings.homes]);

  // The (travel) layout stays mounted under the stack when other groups (auth,
  // modals) are pushed on top, so the bottom-sheet portal would otherwise float
  // above login/signup. Only render it while a travel route is on top.
  const onTravelRoute = segments[0] === "(travel)";

  return (
    <CustomerTripSheet
      catalog={catalog}
      form={form}
      isOpen={isOpen && onTravelRoute}
      onGoNext={goNext}
      onSelectDay={selectDay}
      onSelectTab={setTab}
      onShiftMonth={shiftMonth}
      onUpdateForm={updateForm}
      resultCount={resultCount}
      routeLabel={routeLabel}
      tab={tab}
    />
  );
}
