import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApp } from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("health reports working API", async () => {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
});

test("register, browse, reserve, and list user reservations", async () => {
  const email = `student-${Date.now()}@example.com`;
  const register = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Student", email, password: "password123" })
  });
  const auth = await register.json();
  assert.equal(register.status, 201);
  assert.ok(auth.token);

  const shows = await (await fetch(`${baseUrl}/shows?q=Athens`)).json();
  assert.equal(shows.data.length, 1);

  const showtimes = await (await fetch(`${baseUrl}/showtimes?showId=${shows.data[0].show_id}`)).json();
  const seats = await (await fetch(`${baseUrl}/seats?showtimeId=${showtimes.data[0].showtime_id}`)).json();
  const seatId = seats.data.find((seat) => seat.available).seat_id;

  const reservationResponse = await fetch(`${baseUrl}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`
    },
    body: JSON.stringify({ showtimeId: showtimes.data[0].showtime_id, seatIds: [seatId] })
  });
  const reservation = await reservationResponse.json();
  assert.equal(reservationResponse.status, 201);
  assert.equal(reservation.data.seats.length, 1);

  const history = await fetch(`${baseUrl}/user/reservations`, {
    headers: { Authorization: `Bearer ${auth.token}` }
  });
  const historyBody = await history.json();
  assert.equal(history.status, 200);
  assert.equal(historyBody.data.length, 1);
});

test("native app API supports email auth and theatre reservations", async () => {
  const email = `native-${Date.now()}@example.com`;
  const signup = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Native Student", email, password: "password123" })
  });
  const auth = await signup.json();
  assert.equal(signup.status, 201);
  assert.ok(auth.token);
  assert.ok(auth.user.id);

  const theatres = await (await fetch(`${baseUrl}/api/theatres`)).json();
  assert.ok(theatres.data[0].id);
  assert.ok(theatres.data[0].country);

  const shows = await (await fetch(`${baseUrl}/api/shows?theatreId=${theatres.data[0].id}`)).json();
  const showtimes = await (await fetch(`${baseUrl}/api/showtimes?theatreId=${theatres.data[0].id}`)).json();
  const seats = await (await fetch(`${baseUrl}/api/seats?showtimeId=${showtimes.data[0].id}`)).json();
  const seatId = seats.data.find((seat) => !seat.reserved).id;

  const reservationResponse = await fetch(`${baseUrl}/api/theatre-reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`
    },
    body: JSON.stringify({ showtimeId: showtimes.data[0].id, seatIds: [seatId] })
  });
  const reservation = await reservationResponse.json();
  assert.equal(reservationResponse.status, 201);
  assert.equal(reservation.data.seatIds[0], seatId);
  assert.equal(reservation.data.showtimeId, showtimes.data[0].id);

  const detail = await fetch(`${baseUrl}/api/shows/${shows.data[0].id}`);
  assert.equal(detail.status, 200);
});

test("AI concierge API exposes status and local catalogue fallback", async () => {
  const status = await fetch(`${baseUrl}/api/ai/concierge`);
  const statusBody = await status.json();
  assert.equal(status.status, 200);
  assert.ok(statusBody.data.tools.includes("search_theatres"));

  const response = await fetch(`${baseUrl}/api/ai/concierge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "find theatre shows in Athens" })
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.view, "activities");
  assert.ok(body.data.toolResults.theatres.length > 0);
});

test("Pitsi-style native data API supports listings, events, preferences, wishlist, bookings, and reservations", async () => {
  const email = `pitsi-${Date.now()}@example.com`;
  const signup = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Pitsi Native", email, password: "password123" })
  });
  const auth = await signup.json();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`
  };

  const listings = await (await fetch(`${baseUrl}/api/listings?limit=3`)).json();
  assert.equal(listings.data.length, 3);
  assert.ok(listings.data[0].priceCents);
  assert.equal(listings.meta.hasMore, true);

  const listingDetail = await fetch(`${baseUrl}/api/listings/${listings.data[0].id}`);
  assert.equal(listingDetail.status, 200);

  const events = await (await fetch(`${baseUrl}/api/events?limit=2`)).json();
  assert.equal(events.data.length, 2);

  const places = await (await fetch(`${baseUrl}/api/places?category=culture&limit=2`)).json();
  assert.equal(places.data.length, 2);
  assert.equal(places.data[0].category, "culture");

  const preferences = await (await fetch(`${baseUrl}/api/users/me/preferences`, { headers })).json();
  assert.equal(preferences.data.theme, "system");

  const updatedPreferences = await fetch(`${baseUrl}/api/users/me/preferences`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ theme: "dark", onboardingDone: true })
  });
  const updatedPreferencesBody = await updatedPreferences.json();
  assert.equal(updatedPreferences.status, 200);
  assert.equal(updatedPreferencesBody.data.theme, "dark");
  assert.equal(updatedPreferencesBody.data.onboardingDone, true);

  const wishlist = await fetch(`${baseUrl}/api/wishlists`, {
    method: "POST",
    headers,
    body: JSON.stringify({ listingId: listings.data[0].id })
  });
  const wishlistBody = await wishlist.json();
  assert.equal(wishlist.status, 201);
  assert.equal(wishlistBody.data[0], listings.data[0].id);

  const booking = await fetch(`${baseUrl}/api/bookings`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      listingId: listings.data[0].id,
      checkIn: "2026-07-04",
      checkOut: "2026-07-06",
      guests: 2
    })
  });
  const bookingBody = await booking.json();
  assert.equal(booking.status, 201);
  assert.equal(bookingBody.data.homeId, listings.data[0].id);

  const reservations = await (await fetch(`${baseUrl}/api/reservations`, { headers })).json();
  assert.equal(reservations.data.length, 1);
  assert.equal(reservations.data[0].kind, "stay");

  const eventReservation = await fetch(`${baseUrl}/api/reservations`, {
    method: "POST",
    headers,
    body: JSON.stringify({ kind: "event", eventId: events.data[0].id, tickets: 2 })
  });
  const eventReservationBody = await eventReservation.json();
  assert.equal(eventReservation.status, 201);
  assert.equal(eventReservationBody.data.kind, "event");

  const summary = await (await fetch(`${baseUrl}/api/profile/summary`, { headers })).json();
  assert.equal(summary.data.stats.stayReservations, 1);
  assert.equal(summary.data.stats.eventReservations, 1);
  assert.equal(summary.data.stats.wishlists, 1);
});
