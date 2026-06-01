import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useAppData } from "../../lib/client";
import {
  type Reservation,
  type ReservationEditDraft,
  useCancelReservation,
  useReservations,
  useUpdateReservation,
} from "../../lib/client/features/reservations/api";
import { type ReservationFilter, TripsScreen } from "../../ui/features/trips/screen";

function draftFromReservation(reservation: Reservation): ReservationEditDraft {
  if (reservation.kind === "stay") {
    return {
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guests: String(reservation.guests),
      tickets: "1",
    };
  }
  return {
    checkIn: "",
    checkOut: "",
    guests: "1",
    tickets: reservation.kind === "event" ? String(reservation.tickets) : "1",
  };
}

function isHistoricalReservation(reservation: Reservation) {
  if (reservation.status !== "confirmed") return true;
  const referenceDate =
    reservation.kind === "stay" ? reservation.checkOut : reservation.item.startsAt;
  if (!referenceDate) return false;
  return Date.parse(referenceDate) < Date.now();
}

function isEditableReservation(reservation: Reservation) {
  return reservation.status === "confirmed" && !isHistoricalReservation(reservation);
}

function reservationMatchesFilter(reservation: Reservation, filter: ReservationFilter) {
  if (filter === "homes") return reservation.kind === "stay";
  if (filter === "activities") return reservation.kind === "event";
  return reservation.kind === "theatre";
}

export function TripsRoute() {
  const router = useRouter();
  const reservationsQuery = useReservations();
  const cancelReservation = useCancelReservation();
  const updateReservation = useUpdateReservation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>("homes");
  const [editDraft, setEditDraft] = useState<ReservationEditDraft>({
    checkIn: "",
    checkOut: "",
    guests: "1",
    tickets: "1",
  });
  const {
    actions: { selection },
  } = useAppData();
  const reservations = reservationsQuery.data ?? [];
  const activeReservations = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservationMatchesFilter(reservation, activeFilter) &&
          !isHistoricalReservation(reservation),
      ),
    [activeFilter, reservations],
  );
  const historyReservations = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservationMatchesFilter(reservation, activeFilter) &&
          isHistoricalReservation(reservation),
      ),
    [activeFilter, reservations],
  );
  const editableReservationIds = useMemo(
    () => reservations.filter(isEditableReservation).map((reservation) => reservation.id),
    [reservations],
  );

  const startEdit = (reservation: Reservation) => {
    if (reservation.kind === "theatre") {
      router.push({
        params: { reservationId: reservation.id, showtimeId: reservation.showtimeId },
        pathname: "/theatres/reserve",
      });
      return;
    }
    setEditingId(reservation.id);
    setEditDraft(draftFromReservation(reservation));
  };

  const saveEdit = async (reservation: Reservation) => {
    try {
      if (reservation.kind === "stay") {
        await updateReservation.mutateAsync({
          checkIn: editDraft.checkIn,
          checkOut: editDraft.checkOut,
          guests: Number(editDraft.guests),
          id: reservation.id,
          kind: "stay",
        });
      } else if (reservation.kind === "event") {
        await updateReservation.mutateAsync({
          id: reservation.id,
          kind: "event",
          tickets: Number(editDraft.tickets),
        });
      }
      setEditingId(null);
    } catch {
      // Mutation errors are swallowed; the UI does not surface them.
    }
  };

  return (
    <TripsScreen
      activeFilter={activeFilter}
      activeReservations={activeReservations}
      editDraft={editDraft}
      editableReservationIds={editableReservationIds}
      editingId={editingId}
      historyReservations={historyReservations}
      loading={reservationsQuery.isLoading}
      onCancelReservation={(reservation) =>
        cancelReservation.mutate({ id: reservation.id, kind: reservation.kind })
      }
      onChangeEditDraft={(next) => setEditDraft((draft) => ({ ...draft, ...next }))}
      onCloseEdit={() => setEditingId(null)}
      onFilterChange={(filter) => {
        setEditingId(null);
        setActiveFilter(filter);
      }}
      onOpenReservation={(reservation) => {
        if (reservation.kind === "stay") {
          selection.selectHome(reservation.homeId);
          router.push("/home/detail");
          return;
        }
        if (reservation.kind === "event") {
          router.push({ pathname: "/activities/event", params: { id: reservation.eventId } });
          return;
        }
        router.push({ pathname: "/theatres/confirmation", params: { id: reservation.id } });
      }}
      onSaveEdit={saveEdit}
      onStartEdit={startEdit}
      pending={cancelReservation.isPending || updateReservation.isPending}
    />
  );
}
