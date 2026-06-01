/**
 * Native client for the theatre booking endpoints exposed by the web app
 * (apps/_web/__airbnb/src/app/api/{theatres,shows,showtimes,seats,theatre-reservations}).
 *
 * Wraps React Query so the Theatres tab + reservation flow stay reactive
 * and cancellations / new bookings invalidate the right caches.
 */

import {
  getShowtimes as getLocalShowtimes,
  shows as localShows,
  theatres as localTheatres,
  type Seat,
  type Show,
  type Showtime,
  searchShows,
  searchTheatres,
  seatsByShowtime,
  showById,
  showtimeById,
  type Theatre,
  type TheatreReservation,
  theatreById,
} from "@repo/airbnb-core/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, apiGet } from "../../../api/client";
import { authedFetch } from "../../auth-client";

type Envelope<T> = { data: T; meta?: { count?: number } };

function qs(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries as [string, string][]).toString()}`;
}

function localTheatreList(query: { q?: string; city?: string }): Theatre[] {
  const source = query.q ? searchTheatres(query.q) : localTheatres;
  const city = query.city?.trim().toLowerCase();
  if (!city) return source;
  return source.filter((theatre) => theatre.city.toLowerCase() === city);
}

function localShowList(query: { q?: string; theatreId?: string; date?: string }): Show[] {
  const source = query.q ? searchShows(query.q) : localShows;
  return source.filter((show) => !query.theatreId || show.theatreId === query.theatreId);
}

function localShowtimeList(query: { showId?: string; theatreId?: string }): Showtime[] {
  return getLocalShowtimes().filter(
    (showtime) =>
      (!query.showId || showtime.showId === query.showId) &&
      (!query.theatreId || showtime.theatreId === query.theatreId),
  );
}

export const theatreKeys = {
  all: ["theatres"] as const,
  list: (query: { q?: string; city?: string }) => ["theatres", "list", query] as const,
  detail: (id: string) => ["theatres", "detail", id] as const,
  shows: (query: { q?: string; theatreId?: string; date?: string }) =>
    ["shows", "list", query] as const,
  showDetail: (id: string) => ["shows", "detail", id] as const,
  showtimes: (query: { showId?: string; theatreId?: string }) =>
    ["showtimes", "list", query] as const,
  seats: (showtimeId: string) => ["seats", showtimeId] as const,
  reservations: ["theatre-reservations"] as const,
  reservationDetail: (id: string) => ["theatre-reservations", "detail", id] as const,
} as const;

export function useTheatres(query: { q?: string; city?: string } = {}) {
  return useQuery({
    queryKey: theatreKeys.list(query),
    queryFn: async ({ signal }) => {
      try {
        return await apiGet<Envelope<Theatre[]>>(`/api/theatres${qs(query)}`, signal).then(
          (r) => r.data,
        );
      } catch {
        return localTheatreList(query);
      }
    },
  });
}

export function useTheatre(id: string | undefined) {
  const qc = useQueryClient();
  return useQuery<Theatre, Error>({
    enabled: Boolean(id),
    queryKey: theatreKeys.detail(id ?? ""),
    queryFn: async ({ signal }) => {
      try {
        return await apiGet<Envelope<Theatre>>(`/api/theatres/${id}`, signal).then((r) => r.data);
      } catch {
        const theatre = id ? theatreById(id) : undefined;
        if (!theatre) throw new Error(`Theatre not found: ${id ?? ""}`);
        return theatre;
      }
    },
    // Seed from the already-loaded list cache so tapping a card never flashes
    // a "Loading theatre…" spinner — the row data is enough to render the
    // hero + name + description while the detail request finishes.
    placeholderData: (prev) => {
      if (prev) return prev;
      if (!id) return undefined;
      const lists = qc.getQueriesData<Theatre[]>({ queryKey: ["theatres", "list"] });
      for (const [, theatres] of lists) {
        const match = theatres?.find((t) => t.id === id);
        if (match) return match;
      }
      return undefined;
    },
  });
}

export function useShows(query: { q?: string; theatreId?: string; date?: string } = {}) {
  return useQuery({
    queryKey: theatreKeys.shows(query),
    queryFn: async ({ signal }) => {
      try {
        return await apiGet<Envelope<Show[]>>(`/api/shows${qs(query)}`, signal).then((r) => r.data);
      } catch {
        return localShowList(query);
      }
    },
  });
}

export function useShow(id: string | undefined) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: theatreKeys.showDetail(id ?? ""),
    queryFn: async ({ signal }) => {
      try {
        return await apiGet<Envelope<Show>>(`/api/shows/${id}`, signal).then((r) => r.data);
      } catch {
        const show = id ? showById(id) : undefined;
        if (!show) throw new Error(`Show not found: ${id ?? ""}`);
        return show;
      }
    },
  });
}

export function useShowtimes(query: { showId?: string; theatreId?: string }) {
  const fallback = localShowtimeList(query);
  return useQuery({
    enabled: Boolean(query.showId || query.theatreId),
    queryKey: theatreKeys.showtimes(query),
    queryFn: async ({ signal }) => {
      try {
        const remote = await apiGet<Envelope<Showtime[]>>(
          `/api/showtimes${qs(query)}`,
          signal,
        ).then((r) => r.data);
        return remote.length > 0 ? remote : fallback;
      } catch {
        return fallback;
      }
    },
    initialData: fallback.length > 0 ? fallback : undefined,
  });
}

export function useShowtime(id: string | undefined) {
  const qc = useQueryClient();
  return useQuery<Showtime, Error>({
    enabled: Boolean(id),
    queryKey: ["showtimes", "detail", id ?? ""],
    queryFn: async ({ signal }) => {
      try {
        return await apiGet<Envelope<Showtime>>(`/api/showtimes/${id}`, signal).then((r) => r.data);
      } catch {
        const showtime = id ? showtimeById(id) : undefined;
        if (!showtime) throw new Error(`Showtime not found: ${id ?? ""}`);
        return showtime;
      }
    },
    // Seed from any already-loaded showtime list cache so opening /reserve from
    // the detail screen renders instantly while the detail request flies.
    placeholderData: (prev) => {
      if (prev) return prev;
      if (!id) return undefined;
      const lists = qc.getQueriesData<Showtime[]>({ queryKey: ["showtimes", "list"] });
      for (const [, list] of lists) {
        const match = list?.find((st) => st.id === id);
        if (match) return match;
      }
      return undefined;
    },
  });
}

export type SeatWithAvailability = Seat & { reserved: boolean };

export function useShowtimeSeats(showtimeId: string | undefined) {
  return useQuery({
    enabled: Boolean(showtimeId),
    queryKey: theatreKeys.seats(showtimeId ?? ""),
    queryFn: async ({ signal }) => {
      try {
        return await apiGet<Envelope<SeatWithAvailability[]>>(
          `/api/seats?showtimeId=${encodeURIComponent(showtimeId ?? "")}`,
          signal,
        ).then((r) => r.data);
      } catch {
        return (seatsByShowtime[showtimeId ?? ""] ?? []).map((seat) => ({
          ...seat,
          reserved: false,
        }));
      }
    },
  });
}

export function useTheatreReservations() {
  return useQuery({
    queryKey: theatreKeys.reservations,
    queryFn: ({ signal }) =>
      apiGet<Envelope<TheatreReservation[]>>(`/api/theatre-reservations`, signal).then(
        (r) => r.data,
      ),
  });
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const response = await authedFetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let detail = "";
    try {
      const text = await response.text();
      detail = text.slice(0, 200);
    } catch {
      // ignore
    }
    throw new Error(`POST ${path} failed (${response.status}): ${detail}`);
  }
  return ((await response.json()) as Envelope<T>).data;
}

async function deleteJSON<T>(path: string): Promise<T> {
  const response = await authedFetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`DELETE ${path} failed (${response.status})`);
  }
  return ((await response.json()) as Envelope<T>).data;
}

async function patchJSON<T>(path: string, body: unknown): Promise<T> {
  const response = await authedFetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let detail = "";
    try {
      const text = await response.text();
      detail = text.slice(0, 200);
    } catch {
      // ignore
    }
    throw new Error(`PATCH ${path} failed (${response.status}): ${detail}`);
  }
  return ((await response.json()) as Envelope<T>).data;
}

export function useCreateTheatreReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { showtimeId: string; seatIds: string[] }) =>
      postJSON<TheatreReservation>("/api/theatre-reservations", input),
    onSuccess: (reservation) => {
      qc.invalidateQueries({ queryKey: theatreKeys.reservations });
      qc.invalidateQueries({ queryKey: theatreKeys.seats(reservation.showtimeId) });
    },
  });
}

export function useUpdateTheatreReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; seatIds: string[] }) =>
      patchJSON<TheatreReservation>(`/api/theatre-reservations/${input.id}`, {
        seatIds: input.seatIds,
      }),
    onSuccess: (reservation) => {
      qc.invalidateQueries({ queryKey: theatreKeys.reservations });
      qc.invalidateQueries({ queryKey: theatreKeys.reservationDetail(reservation.id) });
      qc.invalidateQueries({ queryKey: theatreKeys.seats(reservation.showtimeId) });
    },
  });
}

export function useCancelTheatreReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      deleteJSON<{ id: string; status: "cancelled" }>(`/api/theatre-reservations/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: theatreKeys.reservations });
    },
  });
}

export function useTheatreReservation(id: string | undefined) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: theatreKeys.reservationDetail(id ?? ""),
    queryFn: ({ signal }) =>
      apiGet<Envelope<TheatreReservation>>(`/api/theatre-reservations/${id}`, signal).then(
        (r) => r.data,
      ),
  });
}
