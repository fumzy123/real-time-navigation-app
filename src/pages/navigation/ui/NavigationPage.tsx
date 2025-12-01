// src/pages/navigation/NavigationPage.tsx

// Re-importing entities needed for the simple status/page logic
import useCurrentLocation from "../../../entities/location/model/useCurrentLocation";
import { useLocationStore } from "../../../entities/location/model/store";
import { NavigationMap } from "../../../features/navigation-map/ui/NavigationMap";

export function NavigationPage() {
  // We only need the state/data necessary for the Page UI/Status messages
  const { enabled } = useLocationStore();
  const position = useCurrentLocation(); // Used here to determine loading status

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 style={{ padding: 10 }}>🗺️ Live Navigation</h2>

      {/* Simple status/loading message composition (Widget or simple Page logic) */}
      {!position && enabled && (
        <p style={{ padding: 10, color: "#666" }}>
          🛰️ Fetching your current location...
        </p>
      )}

      {/* The refactored Feature component */}
      <NavigationMap />
    </div>
  );
}
