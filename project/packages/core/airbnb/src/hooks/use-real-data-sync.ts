"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { Home } from "../domain";
import {
  normalizeStay,
  type RealEventPayload,
  type RealPlacePayload,
  type RealStayPayload,
  uniqueById,
  uniqueStays,
  useAppDataStore,
} from "../store";
import type { RealDataAdapter } from "./adapter";

// The API caps each request at 100; we walk the cursor up to MAX_PAGES to pull
// the full seeded catalog (currently ~260 listings across 20+ cities). Bumping
// MAX_PAGES is the only thing needed to absorb future seed growth.
const PAGE_LIMIT = 100;
const MAX_PAGES = 10;

// Shape returned by /api/listings — prices in integer cents.
type ApiListing = {
  id: string;
  title: string;
  type: string;
  city: string;
  neighborhood: string;
  country: string;
  address: string | null;
  lat: number;
  lng: number;
  priceCents: number;
  currency: string;
  beds: number;
  baths: number;
  guests: number;
  minNights: number;
  availableFrom: string;
  availableTo: string;
  rating: number;
  reviews: number;
  superhost: boolean;
  amenities: string[];
  tags: string[];
  image: string | null;
  host: string;
};

// Shape returned by /api/events.
type ApiEvent = {
  id: string;
  title: string;
  city: string;
  country: string | null;
  venue: string | null;
  address: string | null;
  lat: number;
  lng: number;
  startsAt: string | null;
  category: string | null;
  image: string | null;
};

// Shape returned by /api/places.
type ApiPlace = {
  id: string;
  title: string;
  city: string | null;
  country: string | null;
  address: string | null;
  lat: number;
  lng: number;
  category: string;
  website: string | null;
  image: string | null;
};

type ApiEnvelope<T> = { data?: T[]; meta?: { hasMore?: boolean; nextCursor?: string | null } };

type RealDataResult = {
  events: RealEventPayload[];
  fallbackOnly: boolean;
  homes: Home[];
  places: RealPlacePayload[];
  warning: string | undefined;
};

function listingToStayPayload(listing: ApiListing): RealStayPayload {
  return {
    id: listing.id,
    title: listing.title,
    type: listing.type,
    city: listing.city,
    neighborhood: listing.neighborhood,
    country: listing.country,
    address: listing.address ?? undefined,
    lat: listing.lat,
    lng: listing.lng,
    pricePerNight: Math.round(listing.priceCents / 100),
    beds: listing.beds,
    baths: listing.baths,
    guests: listing.guests,
    minNights: listing.minNights,
    availableFrom: listing.availableFrom,
    availableTo: listing.availableTo,
    rating: listing.rating,
    reviews: listing.reviews,
    superhost: listing.superhost,
    amenities: listing.amenities,
    tags: listing.tags as Home["tags"],
    image: listing.image ?? undefined,
    host: listing.host,
  };
}

function eventToEventPayload(event: ApiEvent): RealEventPayload {
  return {
    address: event.address ?? undefined,
    category: event.category ?? undefined,
    city: event.city,
    country: event.country ?? undefined,
    id: event.id,
    image: event.image ?? undefined,
    lat: event.lat,
    lng: event.lng,
    startsAt: event.startsAt ?? undefined,
    title: event.title,
    venue: event.venue ?? undefined,
  };
}

function placeToPlacePayload(place: ApiPlace): RealPlacePayload {
  return {
    address: place.address ?? undefined,
    category: place.category,
    city: place.city ?? undefined,
    country: place.country ?? undefined,
    id: place.id,
    image: place.image ?? undefined,
    lat: place.lat,
    lng: place.lng,
    title: place.title,
    website: place.website ?? undefined,
  };
}

export const realDataKeys = { all: ["real-data"] as const };

async function fetchAllPages<T>(
  doFetch: NonNullable<RealDataAdapter["fetchImpl"]> | typeof fetch,
  baseUrl: string,
  path: "/api/listings" | "/api/events" | "/api/places",
): Promise<T[]> {
  const out: T[] = [];
  let cursor: string | null = null;
  for (let i = 0; i < MAX_PAGES; i++) {
    const url =
      `${baseUrl}${path}?limit=${PAGE_LIMIT}` +
      (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
    const response = await doFetch(url);
    const payload = (await response.json()) as ApiEnvelope<T>;
    if (payload.data?.length) out.push(...payload.data);
    if (!payload.meta?.hasMore || !payload.meta.nextCursor) break;
    cursor = payload.meta.nextCursor;
  }
  return out;
}

async function fetchRealData(adapter: RealDataAdapter): Promise<RealDataResult> {
  const doFetch = adapter.fetchImpl ?? fetch;
  const base = adapter.baseUrl;
  const [allListings, allEvents, allPlaces] = await Promise.all([
    fetchAllPages<ApiListing>(doFetch, base, "/api/listings"),
    fetchAllPages<ApiEvent>(doFetch, base, "/api/events"),
    fetchAllPages<ApiPlace>(doFetch, base, "/api/places"),
  ]);

  const rawStays = uniqueStays(allListings.map(listingToStayPayload));
  const rawEvents = uniqueById(allEvents.map(eventToEventPayload));
  const rawPlaces = uniqueById(allPlaces.map(placeToPlacePayload));
  const homes = rawStays.filter((stay) => stay.id || stay.title).map(normalizeStay);
  const fallbackOnly = rawStays.length === 0 && rawEvents.length === 0 && rawPlaces.length === 0;

  return { events: rawEvents, fallbackOnly, homes, places: rawPlaces, warning: undefined };
}

/**
 * Shared data hook: React Query loads live stays/events from /api/real-data and
 * syncs them into the portable core store. The platform supplies only the base
 * URL, an optional authenticated fetch, and where a selected stay is persisted.
 */
export function useRealDataSync(adapter: RealDataAdapter) {
  const setRealHomes = useAppDataStore((s) => s.setRealHomes);
  const setRealEvents = useAppDataStore((s) => s.setRealEvents);
  const setRealPlaces = useAppDataStore((s) => s.setRealPlaces);
  const setRealDataStatus = useAppDataStore((s) => s.setRealDataStatus);
  const setRealDataWarning = useAppDataStore((s) => s.setRealDataWarning);
  const setSelectedHomeId = useAppDataStore((s) => s.setSelectedHomeId);

  // Read the adapter through a ref so a fresh adapter object per render does not
  // re-run the sync effect (which would set store state -> re-render -> loop).
  const adapterRef = useRef(adapter);
  adapterRef.current = adapter;

  const { data, error, isError, isPending } = useQuery({
    queryFn: () => fetchRealData(adapterRef.current),
    queryKey: realDataKeys.all,
    staleTime: Number.POSITIVE_INFINITY,
  });

  useEffect(() => {
    if (isPending) {
      setRealDataStatus("loading");
      return;
    }
    if (isError) {
      setRealDataStatus("error");
      setRealDataWarning(error instanceof Error ? error.message : "Failed to load real data.");
      return;
    }
    if (!data) return;

    setRealHomes(data.homes);
    setRealEvents(data.events);
    setRealPlaces(data.places);
    setRealDataWarning(data.warning);
    setRealDataStatus(data.fallbackOnly ? "fallback" : "ready");

    if (data.homes[0] && !adapterRef.current.getStoredSelectedHomeId?.()) {
      setSelectedHomeId(data.homes[0].id);
    }
  }, [
    data,
    error,
    isError,
    isPending,
    setRealDataStatus,
    setRealDataWarning,
    setRealEvents,
    setRealHomes,
    setRealPlaces,
    setSelectedHomeId,
  ]);
}
