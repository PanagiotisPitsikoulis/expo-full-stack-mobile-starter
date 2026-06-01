import { bookingKeys } from "@repo/airbnb-core/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../../../api/client";
import type { Home } from "../../../api/travel";
import { authedFetch, useSession } from "../../auth-client";

export type ReservationStatus = "cancelled" | "confirmed";

export type StayReservation = {
  checkIn: string;
  checkOut: string;
  createdAt: string;
  guests: number;
  homeId: string;
  id: string;
  item: Home;
  kind: "stay";
  nights: number;
  serviceFee: number;
  status: ReservationStatus;
  subtotal: number;
  taxes: number;
  total: number;
};

export type EventReservation = {
  createdAt: string;
  eventId: string;
  id: string;
  item: {
    city?: string | null;
    country?: string | null;
    image?: string | null;
    startsAt?: string | null;
    subtitle: string;
    title: string;
    venue?: string | null;
  };
  kind: "event";
  serviceFee: number;
  status: ReservationStatus;
  subtotal: number;
  taxes: number;
  tickets: number;
  total: number;
};

export type TheatreReservation = {
  createdAt: string;
  id: string;
  item: {
    hall: string;
    image?: string | null;
    startsAt?: string | null;
    subtitle: string;
    theatre: string;
    title: string;
    venue: string;
  };
  kind: "theatre";
  seatIds: string[];
  serviceFee: number;
  showtimeId: string;
  status: ReservationStatus;
  subtotal: number;
  taxes: number;
  total: number;
};

export type Reservation = EventReservation | StayReservation | TheatreReservation;

export type ProfileSummary = {
  profile: {
    avatarUrl?: string | null;
    email?: string | null;
    id: string;
    name: string;
  };
  stats: {
    activeReservations: number;
    eventReservations: number;
    historyReservations: number;
    stayReservations: number;
    theatreReservations: number;
    wishlists: number;
  };
};

export type ReservationEditDraft = {
  checkIn: string;
  checkOut: string;
  guests: string;
  tickets: string;
};

export const reservationKeys = {
  all: ["reservations"] as const,
  profileSummary: ["profile", "summary"] as const,
};

type ApiError = string | { code?: string; message?: string; details?: unknown };
type ApiEnvelope<T> = { data?: T; error?: ApiError };

function readErrorMessage(error: ApiError | undefined, status: number): string {
  if (!error) return `Request failed (${status})`;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && typeof error.message === "string") {
    return error.message;
  }
  return `Request failed (${status})`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await authedFetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!response.ok || payload.data === undefined) {
    throw new Error(readErrorMessage(payload.error, response.status));
  }
  return payload.data;
}

function useSignedIn() {
  const { data } = useSession();
  return Boolean(data?.user);
}

function invalidateReservations(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: reservationKeys.all });
  void queryClient.invalidateQueries({ queryKey: reservationKeys.profileSummary });
  void queryClient.invalidateQueries({ queryKey: bookingKeys.me });
  void queryClient.invalidateQueries({ queryKey: ["theatre-reservations"] });
  void queryClient.invalidateQueries({ queryKey: ["seats"] });
}

export function useReservations() {
  const enabled = useSignedIn();
  return useQuery({
    enabled,
    queryFn: () => requestJson<Reservation[]>("/api/reservations"),
    queryKey: reservationKeys.all,
  });
}

export function useProfileSummary() {
  const enabled = useSignedIn();
  return useQuery({
    enabled,
    queryFn: () => requestJson<ProfileSummary>("/api/profile/summary"),
    queryKey: reservationKeys.profileSummary,
  });
}

export function useCreateStayReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { checkIn: string; checkOut: string; guests: number; listingId: string }) =>
      requestJson<Reservation>("/api/reservations", {
        body: JSON.stringify({ ...input, kind: "stay" }),
        method: "POST",
      }),
    onSuccess: () => invalidateReservations(queryClient),
  });
}

export function useCreateEventReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      category?: string;
      city?: string;
      country?: string;
      eventId: string;
      image?: string;
      lat?: number;
      lng?: number;
      priceCents?: number;
      startsAt?: string;
      tickets: number;
      title?: string;
      venue?: string;
    }) =>
      requestJson<Reservation>("/api/reservations", {
        body: JSON.stringify({ ...input, kind: "event" }),
        method: "POST",
      }),
    onSuccess: () => invalidateReservations(queryClient),
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      checkIn?: string;
      checkOut?: string;
      guests?: number;
      id: string;
      kind: Reservation["kind"];
      seatIds?: string[];
      tickets?: number;
    }) => {
      const { id, ...body } = input;
      return requestJson<Reservation>(`/api/reservations/${id}`, {
        body: JSON.stringify(body),
        method: "PATCH",
      });
    },
    onSuccess: () => invalidateReservations(queryClient),
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; kind: Reservation["kind"] }) =>
      requestJson<Reservation>(`/api/reservations/${input.id}`, {
        body: JSON.stringify({ kind: input.kind, status: "cancelled" }),
        method: "PATCH",
      }),
    onSuccess: () => invalidateReservations(queryClient),
  });
}
