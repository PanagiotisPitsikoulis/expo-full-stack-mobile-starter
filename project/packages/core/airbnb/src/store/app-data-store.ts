"use client";

/**
 * Portable core of the travel app's global state. This store owns raw state
 * and LOCAL-only actions. It must stay platform-agnostic: no window, no fetch,
 * no auth, no storage. Persistence, server sync, and real-data loading are
 * layered on top by a platform-specific sync provider (web: app-data-provider).
 */

import { create } from "zustand";
import type { Booking, BookingDraft, Home } from "../domain";
import {
  type ActivityFilters,
  bookingOverlaps,
  createBooking,
  defaultActivityFilters,
  defaultBookingDraft,
  defaultStayFilters,
  type StayFilters,
  homes as seedHomes,
} from "../domain";
import {
  buildHomesById,
  defaultSearchForm,
  firstHome,
  homeById,
  type RealDataStatus,
  type RealEventPayload,
  type RealPlacePayload,
  type SearchForm,
} from "./app-data-derive";

type SetArg<T> = T | ((prev: T) => T);

function resolve<T>(arg: SetArg<T>, prev: T): T {
  return typeof arg === "function" ? (arg as (prev: T) => T)(prev) : arg;
}

function allHomesOf(realHomes: Home[]): Home[] {
  return realHomes.length > 0 ? realHomes : seedHomes;
}

export type AppDataStoreState = {
  selectedHomeId: string;
  wishlistHomeIds: string[];
  savedEventIds: string[];
  wishlistError: string | null;
  bookings: Booking[];
  bookingDraft: BookingDraft;
  bookingError: string | null;
  recommendedHomeIds: string[];
  realHomes: Home[];
  realEvents: RealEventPayload[];
  realPlaces: RealPlacePayload[];
  realDataStatus: RealDataStatus;
  realDataWarning: string | undefined;
  searchForm: SearchForm;
  submittedSearchForm: SearchForm | null;
  stayFilters: StayFilters;
  activityFilters: ActivityFilters;
};

export type AppDataStoreActions = {
  // Recommendations
  addRecommendedHomes: (homeIds: string[]) => void;
  clearRecommendedHomes: () => void;
  // Selection
  selectHome: (homeId: string) => void;
  // Booking (local mutation only; server mirroring lives in the sync layer)
  updateDraft: (draft: Partial<BookingDraft>) => void;
  confirmBookingLocal: () => { booking?: Booking; error?: string };
  cancelBookingLocal: (bookingId: string) => void;
  // Wishlist (local optimistic toggle; returns context for server mirroring)
  toggleWishlistLocal: (homeId: string) => { previousIds: string[]; removing: boolean } | null;
  // Saved events (local toggle; events are not homes so this is a separate list)
  toggleSavedEventLocal: (eventId: string) => void;
  // Search
  updateSearchForm: (form: Partial<SearchForm>) => void;
  submitSearch: () => void;
  // Filters
  updateStayFilters: (next: Partial<StayFilters>) => void;
  clearStayFilters: () => void;
  updateActivityFilters: (next: Partial<ActivityFilters>) => void;
  clearActivityFilters: () => void;
  // Setters used by the platform sync layer
  setSelectedHomeId: (homeId: string) => void;
  setWishlistHomeIds: (next: SetArg<string[]>) => void;
  setSavedEventIds: (next: SetArg<string[]>) => void;
  setWishlistError: (error: string | null) => void;
  setBookings: (next: SetArg<Booking[]>) => void;
  setBookingDraft: (draft: BookingDraft) => void;
  setRecommendedHomeIds: (homeIds: string[]) => void;
  setRealHomes: (homes: Home[]) => void;
  setRealEvents: (events: RealEventPayload[]) => void;
  setRealPlaces: (places: RealPlacePayload[]) => void;
  setRealDataStatus: (status: RealDataStatus) => void;
  setRealDataWarning: (warning: string | undefined) => void;
  hydrate: (snapshot: Partial<AppDataStoreState>) => void;
};

export type AppDataStore = AppDataStoreState & AppDataStoreActions;

