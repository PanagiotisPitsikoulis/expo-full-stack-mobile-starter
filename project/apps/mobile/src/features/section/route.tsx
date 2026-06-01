import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useMemo } from "react";
import type { ListingSection, PrimaryRoute } from "../../lib/api/travel";
import { useAppData } from "../../lib/client";
import { SectionScreen } from "../../ui/features/section/screen";

export function SectionRoute({ route }: { route: PrimaryRoute }) {
  const params = useLocalSearchParams<{ category?: string; title?: string }>();
  const title = typeof params.title === "string" ? params.title : "";
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);
  const {
    actions: { selection, wishlist },
    selectors,
    state: { listings, navigation: navState, recommendations },
  } = useAppData();

  const category = typeof params.category === "string" ? params.category : "all";

  const recommendedRow = useMemo<ListingSection | null>(() => {
    if (route !== "homes") return null;
    const recHomes = recommendations.homeIds
      .map((id) => listings.homesById[id])
      .filter((home): home is NonNullable<typeof home> => Boolean(home));
    if (recHomes.length === 0) return null;
    return {
      title: "Recommended for you",
      items: recHomes.map((home) => selectors.homeToListingItem(home)),
    };
  }, [listings.homesById, recommendations.homeIds, route, selectors]);

  const categoryRow = useMemo<ListingSection | null>(() => {
    if (route !== "homes" || category === "all") return null;
    const selected = navState.listingCategories.find((entry) => entry.id === category);
    const amenities = selected?.amenities ?? [];
    if (amenities.length === 0) return null;
    const filteredHomes = listings.homes.filter((home) =>
      amenities.every((amenity) => home.amenities.includes(amenity)),
    );
    if (filteredHomes.length === 0) return null;
    return {
      title: `${selected?.label ?? "Filtered"} stays`,
      items: filteredHomes.map((home) => selectors.homeToListingItem(home)),
    };
  }, [category, listings.homes, navState.listingCategories, route, selectors]);

  const baseRows = listings.byRoute[route] ?? listings.byRoute.homes;
  const candidates = [
    ...(categoryRow ? [categoryRow] : []),
    ...(recommendedRow ? [recommendedRow] : []),
    ...baseRows,
  ];
  const section =
    candidates.find((row) => row.title === title) ??
    ({ items: [], title } satisfies ListingSection);

  const badge = navState.routeBadgeLabels[route];

  return (
    <SectionScreen
      badge={badge}
      imageSrc={selectors.imageSrc}
      isSaved={wishlist.isSaved}
      onOpenDetail={(itemId) => {
        selection.selectHome(itemId);
        if (route === "activities") {
          router.push({ params: { id: itemId }, pathname: "/activities/event" });
        } else {
          router.push({ params: { id: itemId }, pathname: "/home/detail" });
        }
      }}
      onToggleSave={wishlist.toggleHome}
      section={section}
    />
  );
}
