// src/features/navigation-map/ui/NavigationMap.tsx

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Assuming these are the entity imports from the shared layer
import useCurrentLocation from "../../../entities/location/model/useCurrentLocation";
import { useDestinationStore } from "../../../entities/destination";
import { useLocationStore } from "../../../entities/location/model/store";
import { useRoute } from "../../../entities/route/model/useRoute";

// NOTE: Access Token is typically set globally or in environment setup.
// Keep it here for clarity, but it only needs to be run once.
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export function NavigationMap() {
  // ---- Dependencies from Entity Layer ----
  const { enabled } = useLocationStore();
  const position = useCurrentLocation();
  const destination = useDestinationStore((s) => s.selected);
  const { data: routeData, isLoading: isRouteLoading } = useRoute(
    position,
    destination
  );

  // ---- Debug logs ----
  console.log("🚀 ~ NavigationMap ~ routeData:", routeData?.geometry);

  // ---- Refs for Mapbox instances ----
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // ---- Effect 1: Init map once ----
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: destination?.coordinates ?? [0, 0],
      zoom: 14,
    });

    mapRef.current = map;

    // Cleanup: Remove the map instance when the component unmounts
    return () => map.remove();
  }, []); // Empty dependency array ensures it runs only on mount

  // ---- Effect 2: Marker updates and centering ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Wait for the map to load before trying to add/update elements
    if (!map.loaded()) {
      map.on("load", () => updateMarkers(map));
      return;
    }

    const updateMarkers = (currentMap: mapboxgl.Map) => {
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
            .addTo(currentMap);
        } else {
          userMarkerRef.current.setLngLat([
            position.lng,
            position.lat,
          ]);
        }

        // Optional: Center map on user
        currentMap.setCenter([position.lng, position.lat]);
      } else if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }

      // ---------------- DESTINATION MARKER ----------------
      if (destination) {
        if (!destMarkerRef.current) {
          destMarkerRef.current = new mapboxgl.Marker({
            color: "red",
          })
            .setLngLat(destination.coordinates)
            .addTo(currentMap);
        } else {
          destMarkerRef.current.setLngLat(destination.coordinates);
        }
      } else if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
    };

    updateMarkers(map);

    // Dependency array ensures this runs when position, destination, or enabled status changes
  }, [position, destination, enabled]);

  // ---- Effect 3: Draw route layer ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Function to handle adding/updating the route layer
    const updateRoute = () => {
      // Remove old layer/source if they exist
      if (map.getLayer("route")) {
        map.removeLayer("route");
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }

      if (!routeData.geometry) return;

      // Add new source and layer
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: routeData.geometry,
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#007aff",
          "line-width": 5,
        },
      });
    };

    // Only update the route once the map has loaded
    if (map.loaded()) {
      updateRoute();
    } else {
      map.on("load", updateRoute);
    }

    // Cleanup: Ensure the event listener is removed if the component unmounts quickly
    return () => {
      if (map.getLayer("route")) {
        map.off("load", updateRoute);
      }
    };
  }, [routeData.geometry]); // Reruns when a new route is calculated

  // ---------- Render ---------
  return (
    <>
      {isRouteLoading && (
        <p style={{ padding: 10, color: "#666" }}>
          Calculating the best route...
        </p>
      )}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "90vh" }}
      />
    </>
  );
}
