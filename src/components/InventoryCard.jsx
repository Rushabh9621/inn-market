export default function InventoryCard({
  item,
  restockValue,
  onRestockChange,
  onRestock,
}) {
  return (
    <div className="inventory-card">
      <div className="inventory-main">
        <div className="product-icon">{item.icon || "🥤"}</div>

        <div>
          <strong>{item.name}</strong>
          <span>{item.category}</span>
          <span>${Number(item.price).toFixed(2)}</span>
          <span className={`stock-badge stock-${item.status.toLowerCase()}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="inventory-stock">
        <strong>{item.stock}</strong>
        <small>In Stock</small>
      </div>

      <div className="restock-box">
        <input
          type="number"
          placeholder="Qty"
          value={restockValue}
          onChange={(e) => onRestockChange(e.target.value)}
        />

        <button
          type="button"
          onClick={onRestock}
          style={{
            border: "none",
            borderRadius: "14px",
            padding: "14px 20px",
            fontSize: "16px",
            fontWeight: "800",
            cursor: "pointer",
            backgroundColor: "#4338f2",
            color: "#ffffff",
          }}
        >
          Restock
        </button>
      </div>
    </div>
  );
}