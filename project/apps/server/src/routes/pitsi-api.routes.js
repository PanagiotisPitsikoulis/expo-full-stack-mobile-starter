import { randomUUID } from "node:crypto";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export const pitsiApiRouter = Router();

const images = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
];

const cities = [
  ["Nusa Lembongan", "Indonesia", -8.6803, 115.45, 62, ["beach", "pool", "romantic"]],
  ["Ubud", "Indonesia", -8.5069, 115.2625, 95, ["pool", "countryside", "design"]],
  ["Canggu", "Indonesia", -8.6478, 115.1385, 110, ["beach", "remote-work", "pool"]],
  ["Paris", "France", 48.8566, 2.3522, 210, ["city", "romantic", "design"]],
  ["Athens", "Greece", 37.9838, 23.7275, 115, ["city", "history", "food"]],
  ["Barcelona", "Spain", 41.3874, 2.1686, 165, ["beach", "city", "food"]],
  ["Lisbon", "Portugal", 38.7223, -9.1393, 135, ["city", "budget", "remote-work"]],
  ["Cape Town", "South Africa", -33.9249, 18.4241, 145, ["beach", "mountain", "design"]]
];

const listingTemplates = [
  ["Entire villa", "Villa", "Old Town", 3, 2, 6],
  ["Design loft", "Loft", "Arts District", 1, 1, 2],
  ["Garden apartment", "Apartment", "Central", 2, 1, 4],
  ["Pool house", "House", "Harbor", 4, 3, 8],
  ["Quiet studio", "Studio", "Market Quarter", 1, 1, 2],
  ["Family suite", "Suite", "Riverside", 2, 2, 5]
];

const activityTemplates = [
  ["culture", "Gallery and architecture walk", "Civic Arts Hall"],
  ["food", "Chef pop-up weekend", "Central Market"],
  ["nightlife", "Late room sessions", "Basement Club"],
  ["outdoors", "Open-air cinema", "Riverside Park"],
  ["wellness", "Slow morning wellness session", "Wellness Studio"],
  ["water", "Waterfront ride", "Harbor Pier"]
];

const defaultPreferences = {
  language: "auto",
  currency: "USD",
  units: "metric",
  theme: "system",
  tripStyle: "balanced",
  tripPace: "relaxed",
  budgetPerNight: 180,
  searchRegion: "worldwide",
  notifTripAlerts: true,
  notifPriceDrops: true,
  notifNearby: false,
  notifMessages: true,
  twoFactor: false,
  locationSharing: "planning",
  aiMemory: "trip_preferences",
  mapRecommendations: true,
  interests: [],
  stayTypes: [],
  amenities: [],
  onboardingDone: false
};

const bookingsByUser = new Map();
const wishlistsByUser = new Map();
const preferencesByUser = new Map();
const reservationsByUser = new Map();

