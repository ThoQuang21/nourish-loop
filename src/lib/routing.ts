import type { LatLng } from "@/lib/api";

export interface RouteResult {
  coordinates: [number, number][]; // [lng, lat][] — geometry tuyến đường
  distanceKm: number;
  durationMin: number;
}

/**
 * Lấy tuyến đường đi (theo đường thật) qua OSRM — máy chủ định tuyến công khai, MIỄN PHÍ, không cần key.
 * Dùng cho prototype/demo. Lên prod nên tự host OSRM hoặc dùng Goong Directions (REST key).
 */
export async function getRoute(origin: LatLng, dest: LatLng): Promise<RouteResult | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${origin.lng},${origin.lat};${dest.lng},${dest.lat}` +
    `?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route?.geometry?.coordinates) return null;
    return {
      coordinates: route.geometry.coordinates as [number, number][],
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60,
    };
  } catch {
    return null;
  }
}
