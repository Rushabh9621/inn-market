import StatItem from "./StatItem";

export default function DailyClosingWidget({ orders, inventory }) {
  const completedOrders = orders.filter((order) => order.status === "completed");

  const revenue = completedOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const lowStockItems = inventory.filter(
    (item) =>
      item.status === "Low" ||
      item.status === "Critical" ||
      item.status === "Out"
  );

  return (
    <div className="dashboard-card">
      <div className="dashboard-title">
        <h2>Daily Closing Report</h2>
        <span>Today</span>
      </div>

      <div className="closing-grid">
        <StatItem icon="📦" label="Completed Orders" value={completedOrders.length} />
<StatItem icon="💰" label="Revenue" value={`$${revenue.toFixed(2)}`} />
<StatItem icon="⚠️" label="Inventory Alerts" value={lowStockItems.length} />
      </div>

      <button className="primary-button" onClick={() => window.print()}>
        📄 Print Closing Report
      </button>
    </div>
  );
}