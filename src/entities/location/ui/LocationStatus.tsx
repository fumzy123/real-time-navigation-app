// src/entities/location/ui/LocationStatus.tsx
import useCurrentLocation from "../model/useCurrentLocation";
import { useLocationStore } from "../model/store";

// We don't need the Mapbox component itself for this design placeholder,
// but we'll include a placeholder for where the map preview would go.

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

  return (
    // Outer container: Set to match the overall dark aesthetic
    <div
      style={{
        display: "flex",
        alignItems: "center",
        // The background color of the main body (assuming dark mode)
        backgroundColor: "transparent",
        padding: "16px 20px",
        marginBottom: "20px",
        color: "#ffffff", // Light text
      }}
    >
      {/* 1. Map Preview Placeholder (Left Side) */}
      <div
        // This is a placeholder for where a small Mapbox preview map would render
        style={{
          width: "120px",
          height: "80px",
          borderRadius: "8px",
          marginRight: "20px",
          backgroundColor: "#1e242a", // Darker background to simulate a map
          position: "relative",
          overflow: "hidden",
          border: "1px solid #3b4249",
        }}
        // The image shows a small map preview here. We can simulate the look
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
        {/* Location Enabled Chip */}
        {enabled && (
          <div
            style={{
              // Styles for the green "Location Enabled" chip
              backgroundColor: "#2e343b", // Dark background for the chip
              border: "1px solid #4caf50", // Green border
              color: "#4caf50", // Green text color
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            // You can attach the toggle logic here if you remove the checkbox
            // onClick={() => setEnabled(!enabled)}
          >
            {/* Green Checkmark Icon */}
            <span style={{ marginRight: "6px", fontSize: "16px" }}>
              ✅
            </span>
            Location Enabled
          </div>
        )}

        {/* Accuracy Text / Status */}
        <p style={{ color: "#ffffff", margin: 0, fontSize: "15px" }}>
          {accuracyText}
        </p>
      </div>

      {/* NOTE ON CHECKBOX: The original checkbox is removed/hidden 
        to match the clean chip design. If you need to retain the toggle, 
        you can wrap the whole status bar and add an onClick handler to setEnabled.
      */}
    </div>
  );
}
