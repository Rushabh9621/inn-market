export default function RevenueReport({ revenue, completedOrders, averageOrder }) {
  return (
    <>
      <div className="stat-item">
        <span>Revenue Today</span>
        <strong>${revenue.toFixed(2)}</strong>
      </div>

      <div className="stat-item">
        <span>Completed Orders</span>
        <strong>{completedOrders.length}</strong>
      </div>

      <div className="stat-item">
        <span>Average Order Value</span>
        <strong>${averageOrder.toFixed(2)}</strong>
      </div>
    </>
  );
}