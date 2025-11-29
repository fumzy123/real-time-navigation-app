# real-time-navigation-frontend (FSD)

This document contains a full **Feature-Sliced Design (FSD)** React frontend scaffold for the Real-Time Navigation App. It includes all files you need to create the repo, run the app locally with Vite, and connect to the backend described earlier.

> **What you’ll find below:** a file tree and the full contents of each important file. Copy the files into a repo named `real-time-navigation-frontend` and follow the `README.md` run steps.

---

## Repo file tree

```
real-time-navigation-frontend/
├── .env.example
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── app/
│   │   ├── index.jsx
│   │   └── providers/
│   │       ├── router.jsx
│   │       └── mapbox.js
│   ├── pages/
│   │   ├── destination-entry/
│   │   │   └── ui/DestinationEntryPage.jsx
│   │   └── navigation/
│   │       └── ui/NavigationPage.jsx
│   ├── widgets/
│   │   ├── address-history/
│   │   │   └── ui/AddressHistory.jsx
│   │   └── navigation-map/
│   │       └── ui/NavigationMap.jsx
│   ├── features/
│   │   ├── geocode-address/
│   │   │   ├── api/geocodeApi.js
│   │   │   └── model/useGeocode.js
│   │   ├── get-directions/
│   │   │   ├── api/directionsApi.js
│   │   │   └── model/useDirections.js
│   │   ├── realtime-tracking/
│   │   │   ├── api/socket.js
│   │   │   └── model/useRealtimeLocation.js
│   │   └── save-address/
│   │       ├── api/addressApi.js
│   │       └── model/useSaveAddress.js
│   ├── entities/
│   │   ├── location/
│   │   │   └── lib/getUserLocation.js
│   │   ├── route/
│   │   │   └── model/routeStore.js
│   │   └── address/
│   │       └── lib/formatAddress.js
│   └── shared/
│       ├── api/axiosClient.js
│       ├── config/mapbox.js
│       ├── lib/distance.js
│       ├── lib/eta.js
│       └── ui/
│           ├── Button.jsx
│           └── Input.jsx
```

---

> **Important:** Fill `.env` based on `.env.example` and provide your backend URL + Mapbox key.

---

## .env.example

```
VITE_API_BASE=http://localhost:4000/api
VITE_MAPBOX_KEY=pk.YOUR_MAPBOX_KEY
VITE_SOCKET_URL=http://localhost:4000
```

---

## package.json

```json
{
  "name": "real-time-navigation-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "mapbox-gl": "^2.15.0",
    "prop-types": "^15.8.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.1",
    "socket.io-client": "^4.8.1",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
});
```

---

## index.html

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Real-Time Navigation - FSD</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## README.md

```md
# Real-Time Navigation Frontend (FSD)

This is the Feature-Sliced Design scaffold for the frontend.

## Setup

1. Copy `.env.example` to `.env` and fill in values.
2. `npm install`
3. `npm run dev`

Backend should be running (see `VITE_API_BASE`).

This app uses Mapbox for maps and directions (Mapbox access token required).
```

---

## src/main.jsx

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

## src/App.jsx

```jsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppProviders from './app/index'

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders />
    </BrowserRouter>
  )
}
```

---

## src/index.css

```css
html, body, #root {
  height: 100%;
  margin: 0;
  font-family: Inter, system-ui, Arial, sans-serif;
}

* { box-sizing: border-box; }

.app-shell {
  display: grid;
  grid-template-columns: 340px 1fr;
  height: 100vh;
}

.sidebar { padding: 16px; border-right: 1px solid #eee; }

.map-container { height: 100vh; }
```

---

## src/app/index.jsx

```jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RouterProvider from './providers/router'
import MapboxProvider from './providers/mapbox'
import DestinationEntryPage from '../pages/destination-entry/ui/DestinationEntryPage'
import NavigationPage from '../pages/navigation/ui/NavigationPage'

export default function AppProviders() {
  return (
    <MapboxProvider>
      <RouterProvider>
        <div className="app-shell">
          <div className="sidebar">
            <Routes>
              <Route path="/" element={<DestinationEntryPage />} />
            </Routes>
          </div>

          <div className="map-container">
            <Routes>
              <Route path="/navigate" element={<NavigationPage />} />
              <Route path="/" element={<div style={{padding:16}}>Open the left panel and pick a destination.</div>} />
            </Routes>
          </div>
        </div>
      </RouterProvider>
    </MapboxProvider>
  )
}
```

---

## src/app/providers/router.jsx

```jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

// tiny wrapper so pages/widgets can call navigate via prop
export default function RouterProvider({ children }) {
  const navigate = useNavigate()
  return React.cloneElement(children, { navigate })
}
```

---

## src/app/providers/mapbox.js

```jsx
import React, { createContext } from 'react'

export const MapboxContext = createContext({
  accessToken: import.meta.env.VITE_MAPBOX_KEY
})

export default function MapboxProvider({ children }) {
  return (
    <MapboxContext.Provider value={{ accessToken: import.meta.env.VITE_MAPBOX_KEY }}>
      {children}
    </MapboxContext.Provider>
  )
}
```

---

## src/pages/destination-entry/ui/DestinationEntryPage.jsx

```jsx
import React, { useState, useEffect } from 'react'
import { geocodeAddress } from '../../../features/geocode-address/api/geocodeApi'
import { saveAddress, getAddressHistory } from '../../../features/save-address/api/addressApi'
import AddressHistory from '../../../widgets/address-history/ui/AddressHistory'

export default function DestinationEntryPage({ navigate }) {
  const [address, setAddress] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const res = await getAddressHistory()
        setHistory(res.data)
      } catch (e) { /* ignore */ }
    })()
  }, [])

  const handleNavigate = async () => {
    if (!address) return alert('Enter destination')
    try {
      const res = await geocodeAddress(address)
      const { lat, lng, place_name } = res.data
      await saveAddress({ address_text: place_name || address, lat, lng })
      navigate('/navigate', { state: { destination: { lat, lng, address_text: place_name || address } } })
    } catch (err) {
      alert('Could not geocode address. Try again.')
    }
  }

  return (
    <div>
      <h2>Destination</h2>
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter address" style={{width:'100%',padding:8}} />
      <button onClick={handleNavigate} style={{marginTop:8}}>Navigate To</button>
      <h3 style={{marginTop:20}}>History</h3>
      <AddressHistory items={history} onSelect={(item) => navigate('/navigate', { state: { destination: item } })} />
    </div>
  )
}
```

---

## src/pages/navigation/ui/NavigationPage.jsx

```jsx
import React from 'react'
import NavigationMap from '../../../widgets/navigation-map/ui/NavigationMap'
import { useLocation } from 'react-router-dom'

export default function NavigationPage() {
  const loc = useLocation()
  const destination = loc.state?.destination

  return (
    <div style={{height:'100%'}}>
      <NavigationMap destination={destination} />
    </div>
  )
}
```

---

## src/widgets/address-history/ui/AddressHistory.jsx

```jsx
import React from 'react'
import PropTypes from 'prop-types'

export default function AddressHistory({ items, onSelect }) {
  if (!items || items.length === 0) return <div>No recent addresses</div>
  return (
    <ul style={{paddingLeft:0}}>
      {items.map((it, i) => (
        <li key={i} style={{listStyle:'none', marginBottom:8}}>
          <button onClick={() => onSelect(it)} style={{width:'100%',textAlign:'left',padding:8}}>
            {it.address_text}
          </button>
        </li>
      ))}
    </ul>
  )
}

AddressHistory.propTypes = {
  items: PropTypes.array,
  onSelect: PropTypes.func
}
```

---

## src/widgets/navigation-map/ui/NavigationMap.jsx

