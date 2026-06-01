import { useRouter } from "expo-router";
import { useState } from "react";
import { useAppData } from "../../lib/client";
import { useRequireAuth } from "../../lib/client/auth-guard";
import { useTravel } from "../../lib/client/features/travel-shell/provider";
import { SearchScreen } from "../../ui/features/search/screen";

export function SearchRoute() {
  const router = useRouter();
  const {
    actions: { selection, wishlist },
    selectors,
    state: { listings, navigation: nav },
  } = useAppData();
  const { route } = useTravel();
  const requireAuth = useRequireAuth();

  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const matches = trimmed ? selectors.searchHomes(trimmed) : listings.homes;
  const homes = selectors.applyFilters(matches);
  const results = homes.slice(0, 30).map((home) => selectors.homeToListingItem(home));
  const title = trimmed ? `Stays matching “${trimmed}”` : "All stays";
  const emptyHint = trimmed
    ? "Try a different destination, host, or amenity."
    : "Stays will appear here once they load.";

  return (
    <SearchScreen
      badge={nav.routeBadgeLabels[route]}
      emptyHint={emptyHint}
      imageSrc={selectors.imageSrc}
      isSaved={wishlist.isSaved}
      onClearSearch={trimmed ? () => setQuery("") : undefined}
      onOpenDetail={(homeId) => {
        selection.selectHome(homeId);
        router.push("/home/detail");
      }}
      onQueryChange={setQuery}
      onToggleSave={requireAuth(wishlist.toggleHome)}
      query={query}
      results={results}
      searchPlaceholder="Search destinations, hosts, amenities"
      title={title}
    />
  );
}
