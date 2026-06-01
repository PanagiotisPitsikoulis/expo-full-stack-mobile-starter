import type { NearbyActivity } from "./data";
import type { Home, HomeTag } from "./homes-dataset";

export type AiMapPoint = {
  coordinate?: [longitude: number, latitude: number];
  emoji: string;
  id: string;
  meta: string;
  subtitle: string;
  title: string;
  type: "event" | "place";
};

export type AiAssistantPayload =
  | {
      chips: string[];
      homes: Home[];
      kind: "homes";
      title: string;
    }
  | {
      kind: "itinerary";
      steps: string[];
      title: string;
    }
  | {
      kind: "budget";
      note: string;
      rows: Array<[label: string, value: string]>;
      title: string;
    }
  | {
      activities: NearbyActivity[];
      kind: "activities";
      map: boolean;
      title: string;
    }
  | {
      events: AiMapPoint[];
      homes: Home[];
      kind: "trip-map";
      places: AiMapPoint[];
      title: string;
    }
  | {
      chips: string[];
      kind: "clarify";
    };

export type AiActionScreen = "home" | "map" | "activities" | "trips" | "wishlists";

export type AiProposedAction =
  | {
      description: string;
      homeIds: string[];
      title: string;
      type: "save_favorites";
    }
  | {
      checkIn?: string;
      checkOut?: string;
      description: string;
      guests?: number;
      homeId: string;
      title: string;
      type: "prepare_reservation";
    }
  | {
      description: string;
      screen: AiActionScreen;
      title: string;
      type: "open_screen";
    };

export type AiChatMessage = {
  action?: AiProposedAction;
  id: string;
  payload?: AiAssistantPayload;
  role: "ai" | "user";
  text: string;
};

export type AiChatPromptTag = HomeTag;
