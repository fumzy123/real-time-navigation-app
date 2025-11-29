import { useEffect, useRef, useState, useCallback } from "react";

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
interface GeolocationPositionPayload {
  lat: number;
  lng: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

/** Defines the configuration options for the Geolocation API. */
interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
}

/** Defines the public API returned by the hook. */
interface UseCurrentLocationResult {
  status: GeolocationStatus;
  position: GeolocationPositionPayload | null;
  error: Error | null;
  start: () => void;
  stop: () => void;
}

// --- Utility Functions ---

/**
 * 1. New function to get initial status asynchronously (non-blocking)
 * Checks the current permission state without triggering a prompt.
 */
const getInitialStatus = async (): Promise<GeolocationStatus> => {
  if (!("permissions" in navigator)) {
    return "idle";
  }
  try {
    const p = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    if (p.state === "granted") return "granted";
    if (p.state === "denied") return "denied";
    return "prompt";
  } catch (e: unknown) {
    console.log(e);
    // silently ignore permission probe errors
    return "idle";
  }
};

/**
 * useCurrentLocation Custom Hook
 * @param options - Configuration for watchPosition (enableHighAccuracy, maximumAge, timeout)
 */
export default function useCurrentLocation({
  enableHighAccuracy = true,
  maximumAge = 2000,
  timeout = 10000,
}: GeolocationOptions = {}): UseCurrentLocationResult {
  // ---------------------------- State Variables ---------------------------------------------
  const [status, setStatus] = useState<GeolocationStatus>("loading");
  const [position, setPosition] =
    useState<GeolocationPositionPayload | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // ----------------------------- Handlers & Helpers -------------------------------------------

  /** Helper to process a successful position retrieval */
  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    const payload: GeolocationPositionPayload = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      altitude: pos.coords.altitude,
      altitudeAccuracy: pos.coords.altitudeAccuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      timestamp: pos.timestamp,
    };
    setPosition(payload);
    setError(null);
    setStatus("granted");
  }, []);

  /** Helper to process a position error */
  const handleError = useCallback((err: GeolocationPositionError) => {
    setError(err);
    // Map common codes
    if (err && err.code === 1)
      setStatus("denied"); // PERMISSION_DENIED
    else if (err && err.code === 2)
      setStatus("unavailable"); // POSITION_UNAVAILABLE
    else if (err && err.code === 3)
      setStatus("unavailable"); // TIMEOUT
    else setStatus("unavailable");
  }, []);

  /** Helper to handle attaching the permission change listener */
  const attachPermissionListener = useCallback(async (): Promise<
    () => void
  > => {
    if (!("permissions" in navigator)) {
      return () => {}; // No-op cleanup
    }
    try {
      const p = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });

      // Update status immediately after the query
      if (p.state === "granted") setStatus("granted");
      else if (p.state === "prompt") setStatus("prompt");
      else if (p.state === "denied") setStatus("denied");

      // Attach listener for future changes
      const handlePermissionChange = () => {
        const newState = p.state as GeolocationStatus;
        if (
          newState === "granted" ||
          newState === "prompt" ||
          newState === "denied"
        ) {
          setStatus(newState);
        }
      };
      p.onchange = handlePermissionChange;

      // Return cleanup function to remove the listener
      return () => {
        p.onchange = null;
      };
    } catch (e) {
      // silently ignore permission probe errors
      return () => {}; // return a no-op cleanup
    }
  }, []);

  // ---------------------- Effects --------------------------------------------

  /** 3. Effect to handle initialization and attach the permission listener */
  useEffect(() => {
    // 1. Initialize cleanup listener as a no-op function for safety
    let cleanupListener = () => {};

    // 2. Define an async function to handle the initialization logic
    const initialize = async () => {
      // We handle the initial status check and set the state first
      const initialStatus = await getInitialStatus();
      setStatus(initialStatus);

      // 3. AWAIT the result of attachPermissionListener() to get the synchronous cleanup function
      // This ensures cleanupFn holds the synchronous function, not the Promise.
      const cleanupFn = await attachPermissionListener();

      // 4. Assign the synchronous function to the outer scoped variable
      cleanupListener = cleanupFn;
    };

    // 5. Run the async initialization logic
    initialize();

    // 6. Cleanup function returns the synchronous, assigned cleanupListener
    return () => {
      // This runs the cleanup listener obtained from the resolved Promise
      cleanupListener();
    };
  }, [attachPermissionListener]);

  /** Function to start watching position */
  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError(new Error("Geolocation API not available"));
      setStatus("unavailable");
      return;
    }

    // If already watching, keep it
    if (watchIdRef.current != null) return;

    // Request a one-shot getCurrentPosition first to trigger prompt quickly
    navigator.geolocation.getCurrentPosition(
      (p) => {
        handleSuccess(p);
        // then start watching
        const id = navigator.geolocation.watchPosition(
          handleSuccess,
          handleError,
          {
            enableHighAccuracy,
            maximumAge,
            timeout,
          }
        );
        watchIdRef.current = id;
      },
      (err) => {
        handleError(err);
        // If permission denied or error, don't start watch
      },
      { enableHighAccuracy, maximumAge, timeout }
    );

    // Minor adjustment: set to 'prompt' only if we haven't already determined a status
    setStatus((s) =>
      s === "idle" || s === "loading" ? "prompt" : s
    );
  }, [
    enableHighAccuracy,
    maximumAge,
    timeout,
    handleError,
    handleSuccess,
  ]);

  /** Function to stop watching position */
  const stop = useCallback(() => {
    if (watchIdRef.current != null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setStatus((s) => (s === "granted" ? "idle" : s));
  }, []);

  /** Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (watchIdRef.current != null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // --- Return Value ---
  return {
    status,
    position,
    error,
    start,
    stop,
  };
}
