import mapboxgl from "mapbox-gl";

export async function getRoute(
  start: [number, number],
  end: [number, number]
) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Mapbox API error: ${res.statusText}`);
  }

  // Get Data
  const data = await res.json();
  const bestRoute = data.routes?.[0];

  // Return both Geometry and duration
  return {
    geometry: bestRoute?.geometry || null,
    duration: bestRoute?.duration || null,
    distance: bestRoute?.distance || null,
  };
}
