import { useEffect, useState } from "react";
import ManagementLayout from "../layouts/ManagementLayout";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import { getInventory, getOrders } from "../services/api";

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeReport, setActiveReport] = useState("revenue");

  useEffect(() => {
    async function load() {
      const orderData = await getOrders();
      const inventoryData = await getInventory();

      setOrders(orderData);
      setInventory(inventoryData);
    }

    load();
  }, []);

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const revenue = completedOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const averageOrder =
    completedOrders.length === 0
      ? 0
      : revenue / completedOrders.length;

  const lowStock = inventory.filter(
    (item) =>
      item.status === "Low" ||
      item.status === "Critical" ||
      item.status === "Out"
  ).length;

  return (
    <ManagementLayout
      title="Business Intelligence"
      subtitle="Reports"
      sidebar={<Sidebar activePage="reports" />}
    >
      <div className="inventory-summary">
        <SummaryCard
          title="Today's Revenue"
          value={`$${revenue.toFixed(2)}`}
          color="success"
        />

        <SummaryCard
          title="Completed Orders"
          value={completedOrders.length}
        />

        <SummaryCard
          title="Average Order"
          value={`$${averageOrder.toFixed(2)}`}
          color="info"
        />

        <SummaryCard
          title="Inventory Alerts"
          value={lowStock}
          color="warning"
        />
      </div>

      <div className="dashboard-card">
        <div className="dashboard-title">
          <h2>
  {activeReport === "revenue" && "Revenue Report"}
  {activeReport === "inventory" && "Inventory Report"}
  {activeReport === "rooms" && "Room Performance"}
  {activeReport === "trends" && "Trends"}
</h2>
        </div>
        <div className="report-tabs">
  <button
    className={activeReport === "revenue" ? "active" : ""}
    onClick={() => setActiveReport("revenue")}
  >
    💰 Revenue
  </button>

  <button
    className={activeReport === "inventory" ? "active" : ""}
    onClick={() => setActiveReport("inventory")}
  >
    📦 Inventory
  </button>

  <button
    className={activeReport === "rooms" ? "active" : ""}
    onClick={() => setActiveReport("rooms")}
  >
    🏨 Rooms
  </button>

  <button
    className={activeReport === "trends" ? "active" : ""}
    onClick={() => setActiveReport("trends")}
  >
    📈 Trends
  </button>
</div>

        {activeReport === "revenue" && (
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
)}

{activeReport === "inventory" && (
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
      <strong>
        {
          inventory.filter((item) => item.status === "Healthy").length
        }
      </strong>
    </div>
  </>
)}

{activeReport === "rooms" && (
  <div className="empty">
    Room performance analytics coming soon...
  </div>
)}

{activeReport === "trends" && (
  <div className="empty">
    Charts and trends coming soon...
  </div>
)}
      </div>
    </ManagementLayout>
  );
}