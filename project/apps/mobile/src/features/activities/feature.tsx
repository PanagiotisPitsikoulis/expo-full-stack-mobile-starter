import { Feather } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { Pressable, View } from "react-native";
import { useUniwind } from "uniwind";
import { useAppData } from "../../lib/client";
import { useTravel } from "../../lib/client/features/travel-shell/provider";
import { ActivityFilterMenu } from "../../ui/components/activity-filter-menu";
import { HomeFeature } from "../home/feature";

export function ActivitiesRoute() {
  const router = useRouter();
  const navigation = useNavigation();
  const { theme } = useUniwind();
  const tint = theme === "dark" ? "#fafafa" : "#222222";
  const { setRoute } = useTravel();
  const {
    actions: { activityFilters },
    state: { activityFilters: activityFiltersState },
  } = useAppData();

  useLayoutEffect(() => {
    setRoute("activities");
  }, [setRoute]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          accessibilityLabel="Search"
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => router.push("/activities/search")}
        >
          <Feather color={tint} name="search" size={22} />
        </Pressable>
      ),
      headerRight: () => (
        <View className="mr-1 flex-row items-center gap-6 px-2 py-1">
          <Pressable
            accessibilityLabel="Open theatres"
            accessibilityRole="button"
            className="p-1"
            hitSlop={12}
            onPress={() => router.push("/theatres")}
            testID="activities-theatres-button"
          >
            <Feather color={tint} name="film" size={22} />
          </Pressable>
          <ActivityFilterMenu
            filters={activityFiltersState.value}
            onChange={activityFilters.update}
            onClear={activityFilters.clear}
          >
            <Pressable
              accessibilityLabel="Open activity filters"
              accessibilityRole="button"
              className="p-1"
              hitSlop={12}
              testID="activities-filter-button"
            >
              <Feather color={tint} name="sliders" size={22} />
            </Pressable>
          </ActivityFilterMenu>
        </View>
      ),
    });
  }, [navigation, router, tint, activityFilters, activityFiltersState.value]);

  return (
    <HomeFeature
      onOpenItem={(id) => router.push({ params: { id }, pathname: "/activities/event" })}
      route="activities"
    />
  );
}
