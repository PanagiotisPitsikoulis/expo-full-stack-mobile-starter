import type { Home } from "./homes-dataset";

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  id: string;
  homeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
};

export type BookingDraft = {
  checkIn: string;
  checkOut: string;
  guests: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const defaultBookingDraft: BookingDraft = {
  checkIn: "2026-07-04",
  checkOut: "2026-07-06",
  guests: 1,
};

export function formatTripDateRange(checkIn: string, checkOut: string) {
  const formatter = new Intl.DateTimeFormat("en", { day: "numeric", month: "short" });
  return `${formatter.format(new Date(`${checkIn}T00:00:00`))} - ${formatter.format(
    new Date(`${checkOut}T00:00:00`),
  )}`;
}

export function calculateNights(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();
  const nights = Math.round((end - start) / MS_PER_DAY);
  return Number.isFinite(nights) && nights > 0 ? nights : 1;
}

export function calculateBookingQuote(home: Home, draft: BookingDraft) {
  const nights = calculateNights(draft.checkIn, draft.checkOut);
  const subtotal = home.pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.14);
  const taxes = Math.round(subtotal * 0.09);
  const total = subtotal + serviceFee + taxes;

  return {
    nights,
    subtotal,
    serviceFee,
    taxes,
    total,
  };
}

export function createBooking(home: Home, draft: BookingDraft): Booking {
  const quote = calculateBookingQuote(home, draft);

  return {
    id: crypto.randomUUID(),
    homeId: home.id,
    checkIn: draft.checkIn,
    checkOut: draft.checkOut,
    guests: draft.guests,
    ...quote,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
}

export function bookingOverlaps(a: Booking, b: BookingDraft & { homeId: string }) {
  if (a.status === "cancelled" || a.homeId !== b.homeId) return false;
  return a.checkIn < b.checkOut && b.checkIn < a.checkOut;
}
