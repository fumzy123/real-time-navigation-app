import { useNavigate } from "react-router";
import {
  DestinationGeocoder,
  useDestinationStore,
} from "../../../entities/destination";
import { AddressHistoryList } from "../../address-history-list/ui/AddressHistoryList";
import type { HistoryItem } from "../../../entities/address-history/api";
import { useSaveAddressHistory } from "../../../entities/address-history/model/useAddressHistory";

export function SearchDestinationWidget() {
  //----------------------- Store --------------------------------------
  const destination = useDestinationStore((s) => s.selected);
  const setDestination = useDestinationStore((s) => s.setSelected);

  const saveAddressMutation = useSaveAddressHistory();

  // React Router
  const navigate = useNavigate();

  //----------------------- Event Handler --------------------------------------
  const goToNavigationPage = async () => {
    console.log(
      "🚀 ~ goToNavigationPage: ~ destination:",
      destination
    );
    if (!destination) {
      alert("Please select a destination first.");
      return;
    }

    console.log("About to save", destination);
    // Save Address to Database
    await saveAddressMutation.mutateAsync({
      addressText: destination.name,
      longitude: destination.coordinates[0],
      latitude: destination.coordinates[1],
    });

    // Go to next page
    navigate("/navigate");
  };

  // HANDLER 1: For the Mapbox Geocoder (which calls setSelected internally)
  // HANDLER 2: For the History List (defined here for direct access to setSelected)
  const handleAddressSelected = (item: HistoryItem) => {
    // Direct update, bypassing geocoding (as discussed previously)
    setDestination({
      id: item.id,
      name: item.addressText,
      coordinates: item.coordinates,
    });
  };

  // ----------------------- Render --------------------------------------
  return (
    <div style={{ padding: "10px 0" }}>
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
