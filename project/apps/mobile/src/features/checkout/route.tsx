import { useRouter } from "expo-router";
import { formatTripDateRange } from "../../lib/api/travel";
import { useAppData } from "../../lib/client";
import { useCreateStayReservation } from "../../lib/client/features/reservations/api";
import { useTravel } from "../../lib/client/features/travel-shell/provider";
import { CheckoutScreen } from "../../ui/features/checkout/screen";

export function CheckoutRoute() {
  const router = useRouter();
  const {
    selectors,
    state: { booking: bookingState, detail },
  } = useAppData();
  const { route } = useTravel();
  const createReservation = useCreateStayReservation();
  const copy = detail.copy[route];

  return (
    <CheckoutScreen
      badge={copy.badge}
      draft={bookingState.draft}
      error={createReservation.error?.message ?? bookingState.error}
      imageSrc={selectors.imageSrc}
      onBack={() => router.back()}
      onComplete={() => router.replace("/profile/trips")}
      onConfirm={() =>
        createReservation.mutateAsync({
          checkIn: bookingState.draft.checkIn,
          checkOut: bookingState.draft.checkOut,
          guests: bookingState.draft.guests,
          listingId: bookingState.selectedHome.id,
        })
      }
      pending={createReservation.isPending}
      quote={bookingState.quote}
      rareFind={copy.rareFind}
      selectedHome={bookingState.selectedHome}
      tripDates={formatTripDateRange(bookingState.draft.checkIn, bookingState.draft.checkOut)}
    />
  );
}
