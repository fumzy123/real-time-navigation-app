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
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Add a prop for handling the cancel/stop action
interface NavigationMapProps {
  onCancel: () => void;
}

export function NavigationMap({ onCancel }: NavigationMapProps) {
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
      // Using a dark style for consistency
      style: "mapbox://styles/mapbox/dark-v11",
      center: destination?.coordinates ?? [0, 0],
      zoom: 14,
      attributionControl: false,
    });

    mapRef.current = map;

    // Cleanup: Remove the map instance when the component unmounts
    return () => map.remove();
  }, []); // Empty dependency array ensures it runs only on mount

  // ---- Effect 2: Marker updates and centering ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // ---- Function to update markers ----
    const updateMarkers = (currentMap: mapboxgl.Map) => {
      // ---------------- USER MARKER ----------------
      if (enabled && position) {
        if (!userMarkerRef.current) {
          const el = document.createElement("div");
          el.style.width = "20px";
          el.style.height = "20px";
          el.style.backgroundColor = "#1e90ff"; // Bright blue
          el.style.borderRadius = "50%";
          el.style.border = "3px solid white"; // Thicker white border
          el.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";

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
            color: "#ff6b6b", // Pink/Red color matching the design
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

    // Wait for the map to load before trying to add/update elements
    if (!map.loaded()) {
      map.on("load", () => updateMarkers(map));
      return;
    }

    updateMarkers(map);

    // Dependency array ensures this runs when position, destination, or enabled status changes
  }, [position, destination, enabled]);

  // ---- Effect 3: Draw route layer ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!routeData) return;

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
          "line-color": "#1e90ff", // Bright blue route line
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

    // // Cleanup: Ensure the event listener is removed if the component unmounts quickly
  }, [routeData]); // Reruns when a new route is calculated

  // Format data for display
  const distanceKm = routeData?.distance
    ? (routeData.distance / 1000).toFixed(2) + " km"
    : "...";
  const durationMin = routeData?.duration
    ? (routeData.duration / 60).toFixed(1) + " min"
    : "...";
  // Placeholder for the next instruction text (not implemented yet)
  const nextInstruction = "Turn left onto Rasdon";

  // ---------- Render ---------
  return (
    <>
      {isRouteLoading && (
        <p
          style={{
            padding: 10,
            color: "#aaaaaa",
            textAlign: "center",
          }}
        >
          Calculating the best route...
        </p>
      )}

      {/* Main Wrapper: This container must have position: relative to allow 
          absolute positioning of the info box and button. */}
      <div
        style={{
          width: "90%",
          margin: "0 auto",
          position: "relative", // ⬅️ IMPORTANT for absolute positioning
        }}
      >
        {/* Map Container */}
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "75vh",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        />

        {/* 1. Time, Distance, and Instruction Info Box (Absolute Positioned) */}
        {routeData && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              backgroundColor: "#242424", // Dark background for the card
              padding: "15px",
              borderRadius: "12px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              zIndex: 10, // Ensure it floats above the map
            }}
          >
            {/* Time & Distance Block (Left Side) */}
            <div style={{ marginRight: "15px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              >
                {durationMin}
              </p>
              <p
                style={{
                  margin: "5px 0",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                {distanceKm}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#aaaaaa",
                }}
              >
                {nextInstruction}
              </p>
            </div>

            {/* Stop/Cancel Button (Right Side) */}
            <button
              onClick={onCancel} // Calls the function passed from the parent page
              style={{
                backgroundColor: "#e74c3c", // Red button color
                border: "none",
                borderRadius: "50%", // Circular button
                width: "50px",
                height: "50px",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "20px",
                  lineHeight: 1,
                }}
              >
                ❌
              </span>
              <span
                style={{
                  color: "white",
                  fontSize: "10px",
                  marginTop: "1px",
                }}
              >
                Stop
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
