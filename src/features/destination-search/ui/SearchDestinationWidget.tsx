import { useNavigate } from "react-router";
import {
  DestinationGeocoder,
  useDestinationStore,
} from "../../../entities/destination";
import { AddressHistoryList } from "../../address-history-list/ui/AddressHistoryList";
import type { HistoryItem } from "../../../entities/address-history/api";

export function SearchDestinationWidget() {
  //----------------------- Store --------------------------------------
  const destination = useDestinationStore((s) => s.selected);
  const setDestination = useDestinationStore((s) => s.setSelected);

  // React Router
  const navigate = useNavigate();

  //----------------------- Event Handler --------------------------------------
  const goToNavigationPage = () => {
    console.log(
      "🚀 ~ goToNavigationPage: ~ destination:",
      destination
    );
    if (!destination) {
      alert("Please select a destination first.");
      return;
    }
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
