import { useEffect, useState } from "react";
import ManagementLayout from "../layouts/ManagementLayout";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import { getInventory, getOrders } from "../services/api";
import RevenueReport from "../components/reports/RevenueReport";
import InventoryReport from "../components/reports/InventoryReport";
import RoomPerformanceReport from "../components/reports/RoomPerformanceReport";
import TrendsReport from "../components/reports/TrendsReport";
import ReportDateFilter from "../components/reports/ReportDateFilter";

function isInSelectedRange(dateString, activeRange) {
  const date = new Date(dateString);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (activeRange === "today") {
    return date >= startOfToday && date < startOfTomorrow;
  }

  if (activeRange === "yesterday") {
    return date >= startOfYesterday && date < startOfToday;
  }

  if (activeRange === "week") {
    return date >= startOfWeek && date < startOfTomorrow;
  }

  if (activeRange === "month") {
    return date >= startOfMonth && date < startOfTomorrow;
  }

  return true;
}

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeReport, setActiveReport] = useState("revenue");
  const [activeRange, setActiveRange] = useState("today");

  useEffect(() => {
    async function load() {
      const orderData = await getOrders();
      const inventoryData = await getInventory();

      setOrders(orderData);
      setInventory(inventoryData);
    }

    load();
  }, []);

  const filteredOrders = orders.filter((order) =>
    isInSelectedRange(order.createdAt, activeRange)
  );

  const completedOrders = filteredOrders.filter(
    (order) => order.status === "completed"
  );

  const revenue = completedOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const averageOrder =
    completedOrders.length === 0 ? 0 : revenue / completedOrders.length;

  const lowStock = inventory.filter(
    (item) =>
      item.status === "Low" ||
      item.status === "Critical" ||
      item.status === "Out"
  ).length;

  const roomStats = {};

  completedOrders.forEach((order) => {
    if (!roomStats[order.roomNumber]) {
      roomStats[order.roomNumber] = {
        room: order.roomNumber,
        orders: 0,
        revenue: 0,
      };
    }

    roomStats[order.roomNumber].orders += 1;
    roomStats[order.roomNumber].revenue += Number(order.total);
  });

  const topRooms = Object.values(roomStats).sort(
    (a, b) => b.revenue - a.revenue
  );

  return (
    <ManagementLayout
      title="Business Intelligence"
      subtitle="Reports"
      sidebar={<Sidebar activePage="reports" />}
    >
      <div className="inventory-summary">
        <SummaryCard
          title="Revenue"
          value={`$${revenue.toFixed(2)}`}
          color="success"
        />

        <SummaryCard title="Completed Orders" value={completedOrders.length} />

        <SummaryCard
          title="Average Order"
          value={`$${averageOrder.toFixed(2)}`}
          color="info"
        />

        <SummaryCard title="Inventory Alerts" value={lowStock} color="warning" />
      </div>

      <ReportDateFilter
        activeRange={activeRange}
        setActiveRange={setActiveRange}
      />

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
          <RevenueReport
            revenue={revenue}
            completedOrders={completedOrders}
            averageOrder={averageOrder}
          />
        )}

        {activeReport === "inventory" && (
          <InventoryReport inventory={inventory} lowStock={lowStock} />
        )}

        {activeReport === "rooms" && (
          <RoomPerformanceReport topRooms={topRooms} />
        )}

        {activeReport === "trends" && <TrendsReport />}
      </div>
    </ManagementLayout>
  );
}