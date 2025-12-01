// src/entities/location/ui/LocationStatus.jsx
import React from "react";
import useCurrentLocation from "../model/useCurrentLocation";

/**
 * Small UI wrapper that exposes the hook to the rest of the app.
 * - Shows status (permission state)
 * - Shows coordinates when available
 * - Provides Start / Stop buttons
 */
export default function LocationStatus({ autoStart = false }) {
  const { status, position, start, stop } = useCurrentLocation();

  React.useEffect(() => {
    if (autoStart) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div
      style={{
        marginBottom: 12,
        padding: 8,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <div style={{ fontSize: 13, color: "#333", marginBottom: 8 }}>
        <strong>Location</strong> — status: <em>{status}</em>
      </div>

      {position ? (
        <div style={{ fontSize: 13, lineHeight: 1.4 }}>
          <div>Lat: {position.lat.toFixed(6)}</div>
          <div>Lng: {position.lng.toFixed(6)}</div>
          <div>
            Accuracy:{" "}
            {position.accuracy != null
              ? `${Math.round(position.accuracy)} m`
              : "—"}
          </div>
          {position.speed != null && (
            <div>Speed: {position.speed} m/s</div>
          )}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: "#666" }}>
          No position yet
        </div>
      )}

      {/* {error && (
        <div style={{ marginTop: 8, color: "crimson", fontSize: 13 }}>
          Error: {error.message}
        </div>
      )} */}

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button onClick={start} style={{ padding: "6px 10px" }}>
          Start
        </button>
        <button onClick={stop} style={{ padding: "6px 10px" }}>
          Stop
        </button>
      </div>
    </div>
  );
}
