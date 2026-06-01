"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import type { Booking } from "../domain";
import { useAppDataStore } from "../store";
import type { ServerSyncAdapter, ServerSyncResult } from "./adapter";

export const bookingKeys = { me: ["bookings", "me"] as const };
export const wishlistKeys = { all: ["wishlists"] as const };

type ToggleInput = { homeId: string; previousIds: string[]; removing: boolean };

function statusOf(error: unknown): number | undefined {
  return error && typeof error === "object" && "status" in error
    ? (error as { status?: number }).status
    : undefined;
}

/**
 * Shared server-sync hook. React Query owns the transport: it loads the signed-in
 * user's bookings + wishlist (seeding the core store) and pushes local mutations
 * to the /api routes. The platform injects the base URL, an authenticated fetch,
 * and the session user; web and native otherwise share this logic verbatim.
 */
export function useServerSync(adapter: ServerSyncAdapter): ServerSyncResult {
  const { baseUrl, user } = adapter;
  const doFetch = adapter.fetchImpl ?? fetch;
  const queryClient = useQueryClient();
  const setBookings = useAppDataStore((s) => s.setBookings);
  const setWishlistHomeIds = useAppDataStore((s) => s.setWishlistHomeIds);
  const setWishlistError = useAppDataStore((s) => s.setWishlistError);

  const bookingsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () =>
      doFetch(`${baseUrl}/api/bookings/me`).then((response) =>
        response.ok ? (response.json() as Promise<{ data?: Booking[] }>) : { data: undefined },
      ),
    queryKey: bookingKeys.me,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const wishlistQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () =>
      doFetch(`${baseUrl}/api/wishlists`).then((response) =>
        response.ok ? (response.json() as Promise<{ data?: string[] }>) : { data: undefined },
      ),
    queryKey: wishlistKeys.all,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const bookingsData = bookingsQuery.data?.data;
  const wishlistData = wishlistQuery.data?.data;

  useEffect(() => {
    if (bookingsData) setBookings(bookingsData);
  }, [bookingsData, setBookings]);

  useEffect(() => {
    if (wishlistData) {
      setWishlistHomeIds((current) => Array.from(new Set([...wishlistData, ...current])));
    }
  }, [wishlistData, setWishlistHomeIds]);

  const confirmMutation = useMutation({
    mutationFn: async (booking: Booking) => {
      const response = await doFetch(`${baseUrl}/api/bookings`, {
        body: JSON.stringify({
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          listingId: booking.homeId,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to create booking.");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingKeys.me }),
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await doFetch(`${baseUrl}/api/bookings/${bookingId}`, {
        headers: { "content-type": "application/json" },
        method: "PATCH",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingKeys.me }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ homeId, removing }: ToggleInput) => {
      const response = await doFetch(
        removing ? `${baseUrl}/api/wishlists/${homeId}` : `${baseUrl}/api/wishlists`,
        {
          body: removing ? undefined : JSON.stringify({ listingId: homeId }),
          headers: removing ? undefined : { "content-type": "application/json" },
          method: removing ? "DELETE" : "POST",
        },
      );
      if (!response.ok) {
        const error = new Error("Failed to update wishlist.") as Error & { status?: number };
        error.status = response.status;
        throw error;
      }
      return (await response.json()) as { data?: string[] };
    },
    onError: (error, variables) => {
      setWishlistHomeIds(variables.previousIds);
      setWishlistError(
        statusOf(error) === 401
          ? "Sign in again to save favorites."
          : "Could not update favorites. Try again.",
      );
    },
    onSuccess: (payload) => {
      if (payload.data) setWishlistHomeIds(payload.data);
      void queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });

  const confirmBooking = useCallback(
    (booking: Booking) => {
      if (!user) return;
      confirmMutation.mutate(booking);
    },
    [user, confirmMutation.mutate],
  );

  const cancelBooking = useCallback(
    (bookingId: string) => {
      if (!user) return;
      cancelMutation.mutate(bookingId);
    },
    [user, cancelMutation.mutate],
  );

  const toggleWishlist = useCallback(
    (homeId: string, removing: boolean, previousIds: string[]) => {
      if (!user) return;
      toggleMutation.mutate({ homeId, previousIds, removing });
    },
    [user, toggleMutation.mutate],
  );

  return useMemo(
    () => ({
      loading: {
        bookings: bookingsQuery.isLoading,
        wishlist: wishlistQuery.isLoading,
      },
      mirror: { cancelBooking, confirmBooking, toggleWishlist },
      user,
    }),
    [
      user,
      bookingsQuery.isLoading,
      wishlistQuery.isLoading,
      cancelBooking,
      confirmBooking,
      toggleWishlist,
    ],
  );
}
