import { Redirect } from "expo-router";
import { MapRoute } from "@/features/map";
import { hasExpoMaps } from "@/lib/client/native-capabilities";

export default function MapScreen() {
  if (!hasExpoMaps) return <Redirect href="/home" />;
  return <MapRoute />;
}
