// Define your history item structure
export interface HistoryItem {
  id: string;
  addressText: string;
  coordinates: [number, number];
  lastUsed: string; // ISO date string
}

export interface AddressToSave {
  addressText: string;
  longitude: number;
  latitude: number;
}

import { client } from "../../../shared/api";

export const fetchAddressHistory = async (
  numOfAddress: number
): Promise<HistoryItem[]> => {
  try {
    const response = await client.get(
      `/addressHistory?limit=${numOfAddress}`
    );

    // Axios throws for non-2xx, but just in case:
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to fetch history (status ${response.status})`
      );
    }

    return response.data as HistoryItem[];
  } catch (err) {
    console.error("Error fetching address history:", err);
    throw new Error("Failed to fetch history");
  }
};

export const saveAddressToHistory = async (
  address: AddressToSave
) => {
  try {
    const response = await client.post("/addressHistory", address);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to fetch history (status ${response.status})`
      );
    }
    return response.data as HistoryItem;
  } catch (err) {
    console.error("Error saving address history:", err);
    throw new Error("Failed to save history");
  }
};
