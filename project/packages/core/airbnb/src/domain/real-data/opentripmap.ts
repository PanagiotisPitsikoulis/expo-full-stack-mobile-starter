import type { RealPlace } from "./types";

type OpenTripMapPlace = {
  kinds?: string;
  name?: string;
  point?: {
    lat?: number;
    lon?: number;
  };
  xid?: string;
};

type OpenTripMapDetail = {
  image?: string;
  otm?: string;
  preview?: {
    source?: string;
  };
  wikipedia?: string;
};

const OPENTRIPMAP_ENDPOINT = "https://api.opentripmap.com/0.1/en/places/radius";
const OPENTRIPMAP_DETAIL_ENDPOINT = "https://api.opentripmap.com/0.1/en/places/xid";

export async function fetchOpenTripMapPlaces({
  apiKey,
  lat,
  lng,
  limit = 120,
  radiusMeters = 25_000,
  withImages = true,
}: {
  apiKey: string;
  lat: number;
  lng: number;
  limit?: number;
  radiusMeters?: number;
  withImages?: boolean;
}): Promise<RealPlace[]> {
  const url = new URL(OPENTRIPMAP_ENDPOINT);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("radius", String(radiusMeters));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("rate", "2");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenTripMap places request failed: ${response.status}`);
  }

  const places = (await response.json()) as OpenTripMapPlace[];
  const detailed = await Promise.all(
    places.map(async (place) => {
      const detail = withImages && place.xid ? await fetchOpenTripMapDetail(apiKey, place.xid) : {};
      return { detail, place };
    }),
  );

  return detailed
    .filter(({ place }) => place.xid && place.name && place.point?.lat && place.point?.lon)
    .map(({ detail, place }) => ({
      id: `opentripmap-place-${place.xid}`,
      source: "opentripmap",
      sourceId: place.xid ?? "",
      title: place.name ?? "Tourism place",
      lat: place.point?.lat ?? 0,
      lng: place.point?.lon ?? 0,
      category: place.kinds?.split(",")[0] ?? "tourism",
      image: detail.preview?.source ?? detail.image,
      website: detail.wikipedia ?? detail.otm,
      attribution: "OpenTripMap / OpenStreetMap / Wikimedia",
      raw: { detail, place },
    }));
}

async function fetchOpenTripMapDetail(apiKey: string, xid: string): Promise<OpenTripMapDetail> {
  const url = new URL(`${OPENTRIPMAP_DETAIL_ENDPOINT}/${encodeURIComponent(xid)}`);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);
  if (!response.ok) return {};
  return (await response.json()) as OpenTripMapDetail;
}
