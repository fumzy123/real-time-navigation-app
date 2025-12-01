import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import useCurrentLocation from "../../../entities/location/model/useCurrentLocation";

import { useDestinationStore } from "../../../entities/destination";
import { useLocationStore } from "../../../entities/location/model/store";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export function NavigationPage() {
  // ---- Global toggle + current location ----
  const { enabled } = useLocationStore();
  const position = useCurrentLocation(); // returns null if disabled

  // ---- Destination ----
  const destination = useDestinationStore((s) => s.selected);

  // ---- Debug logs ----
  console.log("Location enabled:", enabled);
  console.log("Current position:", position);
  console.log("Destination:", destination);

  // ---- Refs ----
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // ---- Init map once ----
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: destination?.coordinates ?? [0, 0],
      zoom: 14,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // ---- Marker updates after map is loaded ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Ensure map is ready once — then run marker logic
    map.once("load", () => {
      console.log("MAP LOADED ✔");

      // ---------------- USER MARKER ----------------
      if (enabled && position) {
        if (!userMarkerRef.current) {
          const el = document.createElement("div");
          el.style.width = "20px";
          el.style.height = "20px";
          el.style.backgroundColor = "blue";
          el.style.borderRadius = "50%";
          el.style.border = "2px solid white";

          userMarkerRef.current = new mapboxgl.Marker({ element: el })
            .setLngLat([position.lng, position.lat])
            .addTo(map);

          console.log("User marker created");
        } else {
          userMarkerRef.current.setLngLat([
            position.lng,
            position.lat,
          ]);
          console.log("User marker updated:", [
            position.lng,
            position.lat,
          ]);
        }

        // Optional center
        map.setCenter([position.lng, position.lat]);
      } else if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
        console.log("User marker removed");
      }

      // ---------------- DESTINATION MARKER ----------------
      if (destination) {
        if (!destMarkerRef.current) {
          destMarkerRef.current = new mapboxgl.Marker({
            color: "red",
          })
            .setLngLat(destination.coordinates)
            .addTo(map);

          console.log("Destination marker created");
        } else {
          destMarkerRef.current.setLngLat(destination.coordinates);
          console.log(
            "Destination marker updated:",
            destination.coordinates
          );
        }
      } else if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
        console.log("Destination marker removed");
      }
    });
  }, [position, destination, enabled]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 style={{ padding: 10 }}>Navigation</h2>

      {!position && enabled && (
        <p style={{ padding: 10, color: "#666" }}>
          Fetching your current location...
        </p>
      )}

      <div
        ref={containerRef}
        style={{ width: "100%", height: "90vh" }}
      />
    </div>
  );
}
