import { useNavigate } from "react-router";
import {
  DestinationGeocoder,
  useDestinationStore,
  type Destination, // ⬅️ Import Destination type for clarity
} from "../../../entities/destination";
import { AddressHistoryList } from "../../address-history-list/ui/AddressHistoryList";
import { useSaveAddressHistory } from "../../../entities/address-history/model/useAddressHistory";
import type { DestinationPoint } from "../../../entities/address-history/model/types";

export function SearchDestinationWidget() {
  //----------------------- Store --------------------------------------
  const destination = useDestinationStore((s) => s.selected);
  const setDestination = useDestinationStore((s) => s.setSelected);

  const saveAddressMutation = useSaveAddressHistory();

  // React Router
  const navigate = useNavigate();

  //----------------------- Core Navigation Logic --------------------------------------

  /**
   * IMPORTANT: Core function now accepts the destination object directly.
   * This guarantees it works with the correct, latest value.
   */
  const executeNavigation = async (destinationToUse: Destination) => {
    console.log(
      "🚀 ~ executeNavigation: ~ destination:",
      destinationToUse
    );

    // This check should technically be redundant if called correctly, but is good practice.
    if (!destinationToUse) {
      alert("Please select a destination first.");
      return;
    }

    console.log("About to save", destinationToUse);
    // Save Address to Database
    await saveAddressMutation.mutateAsync({
      addressText: destinationToUse.name,
      longitude: destinationToUse.coordinates[0],
      latitude: destinationToUse.coordinates[1],
    });

    // Go to next page
    navigate("/navigate");
  };

  /**
   * Handler for the main 'Start Navigation' button.
   * This relies on the store being updated by the Geocoder component.
   */
  const goToNavigationPage = () => {
    // If the store is already updated (by Geocoder), use that value
    if (destination) {
      executeNavigation(destination);
    } else {
      alert("Please select a destination first.");
    }
  };

  // HANDLER: For the History List
  const handleAddressSelected = (item: DestinationPoint) => {
    console.log("The address history selected is:", item);

    // 1. Create the new Destination object
    const newDestination: Destination = {
      id: item.id.toString(),
      name: item.addressText,
      coordinates: item.coordinates,
    };

    // 2. Update the store (this is async and not guaranteed to be immediate)
    setDestination(newDestination);

    // 3. IMMEDIATELY call the core navigation logic with the fresh object
    executeNavigation(newDestination); // ⬅️ FIX: Use the fresh local object
  };

  // ----------------------- Render --------------------------------------
  return (
    <div style={{ padding: "10px 0", width: "30%" }}>
      {/* This is the new structure: The Geocoder is now full-width, 
          and the button is placed directly below it, also full-width.
      */}
      <div style={{ marginBottom: "15px" }}>
        <DestinationGeocoder />
      </div>

      <button
        onClick={goToNavigationPage}
        // STYLES FOR THE "START NAVIGATION" BUTTON
        style={{
          width: "100%", // Full width
          padding: "15px 0",
          backgroundColor: "#1e90ff", // Bright blue color
          color: "#ffffff", // White text
          border: "none",
          borderRadius: "30px", // High rounding for pill shape
          fontSize: "18px",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          // Darker gradient/hover style if you want to extend the aesthetic
          backgroundImage:
            "linear-gradient(to right, #1e90ff, #00bfff)",
        }}
      >
        <span style={{ marginRight: "8px" }}>🔍</span>
        Start Navigation?
      </button>

      <AddressHistoryList onAddressSelected={handleAddressSelected} />

      {destination && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#2e343b", // Dark background for the selected info box
            color: "#ffffff", // Light text
            borderRadius: "8px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          <strong>Selected:</strong> {destination.name}
          <br />
          <strong>Lng/Lat:</strong>{" "}
          {destination.coordinates.join(", ")}
        </div>
      )}
    </div>
  );
}
