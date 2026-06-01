import type { ActivityCategory, Booking, FavoriteMapItem, Home, NearbyActivity } from "../domain";
import * as travelData from "../domain";

export type SearchForm = {
  checkIn: string;
  checkOut: string;
  destination: string;
  guests: number;
};

export const defaultSearchForm: SearchForm = {
  checkIn: "",
  checkOut: "",
  destination: "",
  guests: 1,
};

export type Trip = Booking & { home: Home };
export type HomesById = Record<string, Home>;
export type RealDataStatus = "fallback" | "loading" | "ready" | "error";

export type RealStayPayload = Partial<Home> & {
  address?: string;
  category?: string;
  image?: string;
  source?: string;
  sourceId?: string;
};

export type RealEventPayload = {
  address?: string;
  category?: string;
  city?: string;
  country?: string;
  id: string;
  image?: string;
  lat?: number;
  lng?: number;
  source?: string;
  sourceId?: string;
  startsAt?: string;
  title: string;
  venue?: string;
};

export type RealPlacePayload = {
  address?: string;
  category?: string;
  city?: string;
  country?: string;
  id: string;
  image?: string;
  lat?: number;
  lng?: number;
  title: string;
  website?: string;
};

export type TravelMapEvent = {
  id: string;
  image?: string;
  lat: number;
  lng: number;
  title: string;
};

export type EventDetailPayload = {
  image?: travelData.StaticImage;
  item: FavoriteMapItem;
  lat?: number;
  lng?: number;
  reservable: boolean;
  startsAt?: string;
};

export function firstHome() {
  const home = travelData.homes[0];
  if (!home) {
    throw new Error("Ainnb requires at least one seeded home.");
  }
  return home;
}

export function firstFrom(homes: Home[]) {
  return homes[0] ?? firstHome();
}

export function buildHomesById(homes: Home[]): HomesById {
  return Object.fromEntries(homes.map((home) => [home.id, home]));
}

export function homeById(homeId: string, homesById: HomesById, homes: Home[]) {
  return homesById[homeId] ?? firstFrom(homes);
}

export function imageForIndex(index: number) {
  return travelData.homes[index % travelData.homes.length]?.image ?? firstHome().image;
}

export function normalizeStay(stay: RealStayPayload, index: number): Home {
  const fallback = travelData.homes[index % travelData.homes.length] ?? firstHome();
  const id = stay.id ?? `real-stay-${stay.source ?? "provider"}-${stay.sourceId ?? index}`;
  const category = stay.category?.toLowerCase() ?? "";
  const tags: Home["tags"] = category.includes("hotel")
    ? ["city", "design", "remote-work"]
    : category.includes("apartment")
      ? ["city", "family", "remote-work"]
      : ["city", "design", "budget"];

  return {
    id,
    title: stay.title ?? fallback.title,
    type: stay.type ?? (category.includes("hotel") ? "Hotel" : "Real accommodation"),
    city: stay.city ?? fallback.city,
    neighborhood: stay.neighborhood ?? stay.address ?? fallback.neighborhood,
    country: stay.country ?? fallback.country,
    pricePerNight: stay.pricePerNight ?? 70 + ((index * 17) % 220),
    lat: stay.lat ?? fallback.lat,
    lng: stay.lng ?? fallback.lng,
    beds: stay.beds ?? fallback.beds,
    baths: stay.baths ?? fallback.baths,
    guests: stay.guests ?? fallback.guests,
    minNights: stay.minNights ?? fallback.minNights,
    availableFrom: stay.availableFrom ?? fallback.availableFrom,
    availableTo: stay.availableTo ?? fallback.availableTo,
    rating: stay.rating ?? Number((4.62 + (index % 28) / 100).toFixed(2)),
    reviews: stay.reviews ?? 20 + ((index * 31) % 420),
    superhost: stay.superhost ?? index % 3 !== 0,
    amenities: stay.amenities ?? ["Wifi", "Self check-in", "Workspace", "Local area"],
    tags,
    image: stay.image || imageForIndex(index),
    host: stay.host ?? `${stay.source ?? "Local"} host`,
  };
}

const activityCategoryFallback: ActivityCategory = "culture";
const categoryAliases: Record<string, ActivityCategory> = {
  attraction: "culture",
  catering: "food",
  commercial: "culture",
  entertainment: "nightlife",
  food: "food",
  leisure: "outdoors",
  natural: "outdoors",
  nightlife: "nightlife",
  sport: "outdoors",
  tourism: "culture",
};

