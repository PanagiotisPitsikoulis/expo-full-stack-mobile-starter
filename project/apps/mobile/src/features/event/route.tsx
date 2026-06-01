import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useAppData } from "../../lib/client";
import { useCreateEventReservation } from "../../lib/client/features/reservations/api";
import { EventScreen } from "../../ui/features/event/screen";

function defaultReservationDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function startsAtForDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date();
  date.setFullYear(year ?? date.getFullYear(), (month ?? 1) - 1, day ?? date.getDate());
  date.setHours(19, 0, 0, 0);
  return date.toISOString();
}

export function EventRoute({ presentedInSheet = false }: { presentedInSheet?: boolean }) {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === "string" ? params.id : undefined;
  const {
    actions: { wishlist },
    selectors,
  } = useAppData();
  const createEventReservation = useCreateEventReservation();
  const eventDetail = selectors.eventDetail(id);
  const initialDate = eventDetail.startsAt?.slice(0, 10) ?? defaultReservationDate();
  const [reservationDate, setReservationDate] = useState(initialDate);

  useEffect(() => {
    setReservationDate(initialDate);
  }, [initialDate]);

  return (
    <EventScreen
      image={eventDetail.image}
      imageSrc={selectors.imageSrc}
      item={eventDetail.item}
      lat={eventDetail.lat}
      lng={eventDetail.lng}
      onReserve={async () => {
        if (!eventDetail.reservable) return;
        try {
          await createEventReservation.mutateAsync({
            category: eventDetail.item.type === "recommended" ? "activity" : "event",
            eventId: eventDetail.item.id,
            image: eventDetail.image ? selectors.imageSrc(eventDetail.image) : undefined,
            lat: eventDetail.lat,
            lng: eventDetail.lng,
            startsAt: startsAtForDate(reservationDate),
            tickets: 1,
            title: eventDetail.item.title,
            venue: eventDetail.item.subtitle,
          });
        } catch {
          // Mutation error is rendered in the sheet footer.
        }
      }}
      onReservationDateChange={setReservationDate}
      onToggleSave={() => wishlist.toggleEvent(eventDetail.item.id)}
      presentedInSheet={presentedInSheet}
      reservationDate={reservationDate}
      reserveError={createEventReservation.error?.message}
      reservePending={createEventReservation.isPending}
      reservable={eventDetail.reservable}
      saved={wishlist.isEventSaved(eventDetail.item.id)}
    />
  );
}
