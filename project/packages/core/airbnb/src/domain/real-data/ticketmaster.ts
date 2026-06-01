import type { RealEvent } from "./types";

type TicketmasterEvent = {
  _embedded?: {
    venues?: Array<{
      address?: { line1?: string };
      city?: { name?: string };
      country?: { name?: string };
      location?: { latitude?: string; longitude?: string };
      name?: string;
    }>;
  };
  classifications?: Array<{
    segment?: { name?: string };
  }>;
  dates?: {
    start?: {
      dateTime?: string;
      localDate?: string;
      localTime?: string;
    };
  };
  id?: string;
  images?: Array<{
    height?: number;
    ratio?: string;
    url?: string;
    width?: number;
  }>;
  name?: string;
  url?: string;
};

type TicketmasterResponse = {
  _embedded?: {
    events?: TicketmasterEvent[];
  };
};

const TICKETMASTER_ENDPOINT = "https://app.ticketmaster.com/discovery/v2/events.json";

export async function fetchTicketmasterEvents({
  apiKey,
  city,
  countryCode,
  limit = 100,
}: {
  apiKey: string;
  city: string;
  countryCode?: string;
  limit?: number;
}): Promise<RealEvent[]> {
  const url = new URL(TICKETMASTER_ENDPOINT);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("city", city);
  url.searchParams.set("size", String(Math.min(limit, 200)));
  url.searchParams.set("sort", "date,asc");
  if (countryCode) url.searchParams.set("countryCode", countryCode);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ticketmaster events request failed: ${response.status}`);
  }

  const payload = (await response.json()) as TicketmasterResponse;
  return (payload._embedded?.events ?? []).map((event) => {
    const venue = event._embedded?.venues?.[0];
    const image = event.images
      ?.slice()
      .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))
      .find((candidate) => candidate.url)?.url;

    return {
      id: `ticketmaster-event-${event.id}`,
      source: "ticketmaster",
      sourceId: event.id ?? "",
      title: event.name ?? "Event",
      city: venue?.city?.name,
      country: venue?.country?.name,
      venue: venue?.name,
      address: venue?.address?.line1,
      lat: venue?.location?.latitude ? Number(venue.location.latitude) : undefined,
      lng: venue?.location?.longitude ? Number(venue.location.longitude) : undefined,
      startsAt:
        event.dates?.start?.dateTime ??
        [event.dates?.start?.localDate, event.dates?.start?.localTime].filter(Boolean).join(" "),
      category: event.classifications?.[0]?.segment?.name,
      url: event.url,
      image,
      attribution: "Ticketmaster Discovery API",
      raw: event,
    };
  });
}
