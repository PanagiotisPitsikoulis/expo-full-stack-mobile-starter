import { Router } from "express";
import { store } from "../db/store.js";

export const aiRouter = Router();

function envelope(data, meta = {}) {
  return { data, meta };
}

function providerStatus() {
  const provider = process.env.ANTHROPIC_API_KEY
    ? "anthropic"
    : process.env.OPENAI_API_KEY
      ? "openai"
      : "local-fallback";
  return {
    configured: provider !== "local-fallback",
    provider,
    selectedModel:
      provider === "anthropic"
        ? (process.env.AINNB_ANTHROPIC_MODEL || "claude-sonnet-4-6")
        : provider === "openai"
          ? (process.env.AINNB_OPENAI_MODEL || "gpt-5.5")
          : "local-catalog",
    tools: ["search_theatres", "search_shows", "search_showtimes", "search_seats"]
  };
}

function promptFromBody(body = {}) {
  if (typeof body.message === "string") return body.message;
  if (typeof body.input === "string") return body.input;
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = [...messages].reverse().find((message) => typeof message?.content === "string");
  return last?.content || "";
}

async function localConciergeResponse(prompt) {
  const lower = prompt.toLowerCase();
  const theatres = await store.listTheatres();
  const shows = await store.listShows();
  const showtimes = await store.listShowtimes();

  if (lower.includes("show") || lower.includes("theatre") || lower.includes("theater")) {
    return {
      chips: ["Show theatres", "Find showtimes", "Reserve seats"],
      message: `I found ${theatres.length} theatres and ${shows.length} shows in the local catalogue.`,
      view: "activities",
      toolResults: {
        theatres: theatres.slice(0, 5),
        shows: shows.slice(0, 5),
        showtimes: showtimes.slice(0, 5)
      }
    };
  }

  return {
    chips: ["Show theatres", "Find shows", "Reserve seats"],
    message: "Ask for theatres, shows, showtimes, or seat availability and I can use the local catalogue.",
    view: "clarify",
    toolResults: {
      theatres: theatres.slice(0, 3)
    }
  };
}

aiRouter.get("/api/ai/concierge", (_req, res) => {
  res.json(envelope(providerStatus()));
});

aiRouter.post("/api/ai/concierge", async (req, res, next) => {
  try {
    const payload = await localConciergeResponse(promptFromBody(req.body));

    if (String(req.headers.accept || "").includes("text/event-stream")) {
      res.writeHead(200, {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream"
      });
      res.write(`event: message\ndata: ${JSON.stringify({ content: payload.message, type: "text" })}\n\n`);
      res.write(`event: tool-result\ndata: ${JSON.stringify(payload)}\n\n`);
      res.end();
      return;
    }

    res.json(envelope(payload, providerStatus()));
  } catch (error) {
    next(error);
  }
});
