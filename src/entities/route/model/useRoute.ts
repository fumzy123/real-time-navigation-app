import { useEffect, useState } from "react";
import { getRoute } from "../api/getRoute";
import type { Position } from "../../location/model/store";
import type { Destination } from "../../destination/model/store";

export function useRoute(
  position: Position | null,
  destination: Destination | null
) {
  const shouldFetch = Boolean(position && destination);

  const [route, setRoute] = useState(null);

  useEffect(() => {
    // If inputs do NOT allow a route → do nothing.
    if (!shouldFetch || position === null || destination === null)
      return;

    const start: [number, number] = [position.lng, position.lat];
    const end: [number, number] = destination.coordinates;

    let cancelled = false;

    async function load() {
      const geometry = await getRoute(start, end);
      if (!cancelled) setRoute(geometry);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [shouldFetch, position, destination]);

  // Derive "no route" return from inputs (not setState)
  if (!shouldFetch) return null;

  return route;
}