function slug(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function jitter(seedIndex, itemIndex, axis) {
  const multiplier = axis === "lat" ? 37 : 53;
  return (((seedIndex * multiplier + itemIndex * 17) % 48) - 24) / 1000;
}

function startsAt(seedIndex, itemIndex) {
  const date = new Date();
  date.setDate(date.getDate() + 2 + ((seedIndex * 3 + itemIndex * 2) % 45));
  date.setHours([10, 14, 17, 19, 20, 21][itemIndex % 6], 0, 0, 0);
  return date.toISOString();
}

function makeListings() {
  return cities.flatMap(([city, country, lat, lng, basePrice, tags], cityIndex) =>
    listingTemplates.map(([title, type, neighborhood, beds, baths, guests], index) => ({
      id: `stay-${slug(city)}-${index + 1}`,
      title: `${title} in ${city}`,
      type,
      city,
      neighborhood,
      country,
      address: `${neighborhood}, ${city}`,
      lat: Number((lat + jitter(cityIndex, index, "lat")).toFixed(6)),
      lng: Number((lng + jitter(cityIndex, index, "lng")).toFixed(6)),
      priceCents: (basePrice + index * 18) * 100,
      currency: "USD",
      beds,
      baths,
      guests,
      minNights: index % 2 === 0 ? 2 : 3,
      availableFrom: "2026-06-01",
      availableTo: "2026-12-31",
      rating: Number((4.72 + (index % 4) / 20).toFixed(2)),
      reviews: 74 + cityIndex * 13 + index * 9,
      superhost: index % 2 === 0,
      amenities: ["Wifi", "Kitchen", "Washer", index % 2 === 0 ? "Pool" : "Workspace"],
      tags,
      image: images[(cityIndex + index) % images.length],
      host: "Ainnb host"
    }))
  );
}

function makeEvents() {
  return cities.flatMap(([city, country, lat, lng], cityIndex) =>
    activityTemplates.map(([category, title, venue], index) => ({
      id: `event-${slug(city)}-${category}-${index + 1}`,
      title: `${city} ${title}`,
      city,
      country,
      venue,
      address: `${venue}, ${city}`,
      lat: Number((lat + jitter(cityIndex, index, "lat")).toFixed(6)),
      lng: Number((lng + jitter(cityIndex, index, "lng")).toFixed(6)),
      startsAt: startsAt(cityIndex, index),
      category,
      url: null,
      image: images[(cityIndex + index + 2) % images.length],
      priceCents: 1800 + ((cityIndex + index) % 8) * 600,
      currency: "USD",
      capacity: 80 + ((cityIndex + index) % 8) * 25,
      seatsLeft: 40 + ((cityIndex + index) % 6) * 12
    }))
  );
}

function makePlaces() {
  return cities.flatMap(([city, country, lat, lng], cityIndex) =>
    activityTemplates.map(([category, title, venue], index) => ({
      id: `place-${slug(city)}-${category}-${index + 1}`,
      title: `${city} ${title}`,
      city,
      country,
      address: `${venue}, ${city}`,
      lat: Number((lat + jitter(cityIndex, index, "lat")).toFixed(6)),
      lng: Number((lng + jitter(cityIndex, index, "lng")).toFixed(6)),
      category,
      website: null,
      image: images[(cityIndex + index + 4) % images.length]
    }))
  );
}

const listings = makeListings();
const events = makeEvents();
const places = makePlaces();

function envelope(data, meta = {}) {
  const count = Array.isArray(data) ? data.length : undefined;
  return { data, meta: { ...(count === undefined ? {} : { count }), ...meta } };
}

function error(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

function page(items, req) {
  const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 100);
  const cursor = req.query.cursor ? String(req.query.cursor) : null;
  const start = cursor ? Math.max(items.findIndex((item) => item.id === cursor) + 1, 0) : 0;
  const rows = items.slice(start, start + limit);
  const next = rows.length > 0 ? rows[rows.length - 1].id : null;
  const hasMore = start + rows.length < items.length;
  return envelope(rows, { hasMore, nextCursor: hasMore ? next : null });
}

function matchesText(query, values) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return true;
  return values.filter(Boolean).join(" ").toLowerCase().includes(normalized);
}

function currentUser(req) {
  return {
    id: String(req.auth.sub),
    email: req.auth.email,
    name: req.auth.name || "Traveler",
    avatarUrl: null
  };
}

function userList(map, userId) {
  if (!map.has(userId)) map.set(userId, []);
  return map.get(userId);
}

function userPreferences(userId) {
  if (!preferencesByUser.has(userId)) preferencesByUser.set(userId, { ...defaultPreferences });
  return preferencesByUser.get(userId);
}

function nightsBetween(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();
  const nights = Math.round((end - start) / (24 * 60 * 60 * 1000));
  return Number.isFinite(nights) && nights > 0 ? nights : 1;
}

function quote(listing, { checkIn, checkOut }) {
  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = Math.round((listing.priceCents / 100) * nights);
  const serviceFee = Math.round(subtotal * 0.14);
  const taxes = Math.round(subtotal * 0.09);
  return { nights, subtotal, serviceFee, taxes, total: subtotal + serviceFee + taxes };
}

function bookingFromInput(listing, input) {
  return {
    id: randomUUID(),
    homeId: listing.id,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    ...quote(listing, input),
    status: "confirmed",
    createdAt: new Date().toISOString()
  };
}

function stayReservationFromBooking(booking) {
  const listing = listings.find((item) => item.id === booking.homeId);
  return {
    ...booking,
    homeId: booking.homeId,
    item: listing,
    kind: "stay"
  };
}

