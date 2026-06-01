import type {
  AiAssistantPayload,
  AiChatMessage,
  Home,
  NearbyActivity,
} from "@repo/airbnb-core/domain";
import { ChatClient, type UIMessage, xhrServerSentEvents } from "@tanstack/ai-client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StorageAdapter } from "../../adapters";
import type { UserPreferencesValue } from "../../preferences";
import { createStorageIo } from "../../sync/keys";
import type { AppDataValue } from "../app-data";
import type { CustomerTripValue } from "../customer-trip";
import {
  AI_ACTIVE_CHAT_ID_KEY,
  AI_CHAT_SESSIONS_KEY,
  type AiChatSession,
  createAiChatSession,
  createAiMessageId,
  deriveTitle,
  historyFromMessages,
  likesFromHomes,
  mostCommonCity,
  NEW_CHAT_TITLE,
  normalizeAiChatSessions,
  summarizeAiSessions,
} from "./model";

export type AiFeatureValue = {
  actions: {
    chipPress: (chip: string) => void;
    deleteAllChats: () => void;
    deleteChat: (id: string) => void;
    newChat: () => void;
    selectChat: (id: string) => void;
    send: (override?: string) => void;
    setInput: (value: string) => void;
  };
  state: {
    activeId: string;
    chips: string[];
    input: string;
    messages: AiChatMessage[];
    sending: boolean;
    sessions: Array<{ id: string; title: string }>;
  };
};

/** Last assistant message in the wire history, or undefined. */
function lastAssistantMessage(messages: UIMessage[]): UIMessage | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message && message.role === "assistant") return message;
  }
  return undefined;
}

/**
 * Concatenate the streamed text parts of one assistant message. TanStack AI
 * `TextPart` uses `content`, but some adapters/devtools snapshots have also
 * exposed `text` or `delta`; accept all three so a valid stream never becomes
 * an empty bubble because of a wire-shape mismatch.
 */
function extractStreamingText(message: UIMessage | undefined): string {
  if (!message) return "";
  const out: string[] = [];
  const directContent = (message as { content?: unknown }).content;
  if (typeof directContent === "string") out.push(directContent);
  for (const part of message.parts) {
    if (part.type !== "text") continue;
    const textPart = part as { content?: unknown; delta?: unknown; text?: unknown };
    const chunk = textPart.content ?? textPart.text ?? textPart.delta;
    if (typeof chunk === "string") {
      out.push(chunk);
    }
  }
  return out.join("").trim();
}

type ToolResultJson = unknown;
type ToolCall = { id: string; name: string; input?: unknown };
type ScopedEvent = CustomerTripValue["state"]["scope"]["events"][number];

export type AiPendingAction =
  | { kind: "set_destination"; city: string }
  | { kind: "change_category"; id: string }
  | { kind: "open_screen"; screen: "home" | "map" | "activities" | "trips" | "wishlists" }
  | {
      kind: "start_reservation";
      homeId: string;
      guests?: number;
      checkIn?: string;
      checkOut?: string;
    }
  | { kind: "cancel_reservation"; reservationId: string };

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asActivityCategory(value: unknown): NearbyActivity["category"] {
  const normalized = asString(value)?.toLowerCase();
  if (
    normalized === "water" ||
    normalized === "food" ||
    normalized === "culture" ||
    normalized === "outdoors" ||
    normalized === "nightlife" ||
    normalized === "wellness"
  ) {
    return normalized;
  }
  return "culture";
}

const activityMeta: Record<NearbyActivity["category"], { emoji: string; mood: string }> = {
  culture: { emoji: "🎭", mood: "Culture" },
  food: { emoji: "🍽️", mood: "Food" },
  nightlife: { emoji: "🎶", mood: "Night" },
  outdoors: { emoji: "🧭", mood: "Outdoor" },
  water: { emoji: "🌊", mood: "Water" },
  wellness: { emoji: "🧘", mood: "Wellness" },
};

function activityFromToolRow(
  row: Record<string, unknown>,
  fallbackImage: NearbyActivity["image"],
): NearbyActivity | null {
  const id = asString(row.id);
  const title = asString(row.title) ?? asString(row.name);
  if (!id || !title) return null;

  const category = asActivityCategory(row.category ?? row.genre);
  const meta = activityMeta[category];
  const duration = asNumber(row.durationMinutes)
    ? `${asNumber(row.durationMinutes)} min`
    : (asString(row.startsAt) ?? "Plan ahead");
  const price = asNumber(row.priceCents)
    ? `$${Math.round((asNumber(row.priceCents) ?? 0) / 100)}`
    : "Details";

  return {
    area: asString(row.address) ?? asString(row.location) ?? asString(row.venue) ?? "Nearby",
    category,
    city: asString(row.city) ?? "",
    distance: "Nearby",
    duration,
    emoji: meta.emoji,
    id,
    image: fallbackImage,
    mood: meta.mood,
    price,
    title,
  };
}