```jsx
import React, { useRef, useEffect, useState, useContext } from 'react'
import mapboxgl from 'mapbox-gl'
import { MapboxContext } from '../../../app/providers/mapbox'
import { getDirections } from '../../../features/get-directions/api/directionsApi'
import { haversineDistanceKm } from '../../../shared/lib/distance'
import useRealtimeLocation from '../../../features/realtime-tracking/model/useRealtimeLocation'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY

export default function NavigationMap({ destination }) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const userMarker = useRef(null)
  const destMarker = useRef(null)
  const [distanceKm, setDistanceKm] = useState(null)
  const [etaSec, setEtaSec] = useState(null)
  const currentPos = useRealtimeLocation()

  // init map
  useEffect(() => {
    if (mapRef.current) return
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-52.7126,47.5615],
      zoom: 13
    })
    mapRef.current.on('load', () => {
      mapRef.current.addSource('route', { type: 'geojson', data: { type:'FeatureCollection', features: [] } })
      mapRef.current.addLayer({ id: 'route-line', type: 'line', source: 'route', paint:{ 'line-width': 6 }})
    })
  }, [])

  // update markers & map when position changes
  useEffect(() => {
    if (!currentPos) return
    const { lat, lng, speed } = currentPos
    if (!userMarker.current) userMarker.current = new mapboxgl.Marker({ color: 'blue' }).setLngLat([lng, lat]).addTo(mapRef.current)
    else userMarker.current.setLngLat([lng, lat])
    mapRef.current.setCenter([lng, lat])

    // compute distance to destination (straight-line) if available
    if (destination && destination.lat && destination.lng) {
      const d = haversineDistanceKm(lat, lng, destination.lat, destination.lng)
      setDistanceKm(d)

      // if speed available compute ETA locally, else call directions API
      if (typeof speed === 'number' && speed > 0) {
        const speedKmh = speed * 3.6
        const hours = d / speedKmh
        setEtaSec(Math.round(hours * 3600))
      } else {
        // fetch route & ETA from API
        (async () => {
          try {
            const r = await getDirections({ lat, lng }, { lat: destination.lat, lng: destination.lng })
            const data = r.data
            if (data.geometry) {
              mapRef.current.getSource('route').setData({ type:'Feature', geometry: data.geometry })
            }
            if (data.distance) setDistanceKm(data.distance / 1000)
            if (data.duration) setEtaSec(Math.round(data.duration))
          } catch (e) { console.warn('directions failed', e) }
        })()
      }
    }
  }, [currentPos, destination])

  // set destination marker
  useEffect(() => {
    if (!destination) return
    if (!destMarker.current) destMarker.current = new mapboxgl.Marker({ color: 'red' }).setLngLat([destination.lng, destination.lat]).addTo(mapRef.current)
    else destMarker.current.setLngLat([destination.lng, destination.lat])
  }, [destination])

  return (
    <div style={{height:'100%'}}>
      <div style={{padding:8}}>
        <div>Destination: {destination?.address_text ?? '—'}</div>
        <div>Distance: {distanceKm ? distanceKm.toFixed(2)+' km' : '—'}</div>
        <div>ETA: {etaSec ? Math.floor(etaSec/60) + ' min ' + (etaSec%60) + ' sec' : '—'}</div>
      </div>
      <div ref={mapContainer} style={{height:'calc(100% - 80px)'}} />
    </div>
  )
}
```

---

## src/features/geocode-address/api/geocodeApi.js

```js
import axios from '../../../shared/api/axiosClient'

export function geocodeAddress(address) {
  return axios.post(`${import.meta.env.VITE_API_BASE}/geocode`, { address })
}
```

---

## src/features/geocode-address/model/useGeocode.js

```js
import { geocodeAddress } from '../api/geocodeApi'

export default function useGeocode() {
  const run = async (address) => {
    const res = await geocodeAddress(address)
    return res.data
  }
  return { run }
}
```

---

## src/features/get-directions/api/directionsApi.js

```js
import axios from '../../../shared/api/axiosClient'

export function getDirections(from, to) {
  return axios.get(`${import.meta.env.VITE_API_BASE}/directions`, {
    params: { fromLat: from.lat, fromLng: from.lng, toLat: to.lat, toLng: to.lng }
  })
}
```

---

## src/features/get-directions/model/useDirections.js

