import { nearbyActivities } from "./data";
import type { Home, HomeTag } from "./homes-dataset";
import type { ListingSection } from "./types";

export type StayPlaceType = "any" | "room" | "entire";

export type StayFilters = {
  amenities: string[];
  instantBook: boolean;
  minBaths: number;
  minBedrooms: number;
  minBeds: number;
  minGuests: number;
  placeType: StayPlaceType;
  priceMax: number | null;
  priceMin: number | null;
  tags: HomeTag[];
};

export type PriceBounds = { max: number; min: number };

export type ActivityCategory = "water" | "food" | "culture" | "outdoors" | "nightlife" | "wellness";

export type ActivityFilters = {
  categories: ActivityCategory[];
};

export const defaultStayFilters: StayFilters = {
  amenities: [],
  instantBook: false,
  minBaths: 0,
  minBedrooms: 0,
  minBeds: 0,
  minGuests: 0,
  placeType: "any",
  priceMax: null,
  priceMin: null,
  tags: [],
};

export const defaultActivityFilters: ActivityFilters = {
  categories: [],
};

/** Amenity options surfaced in the Filters modal. Values must match `Home.amenities`. */
export const FILTER_AMENITIES = [
  "Kitchen",
  "Wifi",
  "TV",
  "Washer",
  "Iron",
  "Free parking",
] as const;

export const ACTIVITY_FILTER_CATEGORIES = [
  { id: "water", label: "Water" },
  { id: "food", label: "Food" },
  { id: "culture", label: "Culture" },
  { id: "outdoors", label: "Outdoors" },
  { id: "nightlife", label: "Nightlife" },
  { id: "wellness", label: "Wellness" },
] satisfies Array<{ id: ActivityCategory; label: string }>;

const ROOM_TYPE_PATTERN = /room|studio|suite|shared|hostel/;

export function priceBoundsOf(homes: Home[]): PriceBounds {
  if (homes.length === 0) return { max: 1000, min: 0 };
  let min = Number.POSITIVE_INFINITY;
  let max = 0;
  for (const home of homes) {
    if (home.pricePerNight < min) min = home.pricePerNight;
    if (home.pricePerNight > max) max = home.pricePerNight;
  }
  return { max: Math.ceil(max), min: Math.floor(min) };
}

function matchesPlaceType(home: Home, placeType: StayPlaceType): boolean {
  if (placeType === "any") return true;
  const isRoom = ROOM_TYPE_PATTERN.test(home.type.toLowerCase());
  return placeType === "room" ? isRoom : !isRoom;
}

export function isStayFiltersActive(filters: StayFilters): boolean {
  return (
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.placeType !== "any" ||
    filters.minBedrooms > 0 ||
    filters.minBeds > 0 ||
    filters.minBaths > 0 ||
    filters.minGuests > 0 ||
    filters.instantBook ||
    filters.amenities.length > 0 ||
    filters.tags.length > 0
  );
}

export function applyStayFilters(homes: Home[], filters: StayFilters): Home[] {
  if (!isStayFiltersActive(filters)) return homes;

  const minBeds = Math.max(filters.minBedrooms, filters.minBeds);

  return homes.filter((home) => {
    if (filters.priceMin !== null && home.pricePerNight < filters.priceMin) return false;
    if (filters.priceMax !== null && home.pricePerNight > filters.priceMax) return false;
    if (!matchesPlaceType(home, filters.placeType)) return false;
    if (home.guests < filters.minGuests) return false;
    if (home.beds < minBeds) return false;
    if (home.baths < filters.minBaths) return false;
    if (filters.instantBook && !home.superhost) return false;
    if (filters.tags.some((tag) => !home.tags.includes(tag))) return false;
    if (filters.amenities.some((amenity) => !home.amenities.includes(amenity))) return false;
    return true;
  });
}

export function isActivityFiltersActive(filters: ActivityFilters): boolean {
  return filters.categories.length > 0;
}

function categoryForActivityItem(item: ListingSection["items"][number], sectionTitle: string) {
  const itemId = item[4];
  const seededActivity = itemId
    ? nearbyActivities.find((activity) => activity.id === itemId)
    : undefined;

  if (seededActivity) return seededActivity.category;

  const searchable = `${sectionTitle} ${item[2]}`.toLowerCase();
  return ACTIVITY_FILTER_CATEGORIES.find(({ id, label }) => {
    const normalizedLabel = label.toLowerCase();
    return searchable.includes(id) || searchable.includes(normalizedLabel);
  })?.id;
}

export function applyActivityFilters(
  rows: ListingSection[],
  filters: ActivityFilters,
): ListingSection[] {
  if (!isActivityFiltersActive(filters)) return rows;
  const allowedCategories = new Set(filters.categories);

  return rows
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const category = categoryForActivityItem(item, section.title);
        return category ? allowedCategories.has(category) : false;
      }),
    }))
    .filter((section) => section.items.length > 0);
}

export function countListingItems(rows: ListingSection[]): number {
  return rows.reduce((total, section) => total + section.items.length, 0);
}
