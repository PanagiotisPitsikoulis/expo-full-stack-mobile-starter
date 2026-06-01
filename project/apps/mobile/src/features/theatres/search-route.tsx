import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import type { ListingItem } from "../../lib/api/travel";
import { useAppData } from "../../lib/client";
import { useRequireAuth } from "../../lib/client/auth-guard";
import { useTheatres } from "../../lib/client/features/theatres/api";
import { SearchScreen } from "../../ui/features/search/screen";

function matchesAll(haystack: string, terms: string[]): boolean {
  const normalized = haystack.toLowerCase();
  return terms.every((term) => normalized.includes(term));
}

function theatreToItem(theatre: {
  capacity: number;
  city: string;
  country: string;
  description: string;
  id: string;
  image: string;
  location: string;
  name: string;
}): ListingItem {
  return [
    theatre.name,
    `${theatre.city}, ${theatre.country} · ${theatre.capacity} seats`,
    "Theatre",
    theatre.image,
    theatre.id,
  ];
}

export function TheatresSearchRoute() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const {
    actions: { wishlist },
    selectors,
  } = useAppData();
  const requireAuth = useRequireAuth();
  const { data = [], isLoading } = useTheatres();

  const trimmed = query.trim();
  const terms = useMemo(() => trimmed.toLowerCase().split(/\s+/).filter(Boolean), [trimmed]);
  const results = useMemo<ListingItem[]>(() => {
    const matches = data.filter((theatre) =>
      terms.length === 0
        ? true
        : matchesAll(
            [
              theatre.name,
              theatre.city,
              theatre.country,
              theatre.location,
              theatre.description,
            ].join(" "),
            terms,
          ),
    );
    return matches.slice(0, 30).map(theatreToItem);
  }, [data, terms]);

  const title = trimmed ? `Theatres matching “${trimmed}”` : "Theatres";
  const emptyHint = trimmed
    ? "Try a different theatre, city, or country."
    : isLoading
      ? "Theatres will appear here once they load."
      : "No theatres are available right now.";

  return (
    <SearchScreen
      badge="Theatre"
      emptyHint={emptyHint}
      imageSrc={selectors.imageSrc}
      isSaved={wishlist.isEventSaved}
      onClearSearch={trimmed ? () => setQuery("") : undefined}
      onOpenDetail={(id) => router.push({ params: { id }, pathname: "/theatres/detail" })}
      onQueryChange={setQuery}
      onToggleSave={requireAuth(wishlist.toggleEvent)}
      query={query}
      results={results}
      searchPlaceholder="Search theatres or cities"
      title={title}
    />
  );
}
