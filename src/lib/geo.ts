/** Small geo helpers: distance, formatting and sensible defaults (no map SDK needed). */

export interface LatLng {
  lat: number;
  lng: number;
}

/** Where the map opens when we know nothing about the user yet (Lagos Island). */
export const DEFAULT_CENTER: LatLng = { lat: 6.4474, lng: 3.4553 };

export function hasCoords(p: { lat?: number | null; lng?: number | null } | null | undefined): p is LatLng {
  return !!p && typeof p.lat === 'number' && typeof p.lng === 'number' && !Number.isNaN(p.lat) && !Number.isNaN(p.lng);
}

/** Great-circle distance in kilometres. */
export function distanceKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.max(50, Math.round(km * 1000 / 50) * 50)} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

/** Rough bike courier ETA used only for display, in whole minutes (18 km/h + 6 min hand-over). */
export function estimateRideMinutes(km: number) {
  return Math.round(6 + (km / 18) * 60);
}

/** Bounding box that contains every point, padded so markers are not on the edge. */
export function boundsFor(points: LatLng[], padFactor = 0.25) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  let minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const padLat = Math.max((maxLat - minLat) * padFactor, 0.004);
  const padLng = Math.max((maxLng - minLng) * padFactor, 0.004);
  minLat -= padLat; maxLat += padLat; minLng -= padLng; maxLng += padLng;
  return { ne: [maxLng, maxLat] as [number, number], sw: [minLng, minLat] as [number, number] };
}

/** Builds a one-line address from reverse-geocoding output. */
export function joinAddress(parts: Array<string | null | undefined>) {
  return parts.map((p) => p?.trim()).filter(Boolean).join(', ');
}