export const useAppDataStore = create<AppDataStore>()((set, get) => ({
  selectedHomeId: firstHome().id,
  wishlistHomeIds: [],
  savedEventIds: [],
  wishlistError: null,
  bookings: [],
  bookingDraft: defaultBookingDraft,
  bookingError: null,
  recommendedHomeIds: [],
  realHomes: [],
  realEvents: [],
  realPlaces: [],
  realDataStatus: "loading",
  realDataWarning: undefined,
  searchForm: defaultSearchForm,
  submittedSearchForm: null,
  stayFilters: defaultStayFilters,
  activityFilters: defaultActivityFilters,

  addRecommendedHomes: (homeIds) =>
    set((s) => ({
      recommendedHomeIds: Array.from(new Set([...homeIds, ...s.recommendedHomeIds])),
    })),

  clearRecommendedHomes: () => set({ recommendedHomeIds: [] }),

  selectHome: (homeId) => {
    const { realHomes, selectedHomeId, bookingError } = get();
    if (homeId === selectedHomeId && bookingError === null) return;
    const allHomes = allHomesOf(realHomes);
    if (!buildHomesById(allHomes)[homeId]) return;
    set({ selectedHomeId: homeId, bookingError: null });
  },

  updateDraft: (draft) =>
    set((s) => ({ bookingDraft: { ...s.bookingDraft, ...draft }, bookingError: null })),

  confirmBookingLocal: () => {
    const { realHomes, selectedHomeId, bookings, bookingDraft } = get();
    const allHomes = allHomesOf(realHomes);
    const home = homeById(selectedHomeId, buildHomesById(allHomes), allHomes);
    const conflict = bookings.some((booking) =>
      bookingOverlaps(booking, { ...bookingDraft, homeId: home.id }),
    );

    if (conflict) {
      const error = "This stay is already booked for those dates.";
      set({ bookingError: error });
      return { error };
    }

    const booking = createBooking(home, bookingDraft);
    set({ bookings: [booking, ...bookings], bookingError: null });
    return { booking };
  },

  cancelBookingLocal: (bookingId) =>
    set((s) => ({
      bookings: s.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
      ),
    })),

  toggleWishlistLocal: (homeId) => {
    const { realHomes, wishlistHomeIds } = get();
    const allHomes = allHomesOf(realHomes);
    if (!buildHomesById(allHomes)[homeId]) return null;

    const previousIds = wishlistHomeIds;
    const removing = previousIds.includes(homeId);
    const next = removing ? previousIds.filter((id) => id !== homeId) : [homeId, ...previousIds];
    set({ wishlistError: null, wishlistHomeIds: next });
    return { previousIds, removing };
  },

  toggleSavedEventLocal: (eventId) =>
    set((s) => ({
      savedEventIds: s.savedEventIds.includes(eventId)
        ? s.savedEventIds.filter((id) => id !== eventId)
        : [eventId, ...s.savedEventIds],
    })),

  updateSearchForm: (form) => set((s) => ({ searchForm: { ...s.searchForm, ...form } })),

  submitSearch: () => set((s) => ({ submittedSearchForm: s.searchForm })),

  updateStayFilters: (next) => set((s) => ({ stayFilters: { ...s.stayFilters, ...next } })),

  clearStayFilters: () => set({ stayFilters: defaultStayFilters }),

  updateActivityFilters: (next) =>
    set((s) => ({ activityFilters: { ...s.activityFilters, ...next } })),

  clearActivityFilters: () => set({ activityFilters: defaultActivityFilters }),

  setSelectedHomeId: (homeId) => set({ selectedHomeId: homeId }),
  setWishlistHomeIds: (next) => set((s) => ({ wishlistHomeIds: resolve(next, s.wishlistHomeIds) })),
  setSavedEventIds: (next) => set((s) => ({ savedEventIds: resolve(next, s.savedEventIds) })),
  setWishlistError: (error) => set({ wishlistError: error }),
  setBookings: (next) => set((s) => ({ bookings: resolve(next, s.bookings) })),
  setBookingDraft: (draft) => set({ bookingDraft: draft }),
  setRecommendedHomeIds: (homeIds) => set({ recommendedHomeIds: homeIds }),
  setRealHomes: (homes) => set({ realHomes: homes }),
  setRealEvents: (events) => set({ realEvents: events }),
  setRealPlaces: (places) => set({ realPlaces: places }),
  setRealDataStatus: (status) => set({ realDataStatus: status }),
  setRealDataWarning: (warning) => set({ realDataWarning: warning }),
  hydrate: (snapshot) => set(snapshot),
}));
