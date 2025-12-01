import { useNavigate } from "react-router";
import {
  DestinationGeocoder,
  useDestinationStore,
} from "../../../entities/destination";

export function SearchDestinationWidget() {
  //----------------------- Store --------------------------------------
  const destination = useDestinationStore((s) => s.selected);

  // React Router
  const navigate = useNavigate();

  //----------------------- Event Handler --------------------------------------
  const goToNavigationPage = () => {
    console.log(destination);
    if (!destination) {
      alert("Please select a destination first.");
      return;
    }
    navigate("/navigate");
  };

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
