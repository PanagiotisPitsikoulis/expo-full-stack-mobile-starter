import type { Booking } from "../domain";

/** Minimal session shape the server-sync hook needs. Web/native each map their auth to this. */
export type AirbnbSessionUser = { id?: string } | null | undefined;

/**
 * Platform adapter for the shared data hooks. The only things that differ
 * between web and native are the API base URL, an optionally authenticated
 * fetch, the session user, and where a previously selected stay is stored.
 */
export type RealDataAdapter = {
  /** Prefixed to every /api path. Web: "" (same-origin). Native: absolute origin. */
  baseUrl: string;
  /** Authenticated fetch (e.g. better-auth/expo). Defaults to global fetch. */
  fetchImpl?: (input: string, init?: RequestInit) => Promise<Response>;
  /** Returns a persisted selected-home id if one exists, so we don't override it. */
  getStoredSelectedHomeId?: () => string | null | undefined;
};

export type ServerSyncAdapter = {
  baseUrl: string;
  fetchImpl?: (input: string, init?: RequestInit) => Promise<Response>;
  user: AirbnbSessionUser;
};

export type ServerSyncResult = {
  loading: {
    bookings: boolean;
    wishlist: boolean;
  };
  mirror: {
    cancelBooking: (bookingId: string) => void;
    confirmBooking: (booking: Booking) => void;
    toggleWishlist: (homeId: string, removing: boolean, previousIds: string[]) => void;
  };
  user: AirbnbSessionUser;
};
