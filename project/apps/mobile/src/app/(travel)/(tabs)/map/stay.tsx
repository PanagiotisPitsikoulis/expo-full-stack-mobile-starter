import { Redirect, useLocalSearchParams } from "expo-router";
import { hasExpoMaps } from "@/lib/client/native-capabilities";

export default function MapStayScreenRoute() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === "string" ? params.id : undefined;

  if (!hasExpoMaps) return <Redirect href="/home" />;
  return <Redirect href={{ params: id ? { id } : undefined, pathname: "/home/detail" }} />;
}
