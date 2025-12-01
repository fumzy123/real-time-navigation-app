import { useState } from "react"; // 1. Import useState
import { Geocoder } from "@mapbox/search-js-react";
import {
  useDestinationStore,
  type Destination,
} from "../model/store";

export function DestinationGeocoder() {
  const setSelected = useDestinationStore((s) => s.setSelected);
  const selectedDestination = useDestinationStore((s) => s.selected);

  // 2. Local state to hold the input text when no destination is selected
  const [currentQuery, setCurrentQuery] = useState("");

  // The name of the currently selected destination from the store, or null/undefined
  const selectedDestinationName = selectedDestination?.name;

  const handleSelect = (res: any) => {
    console.log(res);
    if (!res.properties.name) return;

    const dest: Destination = {
      id: res.id,
      name: res.properties.name,
      coordinates: [
        res.geometry.coordinates[0],
        res.geometry.coordinates[1],
      ],
    };

    console.log(dest);
    setSelected(dest);

    // 3. Update local state to match the selected name
    setCurrentQuery(dest.name);
  };

  // 4. Handle input changes (when the user types)
  const handleChange = (newQuery: string) => {
    // Update the local query state immediately
    setCurrentQuery(newQuery);

    // If a destination was previously selected, clear it from the store
    // as soon as the user changes the text.
    if (selectedDestinationName) {
      setSelected(null);
    }
  };

  return (
    <Geocoder
      accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      options={{
        language: "en",
        country: "CA",
      }}
      onRetrieve={handleSelect}
      // A. The 'value' prop controls the input content.
      // If an address is selected, use its name (persistence).
      // Otherwise, use the user's typing (search).
      value={selectedDestinationName || currentQuery}
      // B. The 'onChange' prop is required for controlled components
      // and lets us clear the selection when the user starts typing.
      onChange={handleChange}
      marker={false}
      placeholder="Enter destination..."
    />
  );
}
