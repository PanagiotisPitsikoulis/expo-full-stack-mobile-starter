import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  useCancelTheatreReservation,
  useShow,
  useShowtime,
  useShowtimeSeats,
  useTheatre,
  useTheatreReservation,
} from "../../lib/client/features/theatres/api";
import { ConfirmationScreen } from "../../ui/features/theatres/confirmation-screen";

export function ConfirmationRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: reservation, isLoading } = useTheatreReservation(id);
  const { data: showtime } = useShowtime(reservation?.showtimeId);
  const { data: show } = useShow(showtime?.showId);
  const { data: theatre } = useTheatre(showtime?.theatreId);
  const { data: seats = [] } = useShowtimeSeats(reservation?.showtimeId);
  const cancelReservation = useCancelTheatreReservation();

  const seatLabels = useMemo(() => {
    if (!reservation) return [];
    const byId = new Map(seats.map((s) => [s.id, s] as const));
    return reservation.seatIds.map((sid) => {
      const seat = byId.get(sid);
      return seat ? `${seat.row}${seat.number}` : sid.slice(-4);
    });
  }, [reservation, seats]);

  return (
    <ConfirmationScreen
      isLoading={isLoading}
      onBackToTheatres={() => router.replace("/theatres")}
      onCancel={async () => {
        if (!id) return;
        try {
          await cancelReservation.mutateAsync(id);
        } catch {
          // surface in a richer UI later
        }
      }}
      pending={cancelReservation.isPending}
      reservation={reservation}
      seatLabels={seatLabels}
      show={show}
      showtime={showtime}
      theatre={theatre}
    />
  );
}
