// src/entities/location/model/useCurrentLocation.ts
import { useEffect } from "react";
import { useLocationStore } from "./store";

export default function useCurrentLocation() {
  const { enabled, position, setPosition } = useLocationStore();

  useEffect(() => {
    if (!enabled || !navigator.geolocation) {
      setPosition(null); // ensure position is cleared when disabled
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
      },
      (err) => {
        console.warn("Location error:", err);
        setPosition(null);
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [enabled, setPosition]);

  return position; // returns null if disabled
}
