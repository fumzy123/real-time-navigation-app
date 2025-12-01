import { useEffect, useRef, useCallback } from "react";
import { useLocationStore, type Position } from "./store";

// --- Type Definitions ---

/** Defines the possible status states for the geolocation hook. */
type GeolocationStatus =
  | "loading"
  | "idle"
  | "prompt"
  | "granted"
  | "denied"
  | "unavailable";

/** Defines the structure of the location data returned by the hook. */
// interface GeolocationPositionPayload {
//   lat: number;
//   lng: number;
//   accuracy: number;
//   altitude: number | null;
//   altitudeAccuracy: number | null;
//   heading: number | null;
//   speed: number | null;
//   timestamp: number;
// }

/** Defines the configuration options for the Geolocation API. */
interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
}

/** Defines the public API returned by the hook. */
interface UseCurrentLocationResult {
  status: GeolocationStatus;
  position: Position | null;
  start: () => void;
  stop: () => void;
}

/**
 * useCurrentLocation Custom Hook
 * @param options - Configuration for watchPosition (enableHighAccuracy, maximumAge, timeout)
 */

export default function useCurrentLocation({
  enableHighAccuracy = true,
  maximumAge = 2000,
  timeout = 10000,
}: GeolocationOptions = {}): UseCurrentLocationResult {
  const { position, status, setPosition, setStatus } =
    useLocationStore();
  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = useCallback(
    (pos: GeolocationPosition) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed,
        timestamp: pos.timestamp,
      });

      setStatus("granted");
    },
    [setPosition, setStatus]
  );

  const handleError = useCallback(
    (err: GeolocationPositionError) => {
      if (err.code === 1) setStatus("denied");
      else setStatus("unavailable");
    },
    [setStatus]
  );

  const start = useCallback(() => {
    if (watchIdRef.current != null) return;

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, maximumAge, timeout }
    );

    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, maximumAge, timeout }
    );
    watchIdRef.current = id;
  }, [
    handleSuccess,
    handleError,
    enableHighAccuracy,
    maximumAge,
    timeout,
  ]);

  const stop = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Auto-start when permission granted
  useEffect(() => {
    if (status === "granted" && watchIdRef.current == null) {
      start();
    }
  }, [status, start]);

  return {
    position,
    status,
    start,
    stop,
  };
}
