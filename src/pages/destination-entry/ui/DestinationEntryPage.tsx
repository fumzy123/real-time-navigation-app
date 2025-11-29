import LocationStatus from "../../../entities/location/ui/LocationStatus";

export function DestinationEntryPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Real‑Time Navigation</h1>
      <p>
        Feature #1: Location Permission + Current Location Retrieval
      </p>
      <LocationStatus />
    </div>
  );
}
