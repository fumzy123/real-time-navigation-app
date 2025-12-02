// src/pages/navigation/NavigationPage.tsx

// Re-importing entities needed for the simple status/page logic
import useCurrentLocation from "../../../entities/location/model/useCurrentLocation";
import { useLocationStore } from "../../../entities/location/model/store";
import { NavigationMap } from "../../../features/navigation-map/ui/NavigationMap";

// NEW: Import hook to clear destination state
import { useDestinationStore } from "../../../entities/destination";

// NEW: Assuming you use a router, import useNavigate hook
// You will need to install and configure your router library (e.g., react-router-dom)
import { useNavigate } from "react-router";

export function NavigationPage() {
  // We only need the state/data necessary for the Page UI/Status messages
  const { enabled } = useLocationStore();
  const position = useCurrentLocation(); // Used here to determine loading status

  // NEW: Get the function to clear the selected destination
  const setDestination = useDestinationStore((s) => s.setSelected);

  // NEW: Get the navigation function from your router
  const navigate = useNavigate();

  /**
   * Handler function to stop the current navigation.
   * This is passed to the NavigationMap component's "Stop" button.
   */
  const handleCancelNavigation = () => {
    // 1. Clear the currently selected destination
    setDestination(null);

    // 2. Navigate the user back to the destination entry page
    console.log("Navigating back to entry page (Placeholder)");

    navigate("/");
  };

  return (
    // Removed unnecessary 'width: "100%", height: "100vh"' since global CSS handles it
    <div style={{ padding: "0 10px" }}>
      <h2 style={{ padding: 10 }}>🗺️ Live Navigation</h2>

      {/* Simple status/loading message composition (Widget or simple Page logic) */}
      {!position && enabled && (
        <p style={{ padding: 10, color: "#aaaaaa" }}>
          🛰️ Fetching your current location...
        </p>
      )}

      {/* The refactored Feature component, now with the onCancel handler */}
      <NavigationMap onCancel={handleCancelNavigation} />
    </div>
  );
}
