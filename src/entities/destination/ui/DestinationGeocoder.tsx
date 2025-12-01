import { Geocoder } from "@mapbox/search-js-react";
import {
  useDestinationStore,
  type Destination,
} from "../model/store";

export function DestinationGeocoder() {
  const setSelected = useDestinationStore((s) => s.setSelected);

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
  };

  return (
    <Geocoder
      accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      options={{
        language: "en",
        country: "CA",
      }}
      onRetrieve={handleSelect}
      marker={false}
      placeholder="Enter destination..."
    />
  );
}