function normalizeActivityCategory(category: string | undefined): ActivityCategory {
  const normalized = category?.trim().toLowerCase();
  if (!normalized) return activityCategoryFallback;
  if (
    normalized === "water" ||
    normalized === "food" ||
    normalized === "culture" ||
    normalized === "outdoors" ||
    normalized === "nightlife" ||
    normalized === "wellness"
  ) {
    return normalized;
  }
  return categoryAliases[normalized] ?? activityCategoryFallback;
}

const activityCategoryMeta: Record<ActivityCategory, { emoji: string; mood: string }> = {
  culture: { emoji: "🎭", mood: "Culture" },
  food: { emoji: "🍽️", mood: "Food" },
  nightlife: { emoji: "🎶", mood: "Night" },
  outdoors: { emoji: "🧭", mood: "Outdoor" },
  water: { emoji: "🌊", mood: "Water" },
  wellness: { emoji: "🧘", mood: "Wellness" },
};

export function normalizePlace(place: RealPlacePayload, index: number): travelData.NearbyActivity {
  const category = normalizeActivityCategory(place.category);
  const meta = activityCategoryMeta[category];

  return {
    area: place.address ?? place.city ?? "Nearby",
    category,
    city: place.city ?? "",
    distance: "Nearby",
    duration: "Plan ahead",
    emoji: meta.emoji,
    id: place.id,
    image: place.image || imageForIndex(index),
    lat: place.lat,
    lng: place.lng,
    mood: meta.mood,
    price: "Details",
    title: place.title,
  };
}

export function isValidCoordinate(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value !== 0;
}

export function cityCoordinateFromHomes(homes: Home[], city: string | undefined) {
  if (!city) return undefined;
  const home = homes.find((candidate) => candidate.city === city);
  if (!home || !isValidCoordinate(home.lat) || !isValidCoordinate(home.lng)) return undefined;
  return { lat: home.lat, lng: home.lng };
}

export function coordinateForActivity(activity: NearbyActivity, homes: Home[]) {
  if (isValidCoordinate(activity.lat) && isValidCoordinate(activity.lng)) {
    return { lat: activity.lat, lng: activity.lng };
  }
  return cityCoordinateFromHomes(homes, activity.city);
}

