import type { Booking, BookingDraft } from "@repo/airbnb-core/domain";
import { defaultBookingDraft } from "@repo/airbnb-core/domain";
import { firstHome, useAppDataStore } from "@repo/airbnb-core/store";
import { useEffect, useRef, useState } from "react";
import type { StorageAdapter } from "../adapters";
import {
  BOOKING_DRAFT_KEY,
  BOOKINGS_KEY,
  createStorageIo,
  RECOMMENDED_HOME_IDS_KEY,
  SAVED_EVENT_IDS_KEY,
  SELECTED_HOME_ID_KEY,
  WISHLIST_HOME_IDS_KEY,
} from "./keys";

/**
 * Async storage adapter: hydrate the core store on mount, then persist on change.
 * Web passes a localStorage-backed StorageAdapter; native passes AsyncStorage.
 */
export function createAppDataPersistenceHook(storage: StorageAdapter) {
  const io = createStorageIo(storage);

  return function useAppDataPersistence() {
    const hydrate = useAppDataStore((s) => s.hydrate);
    const hydrated = useRef(false);
    const [ready, setReady] = useState(false);
    const recommendedHomeIds = useAppDataStore((s) => s.recommendedHomeIds);
    const savedEventIds = useAppDataStore((s) => s.savedEventIds);
    const selectedHomeId = useAppDataStore((s) => s.selectedHomeId);
    const wishlistHomeIds = useAppDataStore((s) => s.wishlistHomeIds);
    const bookings = useAppDataStore((s) => s.bookings);
    const bookingDraft = useAppDataStore((s) => s.bookingDraft);

    useEffect(() => {
      let active = true;
      (async () => {
        const [draft, storedBookings, recommended, savedEvents, selected, wishlist] =
          await Promise.all([
            io.readJson<BookingDraft>(BOOKING_DRAFT_KEY, defaultBookingDraft),
            io.readJson<Booking[]>(BOOKINGS_KEY, []),
            io.readJson<string[]>(RECOMMENDED_HOME_IDS_KEY, []),
            io.readJson<string[]>(SAVED_EVENT_IDS_KEY, []),
            io.readJson<string>(SELECTED_HOME_ID_KEY, firstHome().id),
            io.readJson<string[]>(WISHLIST_HOME_IDS_KEY, []),
          ]);
        if (!active) return;
        hydrate({
          bookingDraft: draft,
          bookings: storedBookings,
          recommendedHomeIds: recommended,
          savedEventIds: savedEvents,
          selectedHomeId: selected,
          wishlistHomeIds: wishlist,
        });
        hydrated.current = true;
        setReady(true);
      })();
      return () => {
        active = false;
      };
    }, [hydrate]);

    useEffect(() => {
      if (hydrated.current) io.writeJson(RECOMMENDED_HOME_IDS_KEY, recommendedHomeIds);
    }, [recommendedHomeIds]);

    useEffect(() => {
      if (hydrated.current) io.writeJson(SAVED_EVENT_IDS_KEY, savedEventIds);
    }, [savedEventIds]);

    useEffect(() => {
      if (hydrated.current) io.writeJson(SELECTED_HOME_ID_KEY, selectedHomeId);
    }, [selectedHomeId]);

    useEffect(() => {
      if (hydrated.current) io.writeJson(WISHLIST_HOME_IDS_KEY, wishlistHomeIds);
    }, [wishlistHomeIds]);

    useEffect(() => {
      if (hydrated.current) io.writeJson(BOOKINGS_KEY, bookings);
    }, [bookings]);

    useEffect(() => {
      if (hydrated.current) io.writeJson(BOOKING_DRAFT_KEY, bookingDraft);
    }, [bookingDraft]);

    return ready;
  };
}
