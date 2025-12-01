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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5em",
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <DestinationGeocoder />
        </div>
        <button onClick={goToNavigationPage}>Navigate To</button>
      </div>

      <AddressHistoryList onAddressSelected={handleAddressSelected} />

      {destination && (
        <div className="p-2 bg-gray-100 rounded">
          <strong>Selected:</strong> {destination.name}
          <br />
          <strong>Lng/Lat:</strong>{" "}
          {destination.coordinates.join(", ")}
        </div>
      )}
    </div>
  );
}
