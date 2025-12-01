import mapboxgl from "mapbox-gl";

export async function getRoute(
  start: [number, number],
  end: [number, number]
) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.routes?.[0]?.geometry || null;
}
