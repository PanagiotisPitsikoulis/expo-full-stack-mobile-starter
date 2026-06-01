import { Router } from "express";
import { store } from "../db/store.js";
import { requireAuth } from "../middleware/auth.js";
import { hashPassword, publicNativeUser, signToken, verifyPassword } from "../services/auth.service.js";

export const mobileApiRouter = Router();

const theatreImages = [
  "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=1200&q=80"
];

const showImages = [
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80"
];

function envelope(data, meta = {}) {
  const count = Array.isArray(data) ? data.length : undefined;
  return { data, meta: { ...(count === undefined ? {} : { count }), ...meta } };
}

function imageFor(id, images) {
  const index = Math.abs(
    String(id)
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0)
  );
  return images[index % images.length];
}

function cityFromLocation(location = "") {
  return String(location).split(",")[0].trim() || "Athens";
}

function toNativeTheatre(theatre) {
  return {
    id: theatre.theatre_id,
    name: theatre.name,
    city: theatre.city || cityFromLocation(theatre.location),
    country: theatre.country || "Greece",
    location: theatre.location,
    description: theatre.description || "",
    image: theatre.image || imageFor(theatre.theatre_id, theatreImages),
    lat: Number(theatre.lat ?? 37.9838),
    lng: Number(theatre.lng ?? 23.7275),
    capacity: Number(theatre.capacity ?? 120)
  };
}

function genreFor(show) {
  const title = String(show.title || "").toLowerCase();
  if (title.includes("comedy")) return "Comedy";
  if (title.includes("mamma") || title.includes("cabaret")) return "Musical";
  if (title.includes("antigone") || title.includes("medea") || title.includes("hamlet")) return "Tragedy";
  return show.genre || "Drama";
}

function toNativeShow(show) {
  return {
    id: show.show_id,
    theatreId: show.theatre_id,
    title: show.title,
    description: show.description || "",
    durationMinutes: Number(show.duration ?? show.durationMinutes ?? 90),
    ageRating: show.age_rating || show.ageRating || "All",
    genre: genreFor(show),
    image: show.image || imageFor(show.show_id, showImages)
  };
}

function toNativeShowtime(showtime) {
  const show = showtime.show || {};
  return {
    id: showtime.showtime_id,
    showId: showtime.show_id,
    theatreId: showtime.theatre_id || show.theatre_id,
    startsAt: new Date(showtime.starts_at).toISOString(),
    hall: showtime.hall,
    totalSeats: Number(showtime.total_seats ?? showtime.totalSeats ?? 0)
  };
}

function toNativeSeat(seat) {
  return {
    id: seat.seat_id,
    showtimeId: seat.showtime_id,
    row: seat.row_label,
    number: Number(String(seat.seat_code).replace(/\D/g, "")) || 1,
    category: seat.category,
    reserved: seat.available === undefined ? Boolean(seat.reserved) : !seat.available
  };
}

function toNativeReservation(reservation) {
  return {
    id: reservation.reservation_id,
    userId: reservation.user_id || null,
    showtimeId: reservation.showtime_id,
    seatIds: (reservation.seats || []).map((seat) => seat.seat_id),
    totalCents: Math.round(Number(reservation.total_cost || 0) * 100),
    currency: "EUR",
    status: reservation.status,
    createdAt: new Date(reservation.created_at || Date.now()).toISOString()
  };
}

function sendAuth(res, user, status = 200) {
  const token = signToken(user);
  res.set("set-auth-token", token);
  res.status(status).json({ token, user: publicNativeUser(user) });
}

mobileApiRouter.post("/api/auth/sign-up/email", async (req, res, next) => {
  try {
    const { email, name, password } = req.body || {};
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ message: "Name, email, and an 8 character password are required" });
    }

    const user = await store.createUser({
      name,
      email,
      password_hash: await hashPassword(password)
    });
    sendAuth(res, user, 201);
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.post("/api/auth/sign-in/email", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const user = email ? await store.findUserByEmail(email) : null;
    if (!user || !(await verifyPassword(password || "", user.password_hash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.post("/api/auth/sign-out", (_req, res) => {
  res.json({ ok: true });
});

mobileApiRouter.get("/api/theatres", async (req, res, next) => {
  try {
    const q = String(req.query.q || req.query.city || "").toLowerCase();
    const theatres = (await store.listTheatres())
      .map(toNativeTheatre)
      .filter((theatre) => {
        if (!q) return true;
        return [theatre.name, theatre.city, theatre.country, theatre.location]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    res.json(envelope(theatres));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.get("/api/theatres/:id", async (req, res, next) => {
  try {
    const theatre = (await store.listTheatres()).find((item) => item.theatre_id === req.params.id);
    if (!theatre) return res.status(404).json({ error: "Theatre not found" });
    res.json(envelope(toNativeTheatre(theatre)));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.get("/api/shows", async (req, res, next) => {
  try {
    const shows = await store.listShows({
      q: req.query.q,
      theatreId: req.query.theatreId,
      date: req.query.date
    });
    res.json(envelope(shows.map(toNativeShow)));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.get("/api/shows/:id", async (req, res, next) => {
  try {
    const show = (await store.listShows()).find((item) => item.show_id === req.params.id);
    if (!show) return res.status(404).json({ error: "Show not found" });
    res.json(envelope(toNativeShow(show)));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.get("/api/showtimes", async (req, res, next) => {
  try {
    const showtimes = (await store.listShowtimes(req.query.showId))
      .map(toNativeShowtime)
      .filter((showtime) => !req.query.theatreId || showtime.theatreId === req.query.theatreId);
    res.json(envelope(showtimes));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.get("/api/showtimes/:id", async (req, res, next) => {
  try {
    const showtime = (await store.listShowtimes())
      .map(toNativeShowtime)
      .find((item) => item.id === req.params.id);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    res.json(envelope(showtime));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.get("/api/seats", async (req, res, next) => {
  try {
    if (!req.query.showtimeId) {
      return res.status(400).json({ error: "showtimeId is required" });
    }
    res.json(envelope((await store.listSeats(req.query.showtimeId)).map(toNativeSeat)));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.get("/api/theatre-reservations", requireAuth, async (req, res, next) => {
  try {
    const reservations = await store.listUserReservations(req.auth.sub);
    res.json(envelope(reservations.map(toNativeReservation)));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.post("/api/theatre-reservations", requireAuth, async (req, res, next) => {
  try {
    const { showtimeId, seatIds } = req.body || {};
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ error: "showtimeId and seatIds are required" });
    }
    const reservation = await store.createReservation({ userId: req.auth.sub, showtimeId, seatIds });
    res.status(201).json(envelope(toNativeReservation(reservation)));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.get("/api/theatre-reservations/:id", requireAuth, async (req, res, next) => {
  try {
    const reservation = await store.getReservation(req.auth.sub, req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json(envelope(toNativeReservation(reservation)));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.patch("/api/theatre-reservations/:id", requireAuth, async (req, res, next) => {
  try {
    const { seatIds } = req.body || {};
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ error: "seatIds are required" });
    }
    const reservation = await store.updateReservation(req.auth.sub, req.params.id, { seatIds });
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json(envelope(toNativeReservation(reservation)));
  } catch (error) {
    next(error);
  }
});

mobileApiRouter.delete("/api/theatre-reservations/:id", requireAuth, async (req, res, next) => {
  try {
    const reservation = await store.cancelReservation(req.auth.sub, req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json(envelope({ id: req.params.id, status: reservation.status }));
  } catch (error) {
    next(error);
  }
});
