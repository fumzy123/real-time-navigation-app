import { useQuery } from "@tanstack/react-query";
import { getRoute } from "../api/getRoute";
import type { Position } from "../../location/model/store";
import type { Destination } from "../../destination/model/store";

// 1. Define the type for the data returned by getRoute
interface RouteData {
  geometry: GeoJSON.Geometry | null; // Assuming Mapbox geometry is a GeoJSON Geometry object
  duration: number | null; // Duration is typically in seconds
}

/**
 * Custom hook to fetch the route (geometry and duration) between a starting position and a destination.
 *
 * @param position - The starting position (Position | null).
 * @param destination - The final destination (Destination | null).
 * @returns The query result object from useQuery.
 */
export function useRoute(
  position: Position | null,
  destination: Destination | null
) {
  const shouldFetch = Boolean(position && destination);

  // Derive coordinates
  const start: [number, number] | null = position
    ? [position.lng, position.lat]
    : null;
  const end: [number, number] | null = destination
    ? destination.coordinates
    : null;

  // 2. Use the new RouteData type in useQuery
  const queryResult = useQuery<RouteData, Error>({
    // The queryKey uniquely identifies this specific route request
    queryKey: ["route", start, end],

    // The queryFn calls your updated API function
    queryFn: async () => {
      if (!start || !end) {
        // This throw should not occur if 'enabled' is correctly set
        throw new Error("Missing coordinates for route query.");
      }
      const data = await getRoute(start, end);
      console.log("🚀 ~ queryFn: ~ data:", data);
      return data;
    },
    enabled: shouldFetch,
  });

  return queryResult;
}