function eventReservationFromInput(input) {
  const event = events.find((item) => item.id === input.eventId) || {};
  const tickets = input.tickets || 1;
  const subtotal = Math.round(((input.priceCents ?? event.priceCents ?? 2400) / 100) * tickets);
  const serviceFee = Math.round(subtotal * 0.1);
  const taxes = Math.round(subtotal * 0.08);
  return {
    id: randomUUID(),
    eventId: input.eventId,
    item: {
      city: input.city ?? event.city,
      country: input.country ?? event.country,
      image: input.image ?? event.image,
      startsAt: input.startsAt ?? event.startsAt,
      subtitle: input.venue ?? event.venue ?? "Experience",
      title: input.title ?? event.title ?? "Event reservation",
      venue: input.venue ?? event.venue
    },
    kind: "event",
    tickets,
    subtotal,
    serviceFee,
    taxes,
    total: subtotal + serviceFee + taxes,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };
}

pitsiApiRouter.get("/api/health", (_req, res) => {
  res.json(envelope({ ok: true, app: "ainnb", storage: "memory" }));
});

pitsiApiRouter.get("/api/listings", (req, res) => {
  const rows = listings
    .filter((item) => !req.query.city || item.city.toLowerCase().includes(String(req.query.city).toLowerCase()))
    .filter((item) => !req.query.tag || item.tags.includes(String(req.query.tag)))
    .filter((item) => !req.query.guests || item.guests >= Number(req.query.guests))
    .filter((item) => !req.query.maxPrice || item.priceCents <= Number(req.query.maxPrice) * 100)
    .filter((item) => matchesText(req.query.q, [item.title, item.city, item.country, item.neighborhood, item.type]))
    .sort((a, b) => b.rating - a.rating || a.id.localeCompare(b.id));
  res.json(page(rows, req));
});

pitsiApiRouter.get("/api/listings/:id", (req, res) => {
  const listing = listings.find((item) => item.id === req.params.id);
  if (!listing) return error(res, 404, "not_found", "Listing not found");
  res.json(envelope(listing));
});

pitsiApiRouter.get("/api/events", (req, res) => {
  const rows = events
    .filter((item) => !req.query.city || item.city.toLowerCase().includes(String(req.query.city).toLowerCase()))
    .filter((item) => !req.query.category || item.category === req.query.category)
    .filter((item) => matchesText(req.query.q, [item.title, item.city, item.venue]))
    .sort((a, b) => String(a.startsAt).localeCompare(String(b.startsAt)) || a.id.localeCompare(b.id));
  res.json(page(rows, req));
});

pitsiApiRouter.get("/api/events/:id", (req, res) => {
  const event = events.find((item) => item.id === req.params.id);
  if (!event) return error(res, 404, "not_found", "Event not found");
  res.json(envelope(event));
});

pitsiApiRouter.get("/api/places", (req, res) => {
  const rows = places
    .filter((item) => !req.query.city || item.city.toLowerCase().includes(String(req.query.city).toLowerCase()))
    .filter((item) => !req.query.category || item.category === req.query.category)
    .filter((item) => matchesText(req.query.q, [item.title, item.city, item.address]))
    .sort((a, b) => a.city.localeCompare(b.city) || a.title.localeCompare(b.title));
  res.json(page(rows, req));
});

pitsiApiRouter.get("/api/places/:id", (req, res) => {
  const place = places.find((item) => item.id === req.params.id);
  if (!place) return error(res, 404, "not_found", "Place not found");
  res.json(envelope(place));
});

pitsiApiRouter.get("/api/users/me", requireAuth, (req, res) => {
  res.json(envelope(currentUser(req)));
});

pitsiApiRouter.patch("/api/users/me", requireAuth, (req, res) => {
  res.json(envelope({ ...currentUser(req), name: req.body?.name || currentUser(req).name, avatarUrl: req.body?.image || null }));
});

pitsiApiRouter.get("/api/users/me/preferences", requireAuth, (req, res) => {
  res.json(envelope(userPreferences(String(req.auth.sub))));
});

pitsiApiRouter.patch("/api/users/me/preferences", requireAuth, (req, res) => {
  const userId = String(req.auth.sub);
  const next = { ...userPreferences(userId), ...(req.body || {}) };
  preferencesByUser.set(userId, next);
  res.json(envelope(next));
});

pitsiApiRouter.get("/api/wishlists", requireAuth, (req, res) => {
  res.json(envelope(userList(wishlistsByUser, String(req.auth.sub))));
});

pitsiApiRouter.post("/api/wishlists", requireAuth, (req, res) => {
  const { listingId } = req.body || {};
  if (!listingId) return error(res, 422, "validation_error", "listingId is required");
  const list = userList(wishlistsByUser, String(req.auth.sub));
  if (!list.includes(listingId)) list.unshift(listingId);
  res.status(201).json(envelope(list));
});

