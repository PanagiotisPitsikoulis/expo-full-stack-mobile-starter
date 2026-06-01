import type { Home } from "./homes-dataset";

export type Coordinate = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS_KM = 6371;

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceKm(a: Coordinate, b: Coordinate) {
  const latDelta = degreesToRadians(b.lat - a.lat);
  const lngDelta = degreesToRadians(b.lng - a.lng);
  const latA = degreesToRadians(a.lat);
  const latB = degreesToRadians(b.lat);

  const haversine =
    Math.sin(latDelta / 2) ** 2 + Math.cos(latA) * Math.cos(latB) * Math.sin(lngDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine));
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}

export function sortHomesByDistance(homes: Home[], origin: Coordinate) {
  return homes
    .map((home) => ({
      home,
      distance: distanceKm(origin, { lat: home.lat, lng: home.lng }),
    }))
    .sort((a, b) => a.distance - b.distance);
}
