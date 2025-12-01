import { create } from "zustand";

export interface Destination {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface DestinationState {
  selected: Destination | null;
  setSelected: (dest: Destination | null) => void;
}

export const useDestinationStore = create<DestinationState>(
  (set) => ({
    selected: null,
    setSelected: (dest) => set({ selected: dest }),
  })
);