export function coordinateForEvent(event: RealEventPayload, homes: Home[]) {
  if (isValidCoordinate(event.lat) && isValidCoordinate(event.lng)) {
    return { lat: event.lat, lng: event.lng };
  }
  return cityCoordinateFromHomes(homes, event.city);
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

function eventListingMeta(event: RealEventPayload): string {
  return [formatEventTime(event.startsAt), event.venue, event.city].filter(Boolean).join(" · ");
}

function activityMapItem(activity: NearbyActivity): FavoriteMapItem {
  return {
    color: "green",
    emoji: activity.emoji,
    id: activity.id,
    meta: `${activity.price} · ${activity.duration} · ${activity.distance}`,
    position: [50, 50],
    subtitle: `${activity.area}, ${activity.city}`,
    title: activity.title,
    type: "recommended",
  };
}

function realEventMapItem(event: RealEventPayload): FavoriteMapItem {
  return {
    color: "blue",
    emoji: "🎟️",
    id: event.id,
    meta: formatEventTime(event.startsAt) ?? event.category ?? "Upcoming",
    position: [52, 36],
    subtitle: event.venue ?? event.city ?? "Real event",
    title: event.title,
    type: "favorite event",
  };
}

export function activityMatchScore(
  item: FavoriteMapItem,
  activity: Pick<NearbyActivity, "id" | "title">,
) {
  const itemTitle = item.title.toLowerCase();
  const activityTitle = activity.title.toLowerCase();
  if (activity.id === item.id || activityTitle === itemTitle) return 10;
  if (activityTitle.includes(itemTitle) || itemTitle.includes(activityTitle)) return 8;
  return itemTitle.split(/\s+/).filter((word) => word.length > 3 && activityTitle.includes(word))
    .length;
}

export function resolveEventDetail({
  activities,
  events,
  favoriteItems,
  homes,
  id,
}: {
  activities: NearbyActivity[];
  events: RealEventPayload[];
  favoriteItems: FavoriteMapItem[];
  homes: Home[];
  id: string | undefined;
}): EventDetailPayload {
  const activity = activities.find((candidate) => candidate.id === id);
  const realEvent = events.find((candidate) => candidate.id === id);
  const item =
    activity != null
      ? activityMapItem(activity)
      : realEvent != null
        ? realEventMapItem(realEvent)
        : (favoriteItems.find((candidate) => candidate.id === id) ??
          favoriteItems.find((candidate) => candidate.type !== "favorite stay") ??
          favoriteItems[0]);

  if (!item) {
    throw new Error("Ainnb requires at least one fallback map item.");
  }

  const matchedActivity =
    activity ??
    [...activities].sort((a, b) => activityMatchScore(item, b) - activityMatchScore(item, a))[0];
  const image =
    activity?.image ??
    realEvent?.image ??
    (matchedActivity && activityMatchScore(item, matchedActivity) > 0
      ? matchedActivity.image
      : undefined);
  const coordinate =
    realEvent != null
      ? coordinateForEvent(realEvent, homes)
      : activity != null
        ? coordinateForActivity(activity, homes)
        : undefined;

  return {
    image,
    item,
    lat: coordinate?.lat,
    lng: coordinate?.lng,
    reservable: true,
    startsAt: realEvent?.startsAt,
  };
}

export function buildTravelMapEvents({
  activities,
  events,
  homes,
}: {
  activities: NearbyActivity[];
  events: RealEventPayload[];
  homes: Home[];
}): TravelMapEvent[] {
  const realEvents = events
    .map((event): TravelMapEvent | null => {
      const coordinate = coordinateForEvent(event, homes);
      if (!coordinate) return null;
      return {
        id: event.id,
        image: event.image,
        lat: coordinate.lat,
        lng: coordinate.lng,
        title: event.title,
      };
    })
    .filter((value): value is TravelMapEvent => value !== null);
  const activityEvents = activities
    .map((activity): TravelMapEvent | null => {
      const coordinate = coordinateForActivity(activity, homes);
      if (!coordinate) return null;
      return {
        id: activity.id,
        image: typeof activity.image === "string" ? activity.image : undefined,
        lat: coordinate.lat,
        lng: coordinate.lng,
        title: activity.title,
      };
    })
    .filter((value): value is TravelMapEvent => value !== null);

  return [...realEvents, ...activityEvents];
}

export function buildListingRows(homes: Home[]): travelData.ListingSection[] {
  const cityOrder = Array.from(new Set(homes.map((home) => home.city))).slice(0, 12);
  return cityOrder.map((city) => ({
    title: `Real stays in ${city}`,
    items: homes
      .filter((home) => home.city === city)
      .slice(0, 14)
      .map((home) => travelData.homeToListingItem(home)),
  }));
}

export function buildActivityRows(
  activities: travelData.NearbyActivity[],
): travelData.ListingSection[] {
  const categories: ActivityCategory[] = [
    "water",
    "food",
    "culture",
    "outdoors",
    "nightlife",
    "wellness",
  ];

  return categories
    .map((category) => ({
      title:
        travelData.rowsByRoute.activities.find((row) =>
          row.items.some((item) =>
            activities.some(
              (activity) => activity.id === item[4] && activity.category === category,
            ),
          ),
        )?.title ?? `${category[0]?.toUpperCase() ?? ""}${category.slice(1)} nearby`,
      items: activities
        .filter((activity) => activity.category === category)
        .map(
          (activity): travelData.ListingItem => [
            `${activity.emoji} ${activity.title}`,
            `${activity.price} · ${activity.duration} · ${activity.distance}`,
            activity.mood,
            activity.image,
            activity.id,
          ],
        ),
    }))
    .filter((row) => row.items.length > 0);
}

export function buildEventRows(
  events: RealEventPayload[],
  fallbackRows: travelData.ListingSection[] = travelData.rowsByRoute.activities,
): travelData.ListingSection[] {
  if (events.length === 0) return fallbackRows;

  const realRows = Array.from(
    new Map(
      events.map((event) => {
        const category = event.category ?? "Live";
        return [category, category];
      }),
    ).values(),
  )
    .slice(0, 8)
    .map((category) => ({
      title: `${category} near your trips`,
      items: events
        .filter((event) => (event.category ?? "Live") === category)
        .slice(0, 14)
        .map(
          (event, index): travelData.ListingItem => [
            event.title,
            eventListingMeta(event) || "Live event",
            event.category ?? "Event",
            event.image || imageForIndex(index),
            event.id,
          ],
        ),
    }));

  return [...realRows, ...fallbackRows];
}

export function searchHomesFrom(homes: Home[], query: string): Home[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return homes;
  const terms = normalized.split(/\s+/).filter(Boolean);
  return homes.filter((home) => {
    const haystack = [
      home.title,
      home.city,
      home.country,
      home.neighborhood,
      home.type,
      home.host,
      ...home.tags,
      ...home.amenities,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function uniqueById<T extends { id: string }>(items: T[]): T[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export function uniqueStays(items: RealStayPayload[]): RealStayPayload[] {
  return Array.from(
    new Map(
      items.map((item, index) => [
        item.id ?? item.sourceId ?? `${item.title ?? "stay"}-${item.city ?? "unknown"}-${index}`,
        item,
      ]),
    ).values(),
  );
}
