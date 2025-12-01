// src/entities/location/model/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Position {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
}

interface LocationStore {
  position: Position | null;
  setPosition: (pos: Position | null) => void;

  // New: global toggle for location
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      position: null,
      enabled: false, // initially off

      setPosition: (pos) => set({ position: pos }),
      setEnabled: (enabled) => set({ enabled }),
    }),
    { name: "location-store" }
  )
);
