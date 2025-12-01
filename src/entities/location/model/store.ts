import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Position {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

interface LocationStore {
  position: Position | null;
  setPosition: (pos: Position) => void;

  status: "loading" | "granted" | "denied" | "prompt" | "unavailable";
  setStatus: (s: LocationStore["status"]) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      position: null,
      status: "loading",

      setPosition: (pos) => set({ position: pos }),
      setStatus: (status) => set({ status }),
    }),
    {
      name: "location-store",
    }
  )
);
