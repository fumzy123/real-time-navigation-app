import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import { useCurrentLocation } from "../../../entities/location";
import { useDestinationStore } from "../../../entities/destination";

// import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export function NavigationPage() {
  // UI Entities
  const { position, status } = useCurrentLocation();
  const destination = useDestinationStore((s) => s.selected);
  console.log("Destination:", destination);
  console.log("Position:", position);

  // ---------------------- Ref --------------------------------
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // ----------------------- Effect --------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: destination?.coordinates ?? [0, 0],
      zoom: 12,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Add markers when location or destination changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (position) {
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat([position.lng, position.lat])
        .addTo(mapRef.current);
    }

    if (destination) {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat(destination.coordinates)
        .addTo(mapRef.current);
    }
  }, [position, destination]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 style={{ padding: 10 }}>Navigation</h2>

      {status !== "granted" && (
        <p style={{ padding: 10 }}>Waiting for GPS permission...</p>
      )}

      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "90vh" }}
      />
    </div>
  );
}
