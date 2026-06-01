import { Feather } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { Pressable } from "react-native";
import { useUniwind } from "uniwind";
import type { PrimaryRoute } from "../../lib/api/travel";
import { useAppData } from "../../lib/client";
import { HomeFeatureProvider } from "../../lib/client/features/home/provider";
import { useTravel } from "../../lib/client/features/travel-shell/provider";
import { FilterMenu } from "../../ui/components/filter-menu";
import { HomeContainer } from "./container";

export function HomeFeature({
  onOpenItem,
  route,
}: {
  onOpenItem: (itemId: string) => void;
  route: PrimaryRoute;
}) {
  return (
    <HomeFeatureProvider route={route}>
      <HomeContainer onOpenItem={onOpenItem} />
    </HomeFeatureProvider>
  );
}

export function HomeRoute() {
  const router = useRouter();
  const navigation = useNavigation();
  const { theme } = useUniwind();
  const tint = theme === "dark" ? "#fafafa" : "#222222";
  const { setRoute } = useTravel();
  const {
    actions: { filters },
    state: { filters: filtersState },
  } = useAppData();

  useLayoutEffect(() => {
    setRoute("homes");
  }, [setRoute]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          accessibilityLabel="Search"
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => router.push("/home/search")}
        >
          <Feather color={tint} name="search" size={22} />
        </Pressable>
      ),
      headerRight: () => (
        <FilterMenu
          count={filtersState.count}
          filters={filtersState.value}
          onChange={filters.update}
          onClear={filters.clear}
        >
          <Pressable
            accessibilityLabel="Open filters"
            accessibilityRole="button"
            hitSlop={12}
            testID="home-filter-button"
          >
            <Feather color={tint} name="sliders" size={22} />
          </Pressable>
        </FilterMenu>
      ),
    });
  }, [navigation, router, tint, filters, filtersState.count, filtersState.value]);

  return (
    <HomeFeature
      onOpenItem={(id) => router.push({ params: { id }, pathname: "/home/detail" })}
      route="homes"
    />
  );
}
