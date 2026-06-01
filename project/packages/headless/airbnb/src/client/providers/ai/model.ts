import type {
  AiAssistantPayload,
  AiChatMessage,
  AiMapPoint,
  Home,
  NearbyActivity,
} from "@repo/airbnb-core/domain";

export type AiChatSession = {
  id: string;
  messages: AiChatMessage[];
  title: string;
  updatedAt: number;
};

export type AiChatSessionSummary = {
  id: string;
  title: string;
};

export type ConciergeView = "homes" | "activities" | "map" | "budget" | "itinerary" | "clarify";

export type ConciergeResponse = {
  activityIds: string[];
  budget: {
    note: string;
    rows: Array<{ label: string; value: string }>;
    title: string;
  } | null;
  chips: string[];
  homeIds: string[];
  itinerary: {
    steps: string[];
    title: string;
  } | null;
  message: string;
  view: ConciergeView;
};

export type TravelData = {
  homes: Home[];
  homesById: Record<string, Home>;
  nearbyActivities: NearbyActivity[];
  searchHomes: (query: string) => Home[];
};

export const AI_ACTIVE_CHAT_ID_KEY = "ainnb-ai-active-chat-id";
export const AI_CHAT_SESSIONS_KEY = "ainnb-ai-chat-sessions";
export const NEW_CHAT_TITLE = "New chat";

export const tripMapPlaces: AiMapPoint[] = [
  {
    coordinate: [139.7046, 35.694],
    emoji: "🍜",
    id: "place-tokyo-ramen",
    meta: "12 min from loft stays",
    subtitle: "Shinjuku, Tokyo",
    title: "Ramen Nagi Golden Gai",
    type: "place",
  },
  {
    coordinate: [115.2633, -8.5069],
    emoji: "☕",
    id: "place-ubud-cafe",
    meta: "8 min from pool villas",
    subtitle: "Sayan, Ubud",
    title: "Sayan ridge cafe",
    type: "place",
  },
  {
    coordinate: [2.363, 48.862],
    emoji: "🥖",
    id: "place-paris-market",
    meta: "6 min from central apartments",
    subtitle: "Le Marais, Paris",
    title: "Marche des Enfants Rouges",
    type: "place",
  },
];

export const tripMapEvents: AiMapPoint[] = [
  {
    coordinate: [139.6688, 35.6627],
    emoji: "🎷",
    id: "event-tokyo-jazz",
    meta: "$18 cover",
    subtitle: "Tonight, 8:30 PM",
    title: "Shimokitazawa live jazz night",
    type: "event",
  },
  {
    coordinate: [115.2625, -8.5193],
    emoji: "🛍️",
    id: "event-ubud-market",
    meta: "Free entry",
    subtitle: "Friday, 6:00 PM",
    title: "Ubud artisan night market",
    type: "event",
  },
  {
    coordinate: [2.3544, 48.8606],
    emoji: "🎨",
    id: "event-paris-gallery",
    meta: "$12 ticket",
    subtitle: "Saturday, 7:00 PM",
    title: "Late gallery walk",
    type: "event",
  },
];

let fallbackIdCounter = 0;

