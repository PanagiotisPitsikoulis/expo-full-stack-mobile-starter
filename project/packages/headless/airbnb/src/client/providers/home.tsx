import type { ListingSection, PrimaryRoute, TravelCategoryId } from "@repo/airbnb-core/domain";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import type { AppDataValue } from "./app-data";
import type { CustomerTripValue } from "./customer-trip";

type HomeFeatureState = {
  activeCategory: TravelCategoryId;
  aiBadgeRowTitle?: string;
  defaultBadge: string;
  route: PrimaryRoute;
  rows: ListingSection[];
  showCategoryStrip: boolean;
};

type HomeFeatureActions = {
  setActiveCategory: (category: TravelCategoryId) => void;
};

export type HomeFeatureValue = {
  actions: HomeFeatureActions;
  state: HomeFeatureState;
};

export function createHomeFeatureProvider({
  useAppData,
  useCustomerTrip,
}: {
  useAppData: () => AppDataValue;
  useCustomerTrip: () => CustomerTripValue;
}) {
  const Context = createContext<HomeFeatureValue | null>(null);

  function HomeFeatureProvider({ children, route }: { children: ReactNode; route: PrimaryRoute }) {
    const [activeCategory, setActiveCategory] = useState<TravelCategoryId>("all");
    const {
      selectors,
      state: { filters, navigation, recommendations },
    } = useAppData();
    const {
      state: { scope },
    } = useCustomerTrip();

    const baseRows = route === "activities" ? scope.activityRows : scope.homeRows;

    const allowedHomeIds = useMemo(() => {
      if (!filters.isActive) return null;
      return new Set(selectors.applyFilters(scope.homes).map((home) => home.id));
    }, [filters.isActive, scope.homes, selectors]);

    const recommendedRow = useMemo<ListingSection | null>(() => {
      const scopedHomesById = new Map(scope.homes.map((home) => [home.id, home]));
      const recHomes = recommendations.homeIds
        .map((id) => scopedHomesById.get(id))
        .filter((home): home is NonNullable<typeof home> => Boolean(home));
      if (recHomes.length === 0) return null;
      return {
        title: "Recommended for you",
        items: recHomes.map((home) => selectors.homeToListingItem(home)),
      };
    }, [recommendations.homeIds, scope.homes, selectors]);

    const rows = useMemo<ListingSection[]>(() => {
      if (route === "activities") return baseRows;

      const categoryRows = (() => {
        if (activeCategory === "all") {
          return recommendedRow ? [recommendedRow, ...baseRows] : baseRows;
        }

        const selected = navigation.listingCategories.find(
          (category) => category.id === activeCategory,
        );
        const amenities = selected?.amenities ?? [];
        const filteredHomes = scope.homes.filter((home) =>
          amenities.every((amenity) => home.amenities.includes(amenity)),
        );
        const uniqueHomes = Array.from(
          new Map(filteredHomes.map((home) => [home.id, home])).values(),
        );

        if (uniqueHomes.length === 0) return baseRows;

        return [
          {
            title: `${selected?.label ?? "Filtered"} stays`,
            items: uniqueHomes.map((home) => selectors.homeToListingItem(home)),
          },
        ];
      })();

      if (!allowedHomeIds) return categoryRows;

      return categoryRows
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) => item[4] !== undefined && allowedHomeIds.has(item[4]),
          ),
        }))
        .filter((section) => section.items.length > 0);
    }, [
      activeCategory,
      allowedHomeIds,
      baseRows,
      navigation.listingCategories,
      recommendedRow,
      route,
      scope.homes,
      selectors,
    ]);

    const value = useMemo<HomeFeatureValue>(
      () => ({
        actions: { setActiveCategory },
        state: {
          activeCategory,
          aiBadgeRowTitle: recommendedRow?.title,
          defaultBadge: navigation.routeBadgeLabels[route],
          route,
          rows,
          showCategoryStrip: route !== "activities" && route !== "ai",
        },
      }),
      [activeCategory, navigation.routeBadgeLabels, recommendedRow?.title, route, rows],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useHomeFeature() {
    const value = useContext(Context);
    if (!value) {
      throw new Error("useHomeFeature must be used within HomeFeatureProvider");
    }
    return value;
  }

  return { HomeFeatureProvider, useHomeFeature };
}
