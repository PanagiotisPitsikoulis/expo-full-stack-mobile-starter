import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { seatPriceCents } from "../../lib/api/travel";
import { useRequireAuth } from "../../lib/client/auth-guard";
import {
  useCreateTheatreReservation,
  useShow,
  useShowtime,
  useShowtimeSeats,
  useTheatreReservation,
  useUpdateTheatreReservation,
} from "../../lib/client/features/theatres/api";
import { ReserveScreen } from "../../ui/features/theatres/reserve-screen";

function isUnauthorizedReservationError(err: unknown): boolean {
  return err instanceof Error && /\(401\)/.test(err.message);
}

function buildReserveRedirectPath({
  reservationId,
  showtimeId,
}: {
  reservationId?: string;
  showtimeId?: string;
}) {
  const params = new URLSearchParams();
  if (reservationId) params.set("reservationId", reservationId);
  if (showtimeId) params.set("showtimeId", showtimeId);
  const query = params.toString();
  return query ? `/theatres/reserve?${query}` : "/theatres/reserve";
}

export function ReserveRoute() {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const { reservationId, showtimeId } = useLocalSearchParams<{
    reservationId?: string;
    showtimeId?: string;
  }>();
  const { data: reservation } = useTheatreReservation(reservationId);
  const [hydratedReservationId, setHydratedReservationId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const resolvedShowtimeId = reservation?.showtimeId ?? showtimeId;
  const { data: seats = [], isLoading: seatsLoading } = useShowtimeSeats(resolvedShowtimeId);
  const { data: showtime } = useShowtime(resolvedShowtimeId);
  const { data: show } = useShow(showtime?.showId);
  const createReservation = useCreateTheatreReservation();
  const updateReservation = useUpdateTheatreReservation();

  useEffect(() => {
    if (!resolvedShowtimeId) return;
    setSelected([]);
    setError(null);
  }, [resolvedShowtimeId]);

  useEffect(() => {
    if (!reservation || hydratedReservationId === reservation.id) return;
    setSelected(reservation.seatIds);
    setHydratedReservationId(reservation.id);
  }, [hydratedReservationId, reservation]);

  const totalCents = useMemo(() => {
    if (selected.length === 0) return 0;
    const byId = new Map(seats.map((s) => [s.id, s] as const));
    return selected.reduce((sum, id) => {
      const seat = byId.get(id);
      return sum + (seat ? seatPriceCents(seat.category) : 0);
    }, 0);
  }, [seats, selected]);

  const toggleSeat = (seatId: string) => {
    setError(null);
    setSelected((current) =>
      current.includes(seatId) ? current.filter((id) => id !== seatId) : [...current, seatId],
    );
  };

  const confirm = requireAuth(async () => {
    if (!resolvedShowtimeId || selected.length === 0) return;
    setError(null);
    try {
      const nextReservation = reservationId
        ? await updateReservation.mutateAsync({
            id: reservationId,
            seatIds: selected,
          })
        : await createReservation.mutateAsync({
            showtimeId: resolvedShowtimeId,
            seatIds: selected,
          });
      router.replace({
        params: { id: nextReservation.id },
        pathname: "/theatres/confirmation",
      });
    } catch (err) {
      if (isUnauthorizedReservationError(err)) {
        router.replace({
          params: { redirect: buildReserveRedirectPath({ reservationId, showtimeId }) },
          pathname: "/(auth)/login",
        });
        return;
      }
      setError(err instanceof Error ? err.message : "Could not reserve seats");
    }
  });

  return (
    <ReserveScreen
      confirmLabel={reservationId ? "Update seats" : "Reserve"}
      editableReservedSeatIds={reservation?.seatIds ?? []}
      error={error}
      isLoading={seatsLoading}
      onConfirm={confirm ?? (() => undefined)}
      onToggleSeat={toggleSeat}
      pending={createReservation.isPending || updateReservation.isPending}
      seats={seats}
      selectedSeatIds={selected}
      show={show}
      showtime={showtime}
      totalCents={totalCents}
    />
  );
}
