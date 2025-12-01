import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchAddressHistory,
  saveAddressToHistory,
} from "../api/index";

const HISTORY_QUERY_KEY = ["address-history"];

// 1. Hook to fetch and expose the history data
export function useAddressHistory(numberOfAddress: number) {
  const { data, isLoading, isError } = useQuery({
    queryKey: HISTORY_QUERY_KEY,
    queryFn: () => {
      return fetchAddressHistory(numberOfAddress);
    },
    staleTime: 1000 * 60 * 5, // Cache history for 5 mins
  });

  return { data: data ?? [], isLoading, isError };
}

// Define the shape of the data the mutation will receive


// 2. Hook to save a new item (used after successful navigation)
export function useSaveAddressHistory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (address: AddressToSave) => {
      const data = await saveAddressToHistory(address);
      console.log("Saved this address (inside mutationFn)", data);
      return data;
    },
    onSuccess: (data) => {
      // ----------------------------------------------------
      // Print the data returned by saveAddressToHistory
      console.log(
        "✅ Successfully saved address. Returned data:",
        data
      );
      // ----------------------------------------------------

      // Invalidate the cache to trigger a background re-fetch of the new list
      queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
    },
    // IMPORTANT: Add an onError handler to catch network/API errors
    onError: (error) => {
      console.error("❌ Mutation failed (Network/API Error):", error);
    },
  });

  return mutation;
}
