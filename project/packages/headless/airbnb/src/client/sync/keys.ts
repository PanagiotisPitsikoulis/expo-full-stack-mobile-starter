import type { StorageAdapter } from "../adapters";

export const RECOMMENDED_HOME_IDS_KEY = "ainnb-recommended-home-ids";
export const SELECTED_HOME_ID_KEY = "ainnb-selected-home-id";
export const WISHLIST_HOME_IDS_KEY = "ainnb-wishlist-home-ids";
export const SAVED_EVENT_IDS_KEY = "ainnb-saved-event-ids";
export const BOOKINGS_KEY = "ainnb-bookings";
export const BOOKING_DRAFT_KEY = "ainnb-booking-draft";
export const AI_ACTIVE_CHAT_ID_KEY = "ainnb-ai-active-chat-id";
export const AI_CHAT_SESSIONS_KEY = "ainnb-ai-chat-sessions";

export function createStorageIo(storage: StorageAdapter) {
  return {
    async readJson<T>(key: string, fallback: T): Promise<T> {
      try {
        const raw = await storage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        return fallback;
      }
    },
    writeJson(key: string, value: unknown): void {
      void storage.setItem(key, JSON.stringify(value));
    },
  };
}

export type StorageIo = ReturnType<typeof createStorageIo>;
