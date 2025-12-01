// src/entities/location/ui/LocationStatus.tsx
import useCurrentLocation from "../model/useCurrentLocation";
import { useLocationStore } from "../model/store";

export default function LocationStatus() {
  const { enabled, setEnabled } = useLocationStore();
  const position = useCurrentLocation();

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />{" "}
        Enable Location
      </label>

      {position ? (
        <div style={{ marginTop: 10, fontSize: 14 }}>
          <div>Latitude: {position.lat.toFixed(6)}</div>
          <div>Longitude: {position.lng.toFixed(6)}</div>
          {position.accuracy && (
            <div>Accuracy: {Math.round(position.accuracy)} m</div>
          )}
          {position.speed != null && (
            <div>Speed: {position.speed} m/s</div>
          )}
        </div>
      ) : (
        <p style={{ marginTop: 10, color: "#666" }}>
          {enabled ? "Fetching location..." : "Location not enabled"}
        </p>
      )}
    </div>
  );
}
