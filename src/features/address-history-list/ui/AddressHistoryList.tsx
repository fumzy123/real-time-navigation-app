import type { HistoryItem } from "../../../entities/address-history/api";
import { useAddressHistory } from "../../../entities/address-history/model/useAddressHistory";

interface AddressHistoryListProps {
  onAddressSelected: (item: HistoryItem) => void;
}

export function AddressHistoryList({
  onAddressSelected,
}: AddressHistoryListProps) {
  const { data: history, isLoading, isError } = useAddressHistory();

  if (isLoading) return <div>Loading history...</div>;
  if (isError) return <div>Could not load history.</div>;
  if (history.length === 0) return null;

  return (
    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
      <h4>Recent Destinations</h4>
      <ul>
        {history.map((item) => (
          <li
            key={item.id}
            onClick={() => onAddressSelected(item)}
            style={{ cursor: "pointer", padding: "5px 0" }}
          >
            📍 {item.addressText}
          </li>
        ))}
      </ul>
    </div>
  );
}
