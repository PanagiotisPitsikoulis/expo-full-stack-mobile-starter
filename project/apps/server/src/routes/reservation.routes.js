import { Router } from "express";
import { store } from "../db/store.js";
import { requireAuth } from "../middleware/auth.js";

export const reservationRouter = Router();

reservationRouter.use(requireAuth);

reservationRouter.post("/reservations", async (req, res, next) => {
  try {
    const { showtimeId, seatIds } = req.body || {};
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ error: "showtimeId and seatIds are required" });
    }
    const reservation = await store.createReservation({
      userId: req.auth.sub,
      showtimeId,
      seatIds
    });
    res.status(201).json({ data: reservation });
  } catch (error) {
    next(error);
  }
});

reservationRouter.patch("/reservations/:id", async (req, res, next) => {
  try {
    const { seatIds } = req.body || {};
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ error: "seatIds are required" });
    }
    const reservation = await store.updateReservation(req.auth.sub, req.params.id, { seatIds });
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json({ data: reservation });
  } catch (error) {
    next(error);
  }
});

reservationRouter.delete("/reservations/:id", async (req, res, next) => {
  try {
    const reservation = await store.cancelReservation(req.auth.sub, req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json({ data: reservation });
  } catch (error) {
    next(error);
  }
});

reservationRouter.get("/user/reservations", async (req, res, next) => {
  try {
    res.json({ data: await store.listUserReservations(req.auth.sub) });
  } catch (error) {
    next(error);
  }
});
