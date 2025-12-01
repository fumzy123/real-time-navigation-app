// Define your history item structure
export interface HistoryItem {
  id: string;
  addressText: string;
  coordinates: [number, number];
  lastUsed: string; // ISO date string
}

export const fetchAddressHistory = async (): Promise<
  HistoryItem[]
> => {
  const response = await fetch("/api/history");
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
};

export const saveAddressToHistory = async (address: {
  addressText: string;
  coordinates: [number, number];
}) => {
  const response = await fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  if (!response.ok) throw new Error("Failed to save history");
};
