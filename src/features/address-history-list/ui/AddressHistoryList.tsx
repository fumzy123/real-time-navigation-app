import type { HistoryItem } from "../../../entities/address-history/api";
import { useAddressHistory } from "../../../entities/address-history/model/useAddressHistory";

interface AddressHistoryListProps {
  onAddressSelected: (item: HistoryItem) => void;
}

export function AddressHistoryList({
  onAddressSelected,
}: AddressHistoryListProps) {
  const { data: history, isLoading, isError } = useAddressHistory(4);

  if (isLoading)
    return <div style={{ color: "#aaa" }}>Loading history...</div>;
  if (isError)
    return (
      <div style={{ color: "#f44336" }}>Could not load history.</div>
    );
  if (history.length === 0) return null;

  return (
    // Outer container for the 'Recent Destinations' section
    <div
      style={{ padding: "16px 20px", backgroundColor: "transparent" }}
    >
      <h4
        style={{
          color: "#ffffff", // Light text for the dark background
          fontSize: "16px",
          marginBottom: "12px",
          fontWeight: "600",
        }}
      >
        Recent Destinations
      </h4>
      <ul
        style={{
          listStyle: "none",
          padding: "0",
          margin: "0",
          display: "flex",
          flexDirection: "column",
          gap: "10px", // Space between cards
        }}
      >
        {history.map((item) => (
          <li
            key={item.id}
            onClick={() => onAddressSelected(item)}
            // Styles for the individual card/list item
            style={{
              cursor: "pointer",
              backgroundColor: "#2e343b", // Slightly lighter dark background for the card
              color: "#ffffff",
              padding: "15px 20px",
              borderRadius: "12px", // Rounded corners for card look
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.2s",
            }}
            // You would use an external CSS file or a CSS-in-JS solution for real-world ':hover'
            // For inline styles, you can only set the base properties
          >
            <span
              style={{
                marginRight: "10px",
                fontSize: "18px",
                color: "#ff6b6b", // A vibrant color for the pin icon
              }}
            >
              📍
            </span>
            <span style={{ fontSize: "16px", fontWeight: "400" }}>
              {item.addressText}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
