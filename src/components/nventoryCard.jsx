export default function InventoryCard({
  item,
  restockValue,
  onRestockChange,
  onRestock,
}) {
  return (
    <div className="inventory-card">
      <div className="inventory-main">
        <div className="product-icon">
          {item.icon || "🥤"}
        </div>

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
          className="primary-button"
          onClick={onRestock}
        >
          Restock
        </button>
      </div>
    </div>
  );
}