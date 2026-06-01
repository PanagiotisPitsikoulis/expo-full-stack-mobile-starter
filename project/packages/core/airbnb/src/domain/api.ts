import { type BookingDraft, calculateBookingQuote, defaultBookingDraft } from "./booking";
import { imageSrc } from "./helpers";
import { type Home, homes } from "./homes-dataset";

export type ListingSearchParams = {
  checkIn?: string | null;
  checkOut?: string | null;
  city?: string | null;
  guests?: number | null;
  maxPrice?: number | null;
  q?: string | null;
  tag?: string | null;
};

export function serializeHome(home: Home) {
  return {
    id: home.id,
    title: home.title,
    type: home.type,
    city: home.city,
    neighborhood: home.neighborhood,
    country: home.country,
    pricePerNight: home.pricePerNight,
    lat: home.lat,
    lng: home.lng,
    beds: home.beds,
    baths: home.baths,
    guests: home.guests,
    minNights: home.minNights,
    availableFrom: home.availableFrom,
    availableTo: home.availableTo,
    rating: home.rating,
    reviews: home.reviews,
    superhost: home.superhost,
    amenities: home.amenities,
    tags: home.tags,
    image: imageSrc(home.image),
    host: home.host,
  };
}

type AvailabilityWindow = {
  availableFrom: string;
  availableTo: string;
  minNights?: number;
};

// True when the home's offered window covers [checkIn, checkOut) for a valid stay length.
export function isHomeAvailableForRange(
  home: AvailabilityWindow,
  checkIn?: string | null,
  checkOut?: string | null,
): boolean {
  if (!checkIn || !checkOut) return true;
  if (checkOut <= checkIn) return false;
  if (checkIn < home.availableFrom || checkOut > home.availableTo) return false;

  if (home.minNights && home.minNights > 1) {
    const nights = Math.round(
      (new Date(`${checkOut}T00:00:00Z`).getTime() - new Date(`${checkIn}T00:00:00Z`).getTime()) /
        (24 * 60 * 60 * 1000),
    );
    if (nights < home.minNights) return false;
  }

  return true;
}

export function filterListings(params: ListingSearchParams) {
  const q = params.q?.trim().toLowerCase();
  const city = params.city?.trim().toLowerCase();
  const tag = params.tag?.trim().toLowerCase();

  return homes.filter((home) => {
    if (city && !home.city.toLowerCase().includes(city)) return false;
    if (params.guests && home.guests < params.guests) return false;
    if (params.maxPrice && home.pricePerNight > params.maxPrice) return false;
    if (tag && !home.tags.some((homeTag) => homeTag.toLowerCase() === tag)) return false;
    if (!isHomeAvailableForRange(home, params.checkIn, params.checkOut)) return false;
    if (!q) return true;

    const haystack = [
      home.title,
      home.type,
      home.city,
      home.country,
      home.neighborhood,
      home.host,
      ...home.tags,
      ...home.amenities,
    ]
      .join(" ")
      .toLowerCase();

    return q
      .split(/\s+/)
      .filter(Boolean)
      .every((term) => haystack.includes(term));
  });
}

export function quoteHome(home: Home, draft: Partial<BookingDraft>) {
  return calculateBookingQuote(home, {
    ...defaultBookingDraft,
    ...draft,
  });
}
