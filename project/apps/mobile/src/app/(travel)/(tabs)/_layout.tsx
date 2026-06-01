import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";
import { hasExpoMaps } from "@/lib/client/native-capabilities";
import {
  getAirbnbAccent,
  getAirbnbAccentIndicator,
  getAirbnbAccentRipple,
} from "@/ui/theme/airbnb-colors";

export default function TabsLayout() {
  useColorScheme();
  const accent = getAirbnbAccent();
  const androidTabOptions =
    process.env.EXPO_OS === "android"
      ? {
          iconColor: { selected: accent },
          indicatorColor: getAirbnbAccentIndicator(),
          labelStyle: { selected: { color: accent } },
          rippleColor: getAirbnbAccentRipple(),
        }
      : {};
  const nativeTabOptions = {
    tintColor: accent,
    ...androidTabOptions,
  };

  return (
    <NativeTabs minimizeBehavior="never" {...nativeTabOptions}>
      <NativeTabs.Trigger name="ai">
        <NativeTabs.Trigger.Label>AI</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "sparkles", selected: "sparkles" }}
          md="auto_awesome"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Homes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="activities">
        <NativeTabs.Trigger.Label>Activities</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "binoculars", selected: "binoculars.fill" }}
          md="explore"
        />
      </NativeTabs.Trigger>
      {hasExpoMaps ? (
        <NativeTabs.Trigger name="map">
          <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: "map", selected: "map.fill" }} md="map" />
        </NativeTabs.Trigger>
      ) : null}
      <NativeTabs.Trigger name="profile" role="search">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }}
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
