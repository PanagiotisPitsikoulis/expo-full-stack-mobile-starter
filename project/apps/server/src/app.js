import cors from "cors";
import express from "express";
import { catalogRouter } from "./routes/catalog.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { reservationRouter } from "./routes/reservation.routes.js";
import { mobileApiRouter } from "./routes/mobile-api.routes.js";
import { aiRouter } from "./routes/ai.routes.js";
import { pitsiApiRouter } from "./routes/pitsi-api.routes.js";
import { store } from "./db/store.js";

export function createApp() {
  const app = express();

  app.use(cors({ exposedHeaders: ["set-auth-token"] }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, db: store.mode });
  });

  app.use(authRouter);
  app.use(catalogRouter);
  app.use(pitsiApiRouter);
  app.use(mobileApiRouter);
  app.use(aiRouter);
  app.use(reservationRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
  });

  app.use((error, _req, res, _next) => {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || "Unexpected server error" });
  });

  return app;
}
