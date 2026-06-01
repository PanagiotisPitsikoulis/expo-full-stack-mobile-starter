/**
 * Native AsyncStorage adapter for the headless storage interface, plus the
 * back-compat readJson/writeJson helpers a couple of native call-sites still use.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StorageAdapter } from "@repo/airbnb-headless/adapters";
import { createStorageIo } from "@repo/airbnb-headless/sync";

export const nativeStorage: StorageAdapter = {
  async getItem(key) {
    return AsyncStorage.getItem(key);
  },
  async removeItem(key) {
    await AsyncStorage.removeItem(key);
  },
  async setItem(key, value) {
    await AsyncStorage.setItem(key, value);
  },
};

const io = createStorageIo(nativeStorage);
export const readJson = io.readJson;
export const writeJson = io.writeJson;

export {
  AI_ACTIVE_CHAT_ID_KEY,
  AI_CHAT_SESSIONS_KEY,
  BOOKING_DRAFT_KEY,
  BOOKINGS_KEY,
  RECOMMENDED_HOME_IDS_KEY,
  SAVED_EVENT_IDS_KEY,
  SELECTED_HOME_ID_KEY,
  WISHLIST_HOME_IDS_KEY,
} from "@repo/airbnb-headless/sync";
