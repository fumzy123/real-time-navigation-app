// Define your history item structure

// Define the interface for the original object (The Database Record)
export interface AddressRecord {
  id: number;
  addressText: string;
  lastUsed: string;
  latitude: number; // Stored as separate fields
  longitude: number; // Stored as separate fields
}

export interface DestinationPoint {
  id: number;
  addressText: string;
  coordinates: [number, number];
  lastUsed: string; // ISO date string
}

export interface AddressToSave {
  addressText: string;
  longitude: number;
  latitude: number;
}