function toolInputFromPart(part: { arguments?: unknown; input?: unknown }): unknown {
  if (part.input && typeof part.input === "object") return part.input;
  if (typeof part.arguments !== "string" || part.arguments.trim().length === 0) return {};

  try {
    return JSON.parse(part.arguments);
  } catch {
    return {};
  }
}

function parsedToolResult(value: unknown): ToolResultJson | undefined {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  try {
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function rowsFromToolResult(value: ToolResultJson): Array<Record<string, unknown>> {
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }
  if (!isRecord(value)) return [];

  for (const key of [
    "data",
    "rows",
    "items",
    "results",
    "homes",
    "activities",
    "events",
    "theatres",
    "shows",
    "showtimes",
  ]) {
    const rows = value[key];
    if (Array.isArray(rows)) return rows.filter(isRecord);
  }

  return [];
}

function uniqueSorted(values: Array<string | undefined | null>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort(
    (a, b) => a.localeCompare(b),
  );
}

function compactHome(home: Home) {
  return {
    amenities: home.amenities,
    city: home.city,
    country: home.country,
    guests: home.guests,
    id: home.id,
    lat: home.lat,
    lng: home.lng,
    neighborhood: home.neighborhood,
    pricePerNight: home.pricePerNight,
    rating: home.rating,
    tags: home.tags,
    title: home.title,
    type: home.type,
  };
}

function compactActivity(activity: NearbyActivity) {
  return {
    area: activity.area,
    category: activity.category,
    city: activity.city,
    distance: activity.distance,
    duration: activity.duration,
    id: activity.id,
    mood: activity.mood,
    price: activity.price,
    title: activity.title,
  };
}

function compactEvent(event: ScopedEvent) {
  return {
    address: asString(event.address),
    category: asString(event.category),
    city: asString(event.city),
    country: asString(event.country),
    id: event.id,
    lat: asNumber(event.lat),
    lng: asNumber(event.lng),
    source: asString(event.source),
    startsAt: asString(event.startsAt),
    title: event.title,
    venue: asString(event.venue),
  };
}

function buildKnownContext({
  appData,
  trip,
  preferences,
}: {
  appData: AppDataValue["state"];
  preferences: UserPreferencesValue | null;
  trip: CustomerTripValue;
}) {
  const homes = appData.listings.homes;
  const activities = appData.activities.nearby;
  const events = appData.realData.events;
  const preferenceData = preferences?.preferences ?? null;
  const shouldShareDetectedLocation = preferenceData?.locationSharing !== "never";
  const cityRows = uniqueSorted(homes.map((home) => home.city)).map((city) => {
    const cityHomes = homes.filter((home) => home.city === city);
    return {
      city,
      countries: uniqueSorted(cityHomes.map((home) => home.country)),
      homeCount: cityHomes.length,
    };
  });

  return {
    catalog: {
      activityCount: activities.length,
      cities: cityRows,
      eventCount: events.length,
      homeCount: homes.length,
      realDataStatus: appData.realData.status,
      realDataWarning: appData.realData.warning ?? null,
    },
    currentTrip: {
      activeDestination: trip.state.areaLabel,
      checkIn: trip.state.form.checkIn || null,
      checkOut: trip.state.form.checkOut || null,
      detectedCountry: shouldShareDetectedLocation ? trip.state.detectedCountry : null,
      draftDestination: trip.state.form.destination || null,
      guests: trip.state.form.guests,
      resultCount: trip.meta.resultCount,
      routeLabel: trip.state.routeLabel,
    },
    filters: {
      activity: appData.activityFilters.value,
      activityFilterCount: appData.activityFilters.count,
      activityFiltersActive: appData.activityFilters.isActive,
      stay: appData.filters.value,
      stayFilterCount: appData.filters.count,
      stayFiltersActive: appData.filters.isActive,
    },
    preferences: preferenceData
      ? {
          aiMemory: preferenceData.aiMemory,
          amenities: preferenceData.amenities,
          budgetPerNight: preferenceData.budgetPerNight,
          currency: preferenceData.currency,
          interests: preferenceData.interests,
          isAuthenticated: preferences?.isAuthenticated ?? false,
          locationSharing: preferenceData.locationSharing,
          mapRecommendations: preferenceData.mapRecommendations,
          searchRegion: preferenceData.searchRegion,
          stayTypes: preferenceData.stayTypes,
          tripPace: preferenceData.tripPace,
          tripStyle: preferenceData.tripStyle,
          units: preferenceData.units,
        }
      : null,
    scope: {
      activities: trip.state.scope.activities.map(compactActivity),
      events: trip.state.scope.events.map(compactEvent),
      homes: trip.state.scope.homes.map(compactHome),
    },
    selectedHome: compactHome(appData.listings.selectedHome),
    trips: appData.booking.trips.map((tripItem) => ({
      checkIn: tripItem.checkIn,
      checkOut: tripItem.checkOut,
      guests: tripItem.guests,
      homeId: tripItem.homeId,
      id: tripItem.id,
      status: tripItem.status,
      title: tripItem.home.title,
      total: tripItem.total,
    })),
    wishlist: {
      homeIds: appData.wishlist.homeIds,
      homes: appData.wishlist.homes.map(compactHome),
    },
  };
}

function pendingActionFromCall(call: ToolCall): AiPendingAction | null {
  const input = (call.input ?? {}) as Record<string, unknown>;
  switch (call.name) {
    case "set_destination": {
      const city = asString(input.city);
      return city ? { kind: "set_destination", city } : null;
    }
    case "change_category": {
      const id = asString(input.id);
      return id ? { kind: "change_category", id } : null;
    }
    case "open_screen": {
      const screen = asString(input.screen);
      if (
        screen === "home" ||
        screen === "map" ||
        screen === "activities" ||
        screen === "trips" ||
        screen === "wishlists"
      ) {
        return { kind: "open_screen", screen };
      }
      return null;
    }
    case "start_reservation": {
      const homeId = asString(input.homeId);
      if (!homeId) return null;
      return {
        kind: "start_reservation",
        homeId,
        guests: asNumber(input.guests),
        checkIn: asString(input.checkIn),
        checkOut: asString(input.checkOut),
      };
    }
    case "cancel_reservation": {
      const reservationId = asString(input.reservationId);
      return reservationId ? { kind: "cancel_reservation", reservationId } : null;
    }
    default:
      return null;
  }
}

/**
 * Walk an assistant message's parts and produce (a) the inline widget payload
 * the bubble should render, (b) the recommended-home ids to surface in
 * suggestions, (c) the side-effect actions the model wants the client to run.
 *
 * Search tools (`search_listings`, `search_activities`) feed the widget from
 * tool-result rows resolved against the local home/activity cache. Render
 * tools (`show_listings`, `show_map`, `show_itinerary`) synthesize a widget
 * from the trip scope directly so the model can demo a UI without picking
 * specific items. Action tools (`set_destination`, `change_category`, etc.)
 * surface in `actions` for the provider to dispatch once per call id.
 */
function extractToolWidget(
  message: UIMessage | undefined,
  scopedData: {
    homes: Home[];
    homesById: Record<string, Home>;
    nearbyActivities: NearbyActivity[];
  },
): {
  actions: Array<{ callId: string; action: AiPendingAction }>;
  homeIds: string[];
  payload?: AiAssistantPayload;
} {
  if (!message) return { actions: [], homeIds: [] };
  const calls = new Map<string, ToolCall>();
  let homesResult: ToolResultJson = null;
  let activitiesResult: ToolResultJson = null;
  let eventsResult: ToolResultJson = null;
  let theatresResult: ToolResultJson = null;
  let showsResult: ToolResultJson = null;
  let showtimesResult: ToolResultJson = null;
  let showListingsCall: ToolCall | null = null;
  let showMapCall: ToolCall | null = null;
  let showItineraryCall: ToolCall | null = null;
  const actions: Array<{ callId: string; action: AiPendingAction }> = [];

  const assignToolResult = (name: string, result: ToolResultJson) => {
    if (name === "search_listings") homesResult = result;
    else if (name === "search_activities") activitiesResult = result;
    else if (name === "search_events") eventsResult = result;
    else if (name === "search_theatres") theatresResult = result;
    else if (name === "search_shows") showsResult = result;
    else if (name === "search_showtimes") showtimesResult = result;
  };

  for (const part of message.parts) {
    if (part.type === "tool-call" && "id" in part && "name" in part) {
      const call: ToolCall = {
        id: part.id as string,
        name: part.name as string,
        input: toolInputFromPart(part as { arguments?: unknown; input?: unknown }),
      };
      calls.set(call.id, call);
      const action = pendingActionFromCall(call);
      if (action) actions.push({ callId: call.id, action });
      if (call.name === "show_listings") showListingsCall = call;
      else if (call.name === "show_map") showMapCall = call;
      else if (call.name === "show_itinerary") showItineraryCall = call;
      const output = (part as { output?: unknown }).output;
      if (output !== undefined) assignToolResult(call.name, output);
    } else if (part.type === "tool-result" && "toolCallId" in part && "content" in part) {
      const call = calls.get(part.toolCallId as string);
      if (!call) continue;
      const parsed = parsedToolResult((part as { content?: unknown }).content);
      if (parsed !== undefined) assignToolResult(call.name, parsed);
    }
  }

  if (showItineraryCall) {
    const input = (showItineraryCall.input ?? {}) as { title?: unknown; steps?: unknown };
    const steps = Array.isArray(input.steps)
      ? input.steps.filter((s): s is string => typeof s === "string" && s.length > 0)
      : [];
    const title = asString(input.title) ?? "Your plan";
    if (steps.length > 0) {
      return { actions, homeIds: [], payload: { kind: "itinerary", steps, title } };
    }
  }

  if (showMapCall) {
    const input = (showMapCall.input ?? {}) as { title?: unknown };
    return {
      actions,
      homeIds: [],
      payload: {
        events: [],
        homes: scopedData.homes.slice(0, 6),
        kind: "trip-map",
        places: [],
        title: asString(input.title) ?? "Your trip map",
      },
    };
  }

  if (showListingsCall) {
    const input = (showListingsCall.input ?? {}) as { homeIds?: unknown; title?: unknown };
    const ids = Array.isArray(input.homeIds)
      ? input.homeIds.filter((id): id is string => typeof id === "string")
      : [];
    const resolved =
      ids.length > 0
        ? ids.map((id) => scopedData.homesById[id]).filter((h): h is Home => Boolean(h))
        : scopedData.homes.slice(0, 6);
    if (resolved.length > 0) {
      return {
        actions,
        homeIds: resolved.map((h) => h.id),
        payload: {
          chips: [],
          homes: resolved.slice(0, 6),
          kind: "homes",
          title: asString(input.title) ?? "Some stays to consider",
        },
      };
    }
  }

  const homeRows = rowsFromToolResult(homesResult);
  if (homeRows.length > 0) {
    const homes: Home[] = [];
    const homeIds: string[] = [];
    for (const row of homeRows) {
      const id = asString(row?.id);
      if (!id) continue;
      const home = scopedData.homesById[id];
      if (home) {
        homes.push(home);
        homeIds.push(id);
      }
    }
    if (homes.length > 0) {
      return {
        actions,
        homeIds,
        payload: {
          chips: [],
          homes: homes.slice(0, 6),
          kind: "homes",
          title: "Recommended stays",
        },
      };
    }
  }

  const activityRows = rowsFromToolResult(activitiesResult);
  if (activityRows.length > 0) {
    const activities: NearbyActivity[] = [];
    const fallbackImage = scopedData.nearbyActivities[0]?.image ?? "";
    for (const row of activityRows) {
      const id = asString(row?.id);
      if (!id) continue;
      const match = scopedData.nearbyActivities.find((a) => a.id === id);
      const fallback = activityFromToolRow(row, fallbackImage);
      if (match) activities.push(match);
      else if (fallback) activities.push(fallback);
    }
    if (activities.length > 0) {
      return {
        actions,
        homeIds: [],
        payload: {
          activities: activities.slice(0, 6),
          kind: "activities",
          map: false,
          title: "Things to do",
        },
      };
    }
  }

  const eventRows = rowsFromToolResult(eventsResult);
  const theatreRows = rowsFromToolResult(theatresResult);
  if (eventRows.length > 0 || theatreRows.length > 0) {
    const fallbackImage = scopedData.nearbyActivities[0]?.image ?? "";
    const eventActivities = eventRows
      .map((row) => activityFromToolRow(row, fallbackImage))
      .filter((activity): activity is NearbyActivity => Boolean(activity));
    const theatreActivities = theatreRows
      .map((row) => {
        return activityFromToolRow(
          {
            ...row,
            category: "culture",
            title: row.name,
          },
          fallbackImage,
        );
      })
      .filter((activity): activity is NearbyActivity => Boolean(activity));
    const activities = [...eventActivities, ...theatreActivities];
    if (activities.length > 0) {
      return {
        actions,
        homeIds: [],
        payload: {
          activities: activities.slice(0, 6),
          kind: "activities",
          map: false,
          title: eventActivities.length > 0 ? "Events I found" : "Theatres I found",
        },
      };
    }
  }

  const showRows = rowsFromToolResult(showsResult);
  const showtimeRows = rowsFromToolResult(showtimesResult);
  if (showRows.length > 0 || showtimeRows.length > 0) {
    const showSteps = showRows
      .map((row) => {
        const title = asString(row.title);
        if (!title) return null;
        const detail = [asString(row.genre), asString(row.ageRating)].filter(Boolean).join(" · ");
        return detail ? `${title}: ${detail}` : title;
      })
      .filter((step): step is string => Boolean(step));
    const showtimeSteps = showtimeRows
      .map((row) => {
        const startsAt = asString(row.startsAt);
        const hall = asString(row.hall);
        if (!startsAt && !hall) return null;
        return [startsAt, hall].filter(Boolean).join(" · ");
      })
      .filter((step): step is string => Boolean(step));
    const steps = [...showSteps, ...showtimeSteps].slice(0, 10);
    if (steps.length > 0) {
      return {
        actions,
        homeIds: [],
        payload: { kind: "itinerary", steps, title: "Theatre options" },
      };
    }
  }

  return { actions, homeIds: [] };
}

function localResponseForEmptyAssistant(
  prompt: string,
  scopedData: {
    homes: Home[];
    nearbyActivities: NearbyActivity[];
  },
  destination?: string,
): { chips: string[]; homeIds: string[]; payload?: AiAssistantPayload; text: string } {
  const trimmed = prompt.trim();
  const lower = trimmed.toLowerCase();
  const location =
    destination && destination !== "Anywhere" ? destination : scopedData.homes[0]?.city;
  const chips = ["Find stays", "Show map", "Things to do"];
  const wantsHomes =
    /\b(find|search|recommend|suggest|show me|options?|available|availability)\b/.test(lower) ||
    /\b(stays?|homes?|listings?|places? to stay|where to stay|book|reserve)\b/.test(lower);

  if (
    /\b(hey|hi|hello|yo|sup|what'?s up|thanks|thank you|talk|speak|chat|are you there)\b/i.test(
      trimmed,
    )
  ) {
    return {
      chips,
      homeIds: [],
      payload: { chips, kind: "clarify" },
      text: location
        ? `Hey. I can help with stays, activities, and maps for ${location}.`
        : "Hey. Where to next?",
    };
  }

  if (
    scopedData.nearbyActivities.length > 0 &&
    /\b(activit|things to do|event|theatre|show|food|nightlife|culture|beach|outdoor|wellness)\b/.test(
      lower,
    )
  ) {
    return {
      chips: ["Show map", "Find stays", "Plan itinerary"],
      homeIds: [],
      payload: {
        activities: scopedData.nearbyActivities.slice(0, 6),
        kind: "activities",
        map: true,
        title: location ? `Things to do in ${location}` : "Things to do",
      },
      text: location
        ? `Here are a few activities and events around ${location}.`
        : "Here are a few activities and events to consider.",
    };
  }

  if (scopedData.homes.length > 0 && /\b(map|near|nearby|area|around)\b/.test(lower)) {
    return {
      chips: ["Find stays", "Things to do", "Plan itinerary"],
      homeIds: [],
      payload: {
        events: [],
        homes: scopedData.homes.slice(0, 6),
        kind: "trip-map",
        places: [],
        title: location ? `${location} trip map` : "Trip map",
      },
      text: location ? `Here's a quick map view for ${location}.` : "Here's a quick map view.",
    };
  }

  if (wantsHomes && scopedData.homes.length > 0) {
    const homes = scopedData.homes.slice(0, 6);
    return {
      chips: ["Show map", "Things to do", "Plan itinerary"],
      homeIds: homes.map((home) => home.id),
      payload: {
        chips: ["Show map", "Things to do", "Plan itinerary"],
        homes,
        kind: "homes",
        title: location ? `Stays in ${location}` : "Recommended stays",
      },
      text: location
        ? `I found a few stays that fit ${location}.`
        : "I found a few stays to consider.",
    };
  }

  return {
    chips,
    homeIds: [],
    payload: { chips, kind: "clarify" },
    text: "I'm here. Tell me what you want to plan, or ask me to find stays or activities.",
  };
}

function textForToolPayload(payload: AiAssistantPayload | undefined): string {
  if (!payload) return "";
  switch (payload.kind) {
    case "homes":
      return payload.homes.length > 0
        ? "I found a few stays that match."
        : "I don't see matching stays yet.";
    case "activities":
      return payload.activities.length > 0
        ? "I found a few options to check out."
        : "I don't see matching activities yet.";
    case "trip-map":
      return "Here's the map view.";
    case "itinerary":
      return "Here's a quick plan.";
    case "budget":
      return "Here's the budget breakdown.";
    case "clarify":
      return "Tell me a city, dates, or what you want to do next.";
  }
}

function sortSessions(sessions: AiChatSession[]) {
  return [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function createAiFeatureProvider({
  apiBaseUrl,
  authHeaders,
  storage,
  useAppData,
  useCustomerTrip,
  useUserPreferences,
  useSetActiveCategory,
}: {
  apiBaseUrl: string;
  authHeaders?: () => Record<string, string>;
  storage: StorageAdapter;
  useAppData: () => AppDataValue;
  useCustomerTrip: () => CustomerTripValue;
  useUserPreferences?: () => UserPreferencesValue | null;
  /** Hook returning the home-feature's setActiveCategory, so `change_category`
   * tool calls can flip the amenity filter chip. */
  useSetActiveCategory?: () => (id: string) => void;
}) {
  const Context = createContext<AiFeatureValue | null>(null);
  const io = createStorageIo(storage);
  const resolveAuthHeaders = authHeaders ?? (() => ({}));
  const useOptionalUserPreferences = useUserPreferences ?? (() => null);

  function AiFeatureProvider({
    children,
    onAction,
  }: {
    children: ReactNode;
    onAction?: (action: AiPendingAction) => void;
  }) {
    const {
      actions: { addRecommendedHomes, search: searchActions },
      state: appDataState,
    } = useAppData();
    const { data, wishlist } = appDataState;
    const customerTripValue = useCustomerTrip();
    const {
      state: { areaLabel, form, scope },
    } = customerTripValue;
    const preferences = useOptionalUserPreferences();
    const setActiveCategory = useSetActiveCategory?.();
    const onActionRef = useRef(onAction);
    onActionRef.current = onAction;
    const dispatchedActionsRef = useRef<Set<string>>(new Set());

    const scopedData = useMemo(() => {
      const homesById = Object.fromEntries(scope.homes.map((home) => [home.id, home]));
      const scopedHomeIds = new Set(scope.homes.map((home) => home.id));

      return {
        ...data,
        homes: scope.homes,
        homesById,
        nearbyActivities: scope.activities,
        searchHomes: (query: string) =>
          data.searchHomes(query).filter((home) => scopedHomeIds.has(home.id)),
      };
    }, [data, scope.activities, scope.homes]);

    const knownContext = useMemo(
      () =>
        buildKnownContext({
          appData: appDataState,
          preferences,
          trip: customerTripValue,
        }),
      [appDataState, customerTripValue, preferences],
    );

    const [sessions, setSessions] = useState<AiChatSession[]>(() => [createAiChatSession()]);
    const [activeId, setActiveId] = useState(() => sessions[0]?.id ?? "");
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [chips, setChips] = useState<string[]>([]);
    const hydrated = useRef(false);
    const activeIdRef = useRef(activeId);
    const messagesRef = useRef<AiChatMessage[]>([]);
    const wishlistHomeIdsRef = useRef(wishlist.homeIds);
    const formRef = useRef(form);

    // Ref-routed streaming callback. ChatClient takes onMessagesChange as a
    // *constructor* option, so it's frozen at mount; we point it at a ref so
    // we can swap the per-send handler without remounting the client.
    const onWireMessagesRef = useRef<(messages: UIMessage[]) => void>(() => undefined);

    const chatClient = useMemo(() => {
      const client = new ChatClient({
        connection: xhrServerSentEvents(`${apiBaseUrl}/api/ai/concierge`, () => ({
          headers: resolveAuthHeaders(),
        })),
        onMessagesChange: (msgs: UIMessage[]) => onWireMessagesRef.current(msgs),
      });
      // Workaround for @tanstack/ai-client@0.14.1: ChatClient calls several
      // methods on its devtoolsBridge that the bundled NoOpChatDevtoolsBridge
      // doesn't implement (observed: `mountWithTools`, `notifyToolsChanged`),
      // each of which throws "undefined is not a function" on the first
      // sendMessage. Proxy-wrap the bridge so any missing method is a
      // transparent no-op. Defined methods pass through unchanged so the
      // noop bridge keeps emitting nothing as intended.
      const holder = client as unknown as { devtoolsBridge?: object };
      const bridge = holder.devtoolsBridge;
      if (bridge) {
        holder.devtoolsBridge = new Proxy(bridge, {
          get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            if (value !== undefined) return value;
            return () => undefined;
          },
        });
      }
      return client;
    }, []);
    useEffect(() => () => chatClient.dispose(), [chatClient]);

    const activeSession = sessions.find((session) => session.id === activeId) ?? sessions[0];
    const messages = activeSession?.messages ?? [];
    activeIdRef.current = activeSession?.id ?? activeId;
    messagesRef.current = messages;
    wishlistHomeIdsRef.current = wishlist.homeIds;
    formRef.current = form;

    useEffect(() => {
      let active = true;

      (async () => {
        const [storedSessions, storedActiveId] = await Promise.all([
          io.readJson<unknown>(AI_CHAT_SESSIONS_KEY, null),
          io.readJson<unknown>(AI_ACTIVE_CHAT_ID_KEY, null),
        ]);
        if (!active) return;

        const normalizedSessions = normalizeAiChatSessions(storedSessions);
        if (!normalizedSessions) {
          hydrated.current = true;
          return;
        }

        const fallbackActiveId = normalizedSessions[0]?.id ?? "";
        const nextActiveId =
          typeof storedActiveId === "string" &&
          normalizedSessions.some((session) => session.id === storedActiveId)
            ? storedActiveId
            : fallbackActiveId;

        setSessions(sortSessions(normalizedSessions));
        setActiveId(nextActiveId);
        hydrated.current = true;
      })();

      return () => {
        active = false;
      };
    }, []);

    useEffect(() => {
      if (hydrated.current) io.writeJson(AI_CHAT_SESSIONS_KEY, sessions);
    }, [sessions]);

    useEffect(() => {
      if (hydrated.current) io.writeJson(AI_ACTIVE_CHAT_ID_KEY, activeId);
    }, [activeId]);

    const appendToActive = useCallback((message: AiChatMessage) => {
      const timestamp = Date.now();
      setSessions((prev) =>
        sortSessions(
          prev.map((session) => {
            if (session.id !== activeIdRef.current) return session;
            const title =
              session.title === NEW_CHAT_TITLE && message.role === "user"
                ? deriveTitle(message.text)
                : session.title;
            return {
              ...session,
              messages: [...session.messages, message],
              title,
              updatedAt: timestamp,
            };
          }),
        ),
      );
    }, []);

    // In-place mutation of the streaming assistant message: matched by id so
    // we patch text/payload without re-sorting or re-bumping `updatedAt`.
    const updateMessageInActive = useCallback((id: string, patch: Partial<AiChatMessage>) => {
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== activeIdRef.current) return session;
          let touched = false;
          const nextMessages = session.messages.map((m) => {
            if (m.id !== id) return m;
            touched = true;
            return { ...m, ...patch };
          });
          return touched ? { ...session, messages: nextMessages } : session;
        }),
      );
    }, []);

    const sendInternal = useCallback(
      (raw: string) => {
        const trimmed = raw.trim();
        if (!trimmed || sending) return;

        const userMessage: AiChatMessage = {
          id: createAiMessageId("u"),
          role: "user",
          text: trimmed,
        };
        const history = historyFromMessages(messagesRef.current);
        const likedHomes = wishlistHomeIdsRef.current
          .map((homeId) => scopedData.homesById[homeId])
          .filter((home) => Boolean(home));
        const likes = likesFromHomes(likedHomes);
        const currentForm = formRef.current;
        const fallbackLocation =
          areaLabel === "Anywhere"
            ? (mostCommonCity(likedHomes) ?? likedHomes[0]?.city)
            : areaLabel;
        const destination = currentForm.destination?.trim() || fallbackLocation;

        appendToActive(userMessage);

        // Streaming placeholder for the assistant message. Each chunk patches
        // its text/payload in place via `updateMessageInActive`, so the bubble
        // grows token-by-token instead of popping in at the end.
        const assistantId = createAiMessageId("a");
        appendToActive({ id: assistantId, role: "ai", text: "" });
        setInput("");
        setSending(true);
        setChips([]);

        // Dispatch action tools at most once per tool-call id. Destination and
        // category flip via the local actions/hooks (cheap, instant feedback);
        // navigation + booking go to the consumer via onAction.
        const dispatchActions = (entries: Array<{ callId: string; action: AiPendingAction }>) => {
          for (const { callId, action } of entries) {
            if (dispatchedActionsRef.current.has(callId)) continue;
            dispatchedActionsRef.current.add(callId);
            if (action.kind === "set_destination") {
              searchActions.updateForm({ destination: action.city });
            } else if (action.kind === "change_category" && setActiveCategory) {
              setActiveCategory(action.id);
            } else {
              onActionRef.current?.(action);
            }
          }
        };

        // Per-send routing: every onMessagesChange from the chat client lands
        // here, extracts the latest streamed text + any tool widget, and
        // patches the placeholder. Ref-routed so the constructor handler can
        // forward without binding to a stale closure.
        onWireMessagesRef.current = (wire) => {
          const last = lastAssistantMessage(wire);
          const text = extractStreamingText(last);
          const widget = extractToolWidget(last, scopedData);
          updateMessageInActive(assistantId, {
            text: text || textForToolPayload(widget.payload),
            payload: widget.payload,
          });
          if (widget.homeIds.length > 0) addRecommendedHomes(widget.homeIds);
          if (widget.actions.length > 0) dispatchActions(widget.actions);
        };

        (async () => {
          try {
            chatClient.clear();
            await chatClient.sendMessage(trimmed, {
              checkIn: currentForm.checkIn || null,
              checkOut: currentForm.checkOut || null,
              destination: destination ?? null,
              guests: currentForm.guests ?? null,
              history,
              knownContext,
              likes,
              location: destination,
            });

            // Final flush after the stream ends. If the model produced zero
            // text and zero tool widget (usually an empty 200 or a stream-shape
            // mismatch), answer from the scoped trip data instead of leaving
            // the user with a dead-end bubble.
            const finalMessage = lastAssistantMessage(chatClient.getMessages());
            const finalText = extractStreamingText(finalMessage);
            const finalWidget = extractToolWidget(finalMessage, scopedData);
            if (finalWidget.actions.length > 0) dispatchActions(finalWidget.actions);
            if (!finalText && !finalWidget.payload) {
              const local = localResponseForEmptyAssistant(trimmed, scopedData, destination);
              if (local.homeIds.length > 0) addRecommendedHomes(local.homeIds);
              setChips(local.chips);
              updateMessageInActive(assistantId, {
                payload: local.payload,
                text: local.text,
              });
            } else {
              updateMessageInActive(assistantId, {
                text: finalText || textForToolPayload(finalWidget.payload),
                payload: finalWidget.payload,
              });
            }
          } catch (err) {
            // Honest error path: tell the user what actually went wrong instead
            // of returning a canned template that hides the failure.
            const detail = err instanceof Error ? err.message : "Unknown error";
            updateMessageInActive(assistantId, {
              text: `Couldn't reach the assistant. ${detail}`,
            });
          } finally {
            onWireMessagesRef.current = () => undefined;
            setSending(false);
          }
        })();
      },
      [
        addRecommendedHomes,
        appendToActive,
        areaLabel,
        chatClient,
        knownContext,
        scopedData,
        searchActions.updateForm,
        sending,
        setActiveCategory,
        updateMessageInActive,
      ],
    );

    const send = useCallback(
      (override?: string) => {
        sendInternal(override ?? input);
      },
      [input, sendInternal],
    );

    const chipPress = useCallback(
      (chip: string) => {
        sendInternal(chip);
      },
      [sendInternal],
    );

    const newChat = useCallback(() => {
      const session = createAiChatSession();
      setSessions((prev) => sortSessions([session, ...prev]));
      setActiveId(session.id);
      setInput("");
      setChips([]);
      setSending(false);
    }, []);

    const selectChat = useCallback(
      (id: string) => {
        if (!sessions.some((session) => session.id === id)) return;
        setActiveId(id);
        setInput("");
        setChips([]);
        setSending(false);
      },
      [sessions],
    );

    const deleteChat = useCallback(
      (id: string) => {
        setSessions((prev) => {
          const remaining = prev.filter((session) => session.id !== id);
          if (remaining.length === 0) {
            const fresh = createAiChatSession();
            setActiveId(fresh.id);
            return sortSessions([fresh]);
          }
          if (id === activeId) {
            const next = remaining[0];
            if (next) setActiveId(next.id);
          }
          return sortSessions(remaining);
        });
        setInput("");
        setChips([]);
        setSending(false);
      },
      [activeId],
    );

    const deleteAllChats = useCallback(() => {
      const fresh = createAiChatSession();
      setSessions([fresh]);
      setActiveId(fresh.id);
      setInput("");
      setChips([]);
      setSending(false);
    }, []);

    const value = useMemo<AiFeatureValue>(
      () => ({
        actions: { chipPress, deleteAllChats, deleteChat, newChat, selectChat, send, setInput },
        state: {
          activeId: activeSession?.id ?? activeId,
          chips,
          input,
          messages,
          sending,
          sessions: summarizeAiSessions(sessions),
        },
      }),
      [
        activeId,
        activeSession?.id,
        chipPress,
        chips,
        deleteAllChats,
        deleteChat,
        input,
        messages,
        newChat,
        selectChat,
        send,
        sending,
        sessions,
      ],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useAiFeature() {
    const value = useContext(Context);
    if (!value) {
      throw new Error("useAiFeature must be used within AiFeatureProvider");
    }
    return value;
  }

  return { AiFeatureProvider, useAiFeature };
}
