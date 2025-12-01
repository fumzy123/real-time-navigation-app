import LocationStatus from "../../../entities/location/ui/LocationStatus";
import { SearchDestinationWidget } from "../../../features/destination-search/ui/SearchDestinationWidget";

export function DestinationEntryPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Real‑Time Navigation</h1>
      <p>
        Feature #1: Location Permission + Current Location Retrieval
      </p>
      <LocationStatus />
      <SearchDestinationWidget />
    </div>
  );
}
