import type { RealEventPayload } from "@repo/airbnb-core/store";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import type { ListingItem, NearbyActivity } from "../../lib/api/travel";
import { useAppData } from "../../lib/client";
import { useTravel } from "../../lib/client/features/travel-shell/provider";
import { SearchScreen } from "../../ui/features/search/screen";

function matchesAll(haystack: string, terms: string[]): boolean {
  const normalized = haystack.toLowerCase();
  return terms.every((term) => normalized.includes(term));
}

function activityToItem(activity: NearbyActivity): ListingItem {
  return [
    `${activity.emoji} ${activity.title}`,
    `${activity.price} · ${activity.duration} · ${activity.distance}`,
    activity.mood,
    activity.image,
    activity.id,
  ];
}

function formatEventTime(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function eventToItem(event: RealEventPayload, fallbackImage: NearbyActivity["image"]): ListingItem {
  return [
    event.title,
    [formatEventTime(event.startsAt), event.venue, event.city].filter(Boolean).join(" · ") ||
      "Live event",
    event.category ?? "Event",
    event.image ?? fallbackImage,
    event.id,
  ];
}

export function ActivitiesSearchRoute() {
  const router = useRouter();
  const {
    selectors,
    state: { activities, navigation: nav, realData },
  } = useAppData();
  const { route } = useTravel();

  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const terms = useMemo(() => trimmed.toLowerCase().split(/\s+/).filter(Boolean), [trimmed]);

  const results = useMemo<ListingItem[]>(() => {
    const fallbackImage: NearbyActivity["image"] = activities.nearby[0]?.image ?? "";

    const eventMatches = realData.events.filter((event) =>
      terms.length === 0
        ? true
        : matchesAll(
            [
              event.title,
              event.city,
              event.country ?? "",
              event.venue ?? "",
              event.address ?? "",
              event.category ?? "",
            ].join(" "),
            terms,
          ),
    );

    const activityMatches = activities.nearby.filter((activity) =>
      terms.length === 0
        ? true
        : matchesAll(
            [activity.title, activity.city, activity.area, activity.category, activity.mood].join(
              " ",
            ),
            terms,
          ),
    );

    return [
      ...eventMatches.slice(0, 30).map((event) => eventToItem(event, fallbackImage)),
      ...activityMatches.slice(0, 30).map(activityToItem),
    ];
  }, [activities.nearby, realData.events, terms]);

  const title = trimmed ? `Activities matching “${trimmed}”` : "Activities";
  const emptyHint = trimmed
    ? "Try a different venue, city, or vibe."
    : "Activities and events will appear here once they load.";

  return (
    <SearchScreen
      badge={nav.routeBadgeLabels[route]}
      emptyHint={emptyHint}
      imageSrc={selectors.imageSrc}
      onClearSearch={trimmed ? () => setQuery("") : undefined}
      onOpenDetail={(itemId) =>
        router.push({ params: { id: itemId }, pathname: "/activities/event" })
      }
      onQueryChange={setQuery}
      query={query}
      results={results}
      searchPlaceholder="Search activities, events, venues"
      title={title}
    />
  );
}
