import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useUniwind } from "uniwind";
import { useAppData } from "../../lib/client";
import { useShows, useTheatres } from "../../lib/client/features/theatres/api";
import {
  defaultTheatreFilters,
  TheatreFilterMenu,
  type TheatreFilters,
} from "../../ui/components/theatre-filter-menu";
import { TheatresList } from "../../ui/features/theatres/theatres-list";

export function TheatresListRoute() {
  const router = useRouter();
  const { theme } = useUniwind();
  const tint = theme === "dark" ? "#fafafa" : "#222222";
  const {
    actions: { wishlist },
    selectors,
  } = useAppData();
  const { data: theatres = [], isLoading } = useTheatres();
  const { data: shows = [] } = useShows({});
  const [filters, setFilters] = useState<TheatreFilters>(defaultTheatreFilters);

  const availableCountries = useMemo(
    () => [...new Set(theatres.map((t) => t.country))].sort(),
    [theatres],
  );
  const availableGenres = useMemo(() => [...new Set(shows.map((s) => s.genre))].sort(), [shows]);

  const filtered = useMemo(() => {
    let list = theatres;
    if (filters.countries.length > 0) {
      const allowed = new Set(filters.countries);
      list = list.filter((t) => allowed.has(t.country));
    }
    if (filters.genres.length > 0) {
      const allowedGenres = new Set(filters.genres);
      const allowedTheatres = new Set(
        shows.filter((s) => allowedGenres.has(s.genre)).map((s) => s.theatreId),
      );
      list = list.filter((t) => allowedTheatres.has(t.id));
    }
    return list;
  }, [filters.countries, filters.genres, shows, theatres]);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              accessibilityLabel="Back to activities"
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => router.replace("/activities")}
              testID="theatres-back-to-activities-button"
            >
              <Feather color={tint} name="arrow-left" size={22} />
            </Pressable>
          ),
          headerRight: () => (
            <View className="mr-1 flex-row items-center gap-6 px-2 py-1">
              <Pressable
                accessibilityLabel="Search theatres"
                accessibilityRole="button"
                className="p-1"
                hitSlop={12}
                onPress={() => router.push("/theatres/search")}
                testID="theatres-search-button"
              >
                <Feather color={tint} name="search" size={22} />
              </Pressable>
              <TheatreFilterMenu
                availableCountries={availableCountries}
                availableGenres={availableGenres}
                filters={filters}
                onChange={(next) => setFilters((current) => ({ ...current, ...next }))}
                onClear={() => setFilters(defaultTheatreFilters)}
              >
                <Pressable
                  accessibilityLabel="Open theatre filters"
                  accessibilityRole="button"
                  className="p-1"
                  hitSlop={12}
                  testID="theatres-filter-button"
                >
                  <Feather color={tint} name="sliders" size={22} />
                </Pressable>
              </TheatreFilterMenu>
            </View>
          ),
        }}
      />
      <TheatresList
        imageSrc={selectors.imageSrc}
        isSaved={wishlist.isEventSaved}
        isLoading={isLoading}
        onOpenTheatre={(id) => router.push({ params: { id }, pathname: "/theatres/detail" })}
        onToggleSave={wishlist.toggleEvent}
        theatres={filtered}
      />
    </>
  );
}
