import { supportedCountries as defaultSupportedCountries } from "@repo/airbnb-core/domain";
import {
  buildTravelMapEvents,
  type SearchForm,
  type TravelMapEvent,
} from "@repo/airbnb-core/store";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { LocationResolver } from "../../adapters";
import type { AppDataValue } from "../app-data";
import type { TravelContextValue } from "../travel-shell";
import { noopResolveCurrentCountry } from "./location";
import {
  addMonths,
  type CalendarView,
  type CustomerTripTab,
  countRows,
  defaultCustomerTripForm,
  FLEXIBLE_DESTINATION,
  filterActivitiesForTrip,
  filterActivityRowsForTrip,
  filterEventsForTrip,
  filterHomesForDestination,
  filterHomesForTrip,
  hasDestination,
  nextTab,
  routeHasTripResults,
  rowsForHomes,
} from "./model";

type CustomerTripForm = SearchForm;

export type CustomerTripValue = {
  actions: {
    goNext: () => void;
    open: (tab?: CustomerTripTab) => void;
    selectDay: (iso: string) => void;
    setTab: (tab: CustomerTripTab) => void;
    shiftMonth: (months: number) => void;
    submit: () => void;
    updateForm: (form: Partial<CustomerTripForm>) => void;
  };
  meta: {
    resultCount: number;
  };
  state: {
    areaLabel: string;
    calendarView: CalendarView;
    canSubmit: boolean;
    form: CustomerTripForm;
    detectedCountry: string | null;
    isOpen: boolean;
    routeLabel: string;
    scope: {
      activityRows: ReturnType<typeof filterActivityRowsForTrip>;
      activities: ReturnType<typeof filterActivitiesForTrip>;
      events: ReturnType<typeof filterEventsForTrip>;
      homeRows: ReturnType<typeof rowsForHomes>;
      homes: ReturnType<typeof filterHomesForTrip>;
      mapEvents: TravelMapEvent[];
    };
    tab: CustomerTripTab;
  };
};

