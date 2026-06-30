export default function OrdersSummaryWidget({ orders }) {
  const active = orders.filter(
    (order) => order.status !== "completed"
  );

  const completed = orders.filter(
    (order) => order.status === "completed"
  );

  const revenue = completed.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div className="inventory-summary">
      <div className="summary-card">
        <span>Active Orders</span>
        <strong>{active.length}</strong>
      </div>

      <div className="summary-card warning">
        <span>Completed Today</span>
        <strong>{completed.length}</strong>
      </div>

      <div className="summary-card success">
        <span>Revenue Today</span>
        <strong>${revenue.toFixed(2)}</strong>
      </div>
    </div>
  );
}