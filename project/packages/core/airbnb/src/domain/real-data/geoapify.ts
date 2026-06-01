import type { RealPlace, RealStay } from "./types";

type GeoapifyFeature = {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    address_line1?: string;
    address_line2?: string;
    categories?: string[];
    city?: string;
    country?: string;
    formatted?: string;
    lat?: number;
    lon?: number;
    name?: string;
    place_id?: string;
    website?: string;
  };
};

type GeoapifyResponse = {
  features?: GeoapifyFeature[];
};

const GEOAPIFY_ENDPOINT = "https://api.geoapify.com/v2/places";

function buildGeoapifyUrl({
  apiKey,
  categories,
  lat,
  lng,
  limit,
  radiusMeters,
}: {
  apiKey: string;
  categories: string;
  lat: number;
  lng: number;
  limit: number;
  radiusMeters: number;
}) {
  const url = new URL(GEOAPIFY_ENDPOINT);
  url.searchParams.set("categories", categories);
  url.searchParams.set("filter", `circle:${lng},${lat},${radiusMeters}`);
  url.searchParams.set("bias", `proximity:${lng},${lat}`);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("apiKey", apiKey);
  return url;
}

function geoapifyId(feature: GeoapifyFeature, index: number) {
  return feature.properties?.place_id ?? `geoapify-${index}`;
}

function featureCoordinates(feature: GeoapifyFeature) {
  const [geomLng, geomLat] = feature.geometry?.coordinates ?? [];
  const lat = feature.properties?.lat ?? geomLat;
  const lng = feature.properties?.lon ?? geomLng;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null;
  return { lat, lng };
}

export async function fetchGeoapifyStays({
  apiKey,
  lat,
  lng,
  limit = 80,
  radiusMeters = 25_000,
}: {
  apiKey: string;
  lat: number;
  lng: number;
  limit?: number;
  radiusMeters?: number;
}): Promise<RealStay[]> {
  const url = buildGeoapifyUrl({
    apiKey,
    categories: "accommodation.hotel,accommodation.guest_house,accommodation.apartment",
    lat,
    lng,
    limit,
    radiusMeters,
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geoapify stays request failed: ${response.status}`);
  }

  const payload = (await response.json()) as GeoapifyResponse;
  const stays: RealStay[] = [];
  (payload.features ?? []).forEach((feature, index) => {
    const coordinates = featureCoordinates(feature);
    if (!coordinates) return;
    const id = geoapifyId(feature, index);
    const title = feature.properties?.name ?? feature.properties?.address_line1 ?? "Accommodation";
    stays.push({
      id: `geoapify-stay-${id}`,
      source: "geoapify",
      sourceId: id,
      title,
      city: feature.properties?.city ?? "Unknown",
      country: feature.properties?.country,
      address: feature.properties?.formatted ?? feature.properties?.address_line2,
      lat: coordinates.lat,
      lng: coordinates.lng,
      category: feature.properties?.categories?.[0] ?? "accommodation",
      website: feature.properties?.website,
      attribution: "Geoapify / OpenStreetMap contributors",
      raw: feature,
    });
  });
  return stays;
}

export async function fetchGeoapifyPlaces({
  apiKey,
  lat,
  lng,
  limit = 120,
  radiusMeters = 25_000,
}: {
  apiKey: string;
  lat: number;
  lng: number;
  limit?: number;
  radiusMeters?: number;
}): Promise<RealPlace[]> {
  const url = buildGeoapifyUrl({
    apiKey,
    categories: "tourism,entertainment,catering.restaurant,catering.cafe,leisure",
    lat,
    lng,
    limit,
    radiusMeters,
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geoapify places request failed: ${response.status}`);
  }

  const payload = (await response.json()) as GeoapifyResponse;
  const places: RealPlace[] = [];
  (payload.features ?? []).forEach((feature, index) => {
    const coordinates = featureCoordinates(feature);
    if (!coordinates) return;
    const id = geoapifyId(feature, index);
    const title = feature.properties?.name ?? feature.properties?.address_line1 ?? "Place";
    places.push({
      id: `geoapify-place-${id}`,
      source: "geoapify",
      sourceId: id,
      title,
      city: feature.properties?.city,
      country: feature.properties?.country,
      address: feature.properties?.formatted ?? feature.properties?.address_line2,
      lat: coordinates.lat,
      lng: coordinates.lng,
      category: feature.properties?.categories?.[0] ?? "place",
      website: feature.properties?.website,
      attribution: "Geoapify / OpenStreetMap contributors",
      raw: feature,
    });
  });
  return places;
}
