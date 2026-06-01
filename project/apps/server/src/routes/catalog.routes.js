import { Router } from "express";
import { store } from "../db/store.js";

export const catalogRouter = Router();

catalogRouter.get("/theatres", async (_req, res, next) => {
  try {
    res.json({ data: await store.listTheatres() });
  } catch (error) {
    next(error);
  }
});

catalogRouter.get("/shows", async (req, res, next) => {
  try {
    res.json({
      data: await store.listShows({
        q: req.query.q,
        theatreId: req.query.theatreId,
        title: req.query.title,
        date: req.query.date,
        location: req.query.location
      })
    });
  } catch (error) {
    next(error);
  }
});

catalogRouter.get("/showtimes", async (req, res, next) => {
  try {
    res.json({ data: await store.listShowtimes(req.query.showId) });
  } catch (error) {
    next(error);
  }
});

catalogRouter.get("/seats", async (req, res, next) => {
  try {
    if (!req.query.showtimeId) {
      return res.status(400).json({ error: "showtimeId is required" });
    }
    res.json({ data: await store.listSeats(req.query.showtimeId) });
  } catch (error) {
    next(error);
  }
});