export function createAiMessageId(prefix: string) {
  const runtimeCrypto = globalThis as typeof globalThis & {
    crypto?: { randomUUID?: () => string };
  };
  const randomUUID = runtimeCrypto.crypto?.randomUUID;
  if (randomUUID) {
    return `${prefix}-${randomUUID()}`;
  }

  fallbackIdCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${fallbackIdCounter.toString(36)}`;
}

export function createAiChatSession(): AiChatSession {
  return {
    id: createAiMessageId("chat"),
    messages: [],
    title: NEW_CHAT_TITLE,
    updatedAt: Date.now(),
  };
}

export function deriveTitle(text: string) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return NEW_CHAT_TITLE;
  return trimmed.length > 34 ? `${trimmed.slice(0, 31)}...` : trimmed;
}

export function summarizeAiSessions(sessions: AiChatSession[]): AiChatSessionSummary[] {
  return sessions.map((session) => ({ id: session.id, title: session.title }));
}

export function normalizeAiChatSessions(value: unknown): AiChatSession[] | null {
  if (!Array.isArray(value)) return null;
  const sessions = value
    .map((session): AiChatSession | null => {
      if (!session || typeof session !== "object") return null;
      const candidate = session as Partial<AiChatSession>;
      if (typeof candidate.id !== "string" || typeof candidate.title !== "string") return null;
      if (!Array.isArray(candidate.messages)) return null;
      return {
        id: candidate.id,
        messages: candidate.messages.filter(isAiChatMessage),
        title: candidate.title,
        updatedAt: typeof candidate.updatedAt === "number" ? candidate.updatedAt : Date.now(),
      };
    })
    .filter((session): session is AiChatSession => Boolean(session));
  return sessions.length > 0 ? sessions : null;
}

export function historyFromMessages(messages: AiChatMessage[]) {
  return messages
    .filter((message) => message.text.trim().length > 0)
    .slice(-12)
    .map((message) => ({
      content: message.text,
      role: message.role === "user" ? ("user" as const) : ("assistant" as const),
    }));
}

export function likesFromHomes(homes: Home[]) {
  return homes.slice(0, 12).map((home) => `${home.title}, ${home.city}`);
}

export function mostCommonCity(homes: Home[]): string | undefined {
  const counts = new Map<string, number>();
  for (const home of homes) {
    counts.set(home.city, (counts.get(home.city) ?? 0) + 1);
  }
  let best: string | undefined;
  let bestCount = 0;
  for (const [city, count] of counts) {
    if (count > bestCount) {
      best = city;
      bestCount = count;
    }
  }
  return best;
}

export function responsePayloadFor(
  response: ConciergeResponse,
  prompt: string,
  data: TravelData,
): { chips: string[]; homeIds: string[]; payload?: AiAssistantPayload; text: string } {
  const homeIds = response.homeIds;
  const activityIds = response.activityIds;
  const recommendedHomes = homeIds
    .map((homeId) => data.homesById[homeId])
    .filter((home): home is Home => Boolean(home));
  const recommendedActivities = activityIds
    .map((activityId) => data.nearbyActivities.find((activity) => activity.id === activityId))
    .filter((activity): activity is NearbyActivity => Boolean(activity));
  const chips = response.chips.slice(0, 4);
  const view = response.view;
  // The LLM's own message is the source of truth for the chat bubble. We never
  // synthesize a canned "Got it. I pulled 6 stays..." line; if the model didn't
  // produce a message, we show a minimal honest placeholder.
  const text = (response.message || "").trim();

  if (view === "activities" && (recommendedActivities.length > 0 || recommendedHomes.length > 0)) {
    return {
      chips,
      homeIds,
      payload: {
        activities:
          recommendedActivities.length > 0
            ? recommendedActivities
            : matchActivities(prompt, recommendedHomes, data),
        kind: "activities",
        map: true,
        title: "Activities for your trip",
      },
      text,
    };
  }

  if (view === "map" && recommendedHomes.length > 0) {
    return {
      chips,
      homeIds,
      payload: {
        events: tripMapEvents,
        homes: recommendedHomes.slice(0, 3),
        kind: "trip-map",
        places: tripMapPlaces,
        title: "Stay, places, and events map",
      },
      text,
    };
  }

  if (view === "budget" && response.budget) {
    return {
      chips,
      homeIds,
      payload: {
        kind: "budget",
        note: response.budget.note,
        rows: response.budget.rows.map(({ label, value }) => [label, value]),
        title: response.budget.title,
      },
      text,
    };
  }

  if (view === "itinerary" && response.itinerary) {
    return {
      chips,
      homeIds,
      payload: {
        kind: "itinerary",
        steps: response.itinerary.steps,
        title: response.itinerary.title,
      },
      text,
    };
  }

  // Clarify view = a plain conversational reply (greeting, off-topic, missing
  // info). Render as a chat bubble with no homes widget. Chips only show if the
  // model actually proposed them.
  if (view === "clarify") {
    if (chips.length === 0) {
      return { chips: [], homeIds: [], text: text || "" };
    }
    return {
      chips,
      homeIds: [],
      payload: { chips, kind: "clarify" },
      text,
    };
  }

  if (recommendedHomes.length > 0) {
    return {
      chips,
      homeIds,
      payload: {
        chips: chips.length > 0 ? chips : ["Best fit", "Show map", "Plan a weekend"],
        homes: recommendedHomes,
        kind: "homes",
        title: "Recommended stays",
      },
      text,
    };
  }

  // Anything else (no payload-eligible data) is a plain chat bubble.
  return { chips, homeIds: [], text: text || "" };
}

function isAiChatMessage(value: unknown): value is AiChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<AiChatMessage>;
  return (
    typeof message.id === "string" &&
    (message.role === "ai" || message.role === "user") &&
    typeof message.text === "string"
  );
}

function matchActivities(prompt: string, matches: Home[], data: TravelData): NearbyActivity[] {
  const promptLower = prompt.toLowerCase();
  const cities = new Set(matches.map((home) => home.city.toLowerCase()));
  const direct = data.nearbyActivities.filter(
    (activity) =>
      promptLower.includes(activity.city.toLowerCase()) ||
      promptLower.includes(activity.area.toLowerCase()) ||
      cities.has(activity.city.toLowerCase()) ||
      promptLower.includes(activity.mood.toLowerCase()),
  );

  return (direct.length > 0 ? direct : data.nearbyActivities).slice(0, 5);
}
