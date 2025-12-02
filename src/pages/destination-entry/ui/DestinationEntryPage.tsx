import LocationStatus from "../../../entities/location/ui/LocationStatus";
import { SearchDestinationWidget } from "../../../features/destination-search/ui/SearchDestinationWidget";

export function DestinationEntryPage() {
  return (
    <div
      style={{
        padding: 20,
        minWidth: 550,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Geo Naviagtion App</h1>
      <p>The Fastest way to find your way to any Destination</p>
      <LocationStatus />
      <SearchDestinationWidget />
    </div>
  );
}