pitsiApiRouter.delete("/api/wishlists/:listingId", requireAuth, (req, res) => {
  const userId = String(req.auth.sub);
  const next = userList(wishlistsByUser, userId).filter((id) => id !== req.params.listingId);
  wishlistsByUser.set(userId, next);
  res.json(envelope(next));
});

pitsiApiRouter.get("/api/bookings/me", requireAuth, (req, res) => {
  res.json(envelope(userList(bookingsByUser, String(req.auth.sub))));
});

pitsiApiRouter.post("/api/bookings/quote", requireAuth, (req, res) => {
  const listing = listings.find((item) => item.id === req.body?.listingId);
  if (!listing) return error(res, 404, "not_found", "Listing not found");
  res.json(envelope(quote(listing, req.body || {})));
});

pitsiApiRouter.post("/api/bookings", requireAuth, (req, res) => {
  const { listingId, checkIn, checkOut, guests } = req.body || {};
  if (!listingId || !checkIn || !checkOut || !guests) {
    return error(res, 422, "validation_error", "listingId, checkIn, checkOut, and guests are required");
  }
  const listing = listings.find((item) => item.id === listingId);
  if (!listing) return error(res, 404, "not_found", "Listing not found");
  const booking = bookingFromInput(listing, { checkIn, checkOut, guests });
  userList(bookingsByUser, String(req.auth.sub)).unshift(booking);
  res.status(201).json(envelope(booking));
});

pitsiApiRouter.patch("/api/bookings/:id", requireAuth, (req, res) => {
  const booking = userList(bookingsByUser, String(req.auth.sub)).find((item) => item.id === req.params.id);
  if (!booking) return error(res, 404, "not_found", "Booking not found");
  booking.status = req.body?.status || "cancelled";
  res.json(envelope(booking));
});

pitsiApiRouter.get("/api/reservations", requireAuth, (req, res) => {
  const userId = String(req.auth.sub);
  const stays = userList(bookingsByUser, userId).map(stayReservationFromBooking);
  const reservations = userList(reservationsByUser, userId);
  res.json(envelope([...reservations, ...stays]));
});

pitsiApiRouter.post("/api/reservations", requireAuth, (req, res) => {
  const userId = String(req.auth.sub);
  if (req.body?.kind === "stay") {
    const listing = listings.find((item) => item.id === req.body.listingId);
    if (!listing) return error(res, 404, "not_found", "Listing not found");
    const booking = bookingFromInput(listing, req.body);
    userList(bookingsByUser, userId).unshift(booking);
    return res.status(201).json(envelope(stayReservationFromBooking(booking)));
  }
  if (req.body?.kind === "event") {
    const reservation = eventReservationFromInput(req.body);
    userList(reservationsByUser, userId).unshift(reservation);
    return res.status(201).json(envelope(reservation));
  }
  return error(res, 422, "validation_error", "Unsupported reservation kind");
});

pitsiApiRouter.patch("/api/reservations/:id", requireAuth, (req, res) => {
  const userId = String(req.auth.sub);
  const bookings = userList(bookingsByUser, userId);
  const booking = bookings.find((item) => item.id === req.params.id);
  if (booking) {
    Object.assign(booking, req.body?.status ? { status: req.body.status } : req.body || {});
    return res.json(envelope(stayReservationFromBooking(booking)));
  }
  const reservations = userList(reservationsByUser, userId);
  const reservation = reservations.find((item) => item.id === req.params.id);
  if (!reservation) return error(res, 404, "not_found", "Reservation not found");
  Object.assign(reservation, req.body?.status ? { status: req.body.status } : req.body || {});
  res.json(envelope(reservation));
});

pitsiApiRouter.get("/api/profile/summary", requireAuth, (req, res) => {
  const userId = String(req.auth.sub);
  const bookings = userList(bookingsByUser, userId);
  const reservations = userList(reservationsByUser, userId);
  const activeReservations = [...bookings, ...reservations].filter((item) => item.status !== "cancelled").length;
  res.json(
    envelope({
      profile: currentUser(req),
      stats: {
        activeReservations,
        eventReservations: reservations.filter((item) => item.kind === "event").length,
        historyReservations: [...bookings, ...reservations].filter((item) => item.status === "cancelled").length,
        stayReservations: bookings.length,
        theatreReservations: 0,
        wishlists: userList(wishlistsByUser, userId).length
      }
    })
  );
});
