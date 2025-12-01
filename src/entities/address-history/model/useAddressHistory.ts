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

// 2. Hook to save a new item (used after successful navigation)
export function useSaveAddressHistory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveAddressToHistory,
    onSuccess: () => {
      // Invalidate the cache to trigger a background re-fetch of the new list
      queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
    },
  });

  return mutation;
}
