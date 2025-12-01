// Define your history item structure
export interface HistoryItem {
  id: string;
  addressText: string;
  coordinates: [number, number];
  lastUsed: string; // ISO date string
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

export const saveAddressToHistory = async (address: {
  addressText: string;
  coordinates: [number, number];
}) => {
  try {
    await client.post("/addressHistory", address);
  } catch (err) {
    console.error("Error saving address history:", err);
    throw new Error("Failed to save history");
  }
};
