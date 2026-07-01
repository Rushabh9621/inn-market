export default function InventoryReport({ inventory, lowStock }) {
  const healthyProducts = inventory.filter(
    (item) => item.status === "Healthy"
  ).length;

  return (
    <>
      <div className="stat-item">
        <span>Products Needing Restock</span>
        <strong>{lowStock}</strong>
      </div>

      <div className="stat-item">
        <span>Total Products</span>
        <strong>{inventory.length}</strong>
      </div>

      <div className="stat-item">
        <span>Healthy Products</span>
        <strong>{healthyProducts}</strong>
      </div>
    </>
  );
}