// src/entities/location/ui/LocationStatus.tsx
import useCurrentLocation from "../model/useCurrentLocation";
import { useLocationStore } from "../model/store";

export default function LocationStatus() {
  const { enabled, setEnabled } = useLocationStore();
  const position = useCurrentLocation();

  // Determine the display status
  const isLocationAccurate =
    position && position.accuracy !== undefined;
  const accuracyText = isLocationAccurate
    ? `Accurate within ${Math.round(position.accuracy as number)} m`
    : enabled
    ? "Fetching location..."
    : "Location disabled";

  // --- Styles based on current state ---
  const chipBackgroundColor = enabled ? "#2e343b" : "#1a1a1a";
  const chipBorderColor = enabled ? "#4caf50" : "#555555";
  const chipTextColor = enabled ? "#4caf50" : "#aaaaaa";
  const chipIcon = enabled ? "✅" : "❌";
  const chipText = enabled ? "Location Enabled" : "Location Disabled";

  // --- Handler to toggle location ---
  const handleToggle = () => {
    setEnabled(!enabled);
  };

  return (
    // Outer container for positioning (no click handler here)
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "transparent",
        padding: "16px 20px",
        marginBottom: "20px",
        color: "#ffffff", // Light text
      }}
    >
      {/* 1. Map Preview Placeholder (Left Side) */}
      <div
        style={{
          width: "120px",
          height: "80px",
          borderRadius: "8px",
          marginRight: "20px",
          backgroundColor: "#1e242a",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #3b4249",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "10px",
            color: "#aaaaaa",
          }}
        >
          MAP PREVIEW
        </span>
      </div>

      {/* 2. Status Content (Right Side) */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        {/* Location Toggle Chip: Functionality restored with onClick */}
        <div
          onClick={handleToggle} // ⬅️ **TOGGLE FUNCTIONALITY RESTORED HERE**
          style={{
            // Styles change based on 'enabled' state
            backgroundColor: chipBackgroundColor,
            border: `1px solid ${chipBorderColor}`,
            color: chipTextColor,
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            cursor: "pointer", // Show it's clickable
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            transition: "all 0.2s ease-in-out", // Smooth transition on toggle
          }}
        >
          {/* Icon based on state */}
          <span style={{ marginRight: "6px", fontSize: "16px" }}>
            {chipIcon}
          </span>
          {/* Text based on state */}
          {chipText}
        </div>

        {/* Accuracy Text / Status */}
        <p style={{ color: "#ffffff", margin: 0, fontSize: "15px" }}>
          {accuracyText}
        </p>
      </div>
    </div>
  );
}
