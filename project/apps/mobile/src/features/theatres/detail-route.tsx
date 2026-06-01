import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useAppData } from "../../lib/client";
import { useShows, useShowtimes, useTheatre } from "../../lib/client/features/theatres/api";
import { TheatreDetail } from "../../ui/features/theatres/theatre-detail";

export function TheatreDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    actions: { wishlist },
  } = useAppData();
  const { data: theatre, isLoading: theatreLoading } = useTheatre(id);
  const { data: shows = [], isLoading: showsLoading } = useShows({ theatreId: id });
  const { data: showtimes = [], isLoading: showtimesLoading } = useShowtimes({ theatreId: id });
  const nextShowtime = useMemo(() => {
    const now = new Date().toISOString();
    return [...showtimes]
      .filter((showtime) => showtime.startsAt > now)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
  }, [showtimes]);

  return (
    <TheatreDetail
      isLoading={theatreLoading || showsLoading || showtimesLoading}
      onReserveNext={() => {
        if (!id) return;
        router.push({
          params: { showtimeId: nextShowtime?.id, theatreId: id },
          pathname: "/theatres/showtime",
        });
      }}
      onToggleSave={() => {
        if (!theatre) return;
        wishlist.toggleEvent(theatre.id);
      }}
      saved={theatre ? wishlist.isEventSaved(theatre.id) : false}
      showtimes={showtimes}
      shows={shows}
      theatre={theatre}
    />
  );
}
