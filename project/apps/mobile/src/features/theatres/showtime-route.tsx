import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useShows, useShowtimes } from "../../lib/client/features/theatres/api";
import { ShowtimeScreen } from "../../ui/features/theatres/showtime-screen";

export function ShowtimeRoute() {
  const router = useRouter();
  const { showtimeId, theatreId } = useLocalSearchParams<{
    showtimeId?: string;
    theatreId?: string;
  }>();
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | undefined>(showtimeId);
  const { data: showtimes = [], isLoading: showtimesLoading } = useShowtimes({ theatreId });
  const { data: shows = [], isLoading: showsLoading } = useShows({ theatreId });
  const sortedShowtimes = useMemo(() => {
    const now = new Date().toISOString();
    return [...showtimes]
      .filter((showtime) => showtime.startsAt > now)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [showtimes]);

  useEffect(() => {
    setSelectedShowtimeId(showtimeId);
  }, [showtimeId]);

  useEffect(() => {
    if (selectedShowtimeId || sortedShowtimes.length === 0) return;
    setSelectedShowtimeId(sortedShowtimes[0].id);
  }, [selectedShowtimeId, sortedShowtimes]);

  return (
    <ShowtimeScreen
      isLoading={showtimesLoading || showsLoading}
      onContinue={() => {
        if (!selectedShowtimeId) return;
        router.push({
          params: { showtimeId: selectedShowtimeId, theatreId },
          pathname: "/theatres/reserve",
        });
      }}
      onSelectShowtime={setSelectedShowtimeId}
      selectedShowtimeId={selectedShowtimeId}
      shows={shows}
      showtimes={sortedShowtimes}
    />
  );
}