export function createCustomerTripProvider({
  useAppData,
  useTravel,
  resolveCurrentCountry = noopResolveCurrentCountry,
  supportedCountries = defaultSupportedCountries,
}: {
  resolveCurrentCountry?: LocationResolver;
  supportedCountries?: readonly string[];
  useAppData: () => AppDataValue;
  useTravel: () => TravelContextValue;
}) {
  const Context = createContext<CustomerTripValue | null>(null);

  function CustomerTripProvider({ children }: { children: ReactNode }) {
    const { route } = useTravel();
    const {
      actions: { search },
      state: { activities, listings, navigation, realData, search: searchState },
    } = useAppData();

    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<CustomerTripTab>("country");
    const initial = searchState.form.checkIn ? new Date(searchState.form.checkIn) : new Date();
    const [calendarView, setCalendarView] = useState<CalendarView>({
      month1: initial.getMonth() + 1,
      year: initial.getFullYear(),
    });

    const hasSubmittedTrip = searchState.submittedForm !== null;
    const scopedHomes = useMemo(
      () =>
        hasSubmittedTrip
          ? filterHomesForTrip(listings.homes, searchState.submittedForm)
          : listings.homes,
      [hasSubmittedTrip, listings.homes, searchState.submittedForm],
    );
    const scopedDestinationHomes = useMemo(
      () =>
        hasSubmittedTrip
          ? filterHomesForDestination(listings.homes, searchState.submittedForm)
          : listings.homes,
      [hasSubmittedTrip, listings.homes, searchState.submittedForm],
    );
    const scopedActivities = useMemo(
      () =>
        hasSubmittedTrip
          ? filterActivitiesForTrip(
              activities.nearby,
              scopedDestinationHomes,
              searchState.submittedForm,
            )
          : activities.nearby,
      [activities.nearby, hasSubmittedTrip, scopedDestinationHomes, searchState.submittedForm],
    );
    const scopedEvents = useMemo(
      () =>
        hasSubmittedTrip
          ? filterEventsForTrip(realData.events, scopedDestinationHomes, searchState.submittedForm)
          : realData.events,
      [hasSubmittedTrip, realData.events, scopedDestinationHomes, searchState.submittedForm],
    );
    const scopedActivityRows = useMemo(
      () =>
        hasSubmittedTrip
          ? filterActivityRowsForTrip({
              activities: scopedActivities,
              events: scopedEvents,
              rows: listings.byRoute.activities,
            })
          : listings.byRoute.activities,
      [hasSubmittedTrip, listings.byRoute.activities, scopedActivities, scopedEvents],
    );
    const scopedHomeRows = useMemo(
      () => (hasSubmittedTrip ? rowsForHomes(scopedHomes) : listings.byRoute.homes),
      [hasSubmittedTrip, listings.byRoute.homes, scopedHomes],
    );
    const scopedMapEvents = useMemo(
      () =>
        buildTravelMapEvents({
          activities: scopedActivities,
          events: scopedEvents,
          homes: scopedDestinationHomes,
        }),
      [scopedActivities, scopedDestinationHomes, scopedEvents],
    );
    const draftHomes = useMemo(
      () => filterHomesForTrip(listings.homes, searchState.form),
      [listings.homes, searchState.form],
    );
    const draftDestinationHomes = useMemo(
      () => filterHomesForDestination(listings.homes, searchState.form),
      [listings.homes, searchState.form],
    );
    const draftActivities = useMemo(
      () => filterActivitiesForTrip(activities.nearby, draftDestinationHomes, searchState.form),
      [activities.nearby, draftDestinationHomes, searchState.form],
    );
    const draftEvents = useMemo(
      () => filterEventsForTrip(realData.events, draftDestinationHomes, searchState.form),
      [realData.events, draftDestinationHomes, searchState.form],
    );
    const draftActivityRows = useMemo(
      () =>
        filterActivityRowsForTrip({
          activities: draftActivities,
          events: draftEvents,
          rows: listings.byRoute.activities,
        }),
      [draftActivities, draftEvents, listings.byRoute.activities],
    );
    const draftMapEvents = useMemo(
      () =>
        buildTravelMapEvents({
          activities: draftActivities,
          events: draftEvents,
          homes: draftDestinationHomes,
        }),
      [draftActivities, draftDestinationHomes, draftEvents],
    );

    const draftRouteHasResults = routeHasTripResults({
      activityRows: draftActivityRows,
      homes: draftHomes,
      mapEvents: draftMapEvents,
      route,
    });
    const resultCount =
      route === "activities"
        ? countRows(draftActivityRows)
        : route === "map"
          ? draftHomes.length + draftMapEvents.length
          : route === "ai"
            ? draftHomes.length + countRows(draftActivityRows)
            : draftHomes.length;

    const formRef = useRef(searchState.form);
    formRef.current = searchState.form;
    const locationPromiseRef = useRef<Promise<string | null> | null>(null);
    const seededRef = useRef(false);
    const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

    useEffect(() => {
      if (seededRef.current) return;
      seededRef.current = true;
      const defaults = defaultCustomerTripForm();
      const patch: Partial<CustomerTripForm> = {};
      if (!searchState.form.destination.trim()) patch.destination = defaults.destination;
      if (!searchState.form.checkIn) patch.checkIn = defaults.checkIn;
      if (!searchState.form.checkOut) patch.checkOut = defaults.checkOut;
      if (!searchState.form.guests || searchState.form.guests < 1) patch.guests = defaults.guests;
      if (Object.keys(patch).length > 0) search.updateForm(patch);

      locationPromiseRef.current = resolveCurrentCountry(supportedCountries);
      locationPromiseRef.current.then((country) => {
        if (!country) return;
        setDetectedCountry(country);
        if (formRef.current.destination === FLEXIBLE_DESTINATION) {
          search.updateForm({ destination: country });
        }
      });
    }, [search, searchState.form]);

    const open = useCallback(
      // Always start from the first step (country) and reset the draft form,
      // regardless of which segment the user tapped to open the sheet.
      (_nextTab?: CustomerTripTab) => {
        search.updateForm(defaultCustomerTripForm());
        setTab("country");
        setIsOpen(true);
      },
      [search],
    );

    const submit = useCallback(() => {
      if (!hasDestination(searchState.form)) {
        setTab("country");
        setIsOpen(true);
        return;
      }
      search.submit();
      setIsOpen(false);
    }, [search, searchState.form]);

    const selectDay = useCallback(
      (iso: string) => {
        if (tab === "checkOut") {
          if (searchState.form.checkIn && iso < searchState.form.checkIn) return;
          if (iso === searchState.form.checkIn) {
            search.updateForm({ checkOut: "" });
            return;
          }
          search.updateForm({ checkOut: iso });
          return;
        }
        const currentCheckOut = searchState.form.checkOut;
        const clearedCheckOut = currentCheckOut && iso >= currentCheckOut ? "" : currentCheckOut;
        search.updateForm({ checkIn: iso, checkOut: clearedCheckOut });
      },
      [search, searchState.form, tab],
    );

    const goNext = useCallback(() => {
      const next = nextTab(tab);
      if (next) {
        setTab(next);
        return;
      }
      submit();
    }, [submit, tab]);

    const shiftMonth = useCallback((months: number) => {
      setCalendarView((view) => addMonths(view.year, view.month1, months));
    }, []);

    const value = useMemo<CustomerTripValue>(
      () => ({
        actions: {
          goNext,
          open,
          selectDay,
          setTab,
          shiftMonth,
          submit,
          updateForm: search.updateForm,
        },
        meta: {
          resultCount,
        },
        state: {
          areaLabel: searchState.submittedForm?.destination || "Anywhere",
          calendarView,
          canSubmit: hasDestination(searchState.form) && draftRouteHasResults,
          detectedCountry,
          form: searchState.form,
          isOpen,
          routeLabel: navigation.routeLabels[route],
          scope: {
            activities: scopedActivities,
            activityRows: scopedActivityRows,
            events: scopedEvents,
            homeRows: scopedHomeRows,
            homes: scopedHomes,
            mapEvents: scopedMapEvents,
          },
          tab,
        },
      }),
      [
        calendarView,
        draftRouteHasResults,
        detectedCountry,
        goNext,
        isOpen,
        navigation.routeLabels,
        open,
        resultCount,
        route,
        scopedActivities,
        scopedActivityRows,
        scopedEvents,
        scopedHomeRows,
        scopedHomes,
        scopedMapEvents,
        search.updateForm,
        searchState.form,
        searchState.submittedForm?.destination,
        selectDay,
        shiftMonth,
        submit,
        tab,
      ],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useCustomerTrip() {
    const value = useContext(Context);
    if (!value) {
      throw new Error("useCustomerTrip must be used within CustomerTripProvider");
    }
    return value;
  }

  return { CustomerTripProvider, useCustomerTrip };
}
