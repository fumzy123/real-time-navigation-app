import { useState } from "react";
import { Geocoder } from "@mapbox/search-js-react";
import {
  useDestinationStore,
  type Destination,
} from "../model/store";

// Define the dark mode theme variables based on the design aesthetic
const darkTheme = {
  variables: {
    // General Styling for the search box
    unit: "16px", // Base font size
    borderRadius: "30px", // High rounding for the pill shape

    // Colors for the dark input field (matches the image input background)
    colorBackground: "#2e343b", // Dark background for the input box and list box
    colorBackgroundHover: "#3b4249", // Slightly lighter on hover

    // Text color
    colorText: "#ffffff", // White text
    colorTextPlaceholder: "#aaaaaa", // Light gray placeholder text

    // Primary accent color (used for selected items, etc. - can be blue)
    colorPrimary: "#1e90ff",

    // Border and Shadow
    border: "none", // Remove default border
    boxShadow: "none", // Remove default shadow

    // Padding inside the input
    padding: "0.7em 1.2em", // Adjusted padding for a comfortable look
  },
  // You can add custom CSS to override specific Mapbox element classes if needed,
  // but the variables above handle the main aesthetic.
  // Inject custom CSS to specifically target the input field and force white text.
  cssText: `
    /* Targets the actual text input field inside the Geocoder control */
    .mapboxgl-ctrl-geocoder input { 
      color: #ffffff !important; 
    }
  `,
};

export function DestinationGeocoder() {
  const setSelected = useDestinationStore((s) => s.setSelected);
  const selectedDestination = useDestinationStore((s) => s.selected);

  const [currentQuery, setCurrentQuery] = useState("");

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
    setCurrentQuery(dest.name);
  };

  const handleChange = (newQuery: string) => {
    setCurrentQuery(newQuery);

    if (selectedDestinationName) {
      setSelected(null);
    }
  };

  return (
    <Geocoder
      // Apply the custom dark mode theme here
      theme={darkTheme}
      accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      options={{
        language: "en",
        country: "CA",
      }}
      onRetrieve={handleSelect}
      value={selectedDestinationName || currentQuery}
      onChange={handleChange}
      marker={false}
      // Updated placeholder text to match the design style
      placeholder="Enter destination..."
    />
  );
}