```js
import { getDirections } from '../api/directionsApi'

export default function useDirections() {
  const fetch = async (from, to) => {
    const res = await getDirections(from, to)
    return res.data
  }
  return { fetch }
}
```

---

## src/features/realtime-tracking/api/socket.js

```js
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: true })
export default socket
```

---

## src/features/realtime-tracking/model/useRealtimeLocation.js

```js
import { useEffect, useState } from 'react'
import socket from '../api/socket'

export default function useRealtimeLocation() {
  const [pos, setPos] = useState(null)

  useEffect(() => {
    let watchId = null
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition((p) => {
        const payload = { lat: p.coords.latitude, lng: p.coords.longitude, speed: p.coords.speed }
        setPos(payload)
        // emit to server
        socket.emit('position', payload)
      }, (err) => console.error('geolocation error', err), { enableHighAccuracy: true })
    }

    // listen for other clients (optional)
    socket.on('position:update', (data) => { /* handle other clients if needed */ })

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
      socket.off('position:update')
    }
  }, [])

  return pos
}
```

---

## src/features/save-address/api/addressApi.js

```js
import axios from '../../../shared/api/axiosClient'

export const saveAddress = (payload) => axios.post(`${import.meta.env.VITE_API_BASE}/addresses`, payload)
export const getAddressHistory = () => axios.get(`${import.meta.env.VITE_API_BASE}/addresses`)
```

---

## src/features/save-address/model/useSaveAddress.js

```js
import { saveAddress } from '../api/addressApi'

export default function useSaveAddress() {
  const run = async (payload) => {
    const res = await saveAddress(payload)
    return res.data
  }
  return { run }
}
```

---

## src/entities/location/lib/getUserLocation.js

```js
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('Geolocation not available'))
    navigator.geolocation.getCurrentPosition((p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }), reject)
  })
}
```

---

## src/entities/route/model/routeStore.js

```js
// simple in-memory store for the route (can swap for Zustand or Redux)
let route = null
export function setRoute(r) { route = r }
export function getRoute() { return route }
```

---

## src/entities/address/lib/formatAddress.js

```js
export function formatAddress(obj) {
  return obj?.place_name || obj?.address_text || ''
}
```

---

## src/shared/api/axiosClient.js

```js
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000
})

export default instance
```

---

## src/shared/config/mapbox.js

```js
export const MAPBOX_PROFILE = 'driving'
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_KEY
```

---

## src/shared/lib/distance.js

```js
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = v => v * Math.PI / 180
  const R = 6371.0
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
```

---

## src/shared/lib/eta.js

```js
export function etaSecondsFromSpeed(distanceKm, speedMetersPerSec) {
  if (!speedMetersPerSec || speedMetersPerSec <= 0) return null
  const speedKmh = speedMetersPerSec * 3.6
  const hours = distanceKm / speedKmh
  return Math.round(hours * 3600)
}
```

---

## src/shared/ui/Button.jsx

```jsx
import React from 'react'

export default function Button({ children, onClick, ...props }) {
  return (
    <button onClick={onClick} {...props} style={{padding:'8px 12px', borderRadius:6}}>
      {children}
    </button>
  )
}
```

---

## src/shared/ui/Input.jsx

```jsx
import React from 'react'

export default function Input(props) {
  return (
    <input {...props} style={{padding:8, borderRadius:6, border:'1px solid #ddd'}} />
  )
}
```

---

### Final notes

* This scaffold focuses on the FSD structure: pages, widgets, features, entities, shared.
* Mapbox calls for directions are routed through the backend (`/api/directions`) per your earlier spec. The frontend calls that endpoint in `features/get-directions`.
* To wire a production-ready app: add error handling, UX polish, tests, and environment-specific Mapbox key restrictions.

---

If you'd like, I can now:

* Generate the **backend repo scaffold** to match this frontend (Express + Socket.io + Postgres), or
* Create a downloadable ZIP for the frontend scaffold, or
* Push this scaffold into a GitHub repo for you (if you provide a repo name/permissions).

Tell me which next step you want.
