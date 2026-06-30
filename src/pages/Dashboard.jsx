import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ManagementLayout from "../layouts/ManagementLayout";
import Sidebar from "../components/Sidebar";
import { API_URL, getOrders, updateOrderStatus } from "../services/api";
import OrdersSummaryWidget from "../components/OrdersSummaryWidget";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    const data = await getOrders();
    setOrders(data);
  }

  useEffect(() => {
    loadOrders();

    const socket = io(API_URL);

    socket.on("ordersUpdated", (updatedOrders) => {
      setOrders(updatedOrders);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  async function changeStatus(id, status) {
    await updateOrderStatus(id, status);
    loadOrders();
  }

  const activeOrders = orders.filter((order) => order.status !== "completed");
  const completedOrders = orders.filter((order) => order.status === "completed");

  return (
    <ManagementLayout
      title="Orders"
      subtitle="Front Desk"
      sidebar={<Sidebar activePage="orders" />}
    >
      <OrdersSummaryWidget orders={orders} />
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-title">
            <h2>Active Orders</h2>
            <span>{activeOrders.length}</span>
          </div>

          {activeOrders.length === 0 && (
            <div className="empty">No active orders right now.</div>
          )}

          {activeOrders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-top">
                <div>
                  <h3>Room {order.roomNumber}</h3>
                  <span>
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <strong>${Number(order.total).toFixed(2)}</strong>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.name}>
                    {item.quantity} × {item.name}
                  </div>
                ))}
              </div>

              <div className="order-actions">
                <button onClick={() => changeStatus(order.id, "ready")}>
                  Mark Ready
                </button>

                <button
                  className="dark-button"
                  onClick={() => changeStatus(order.id, "completed")}
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-card">
          <div className="dashboard-title">
            <h2>Completed</h2>
            <span>{completedOrders.length}</span>
          </div>

          {completedOrders.length === 0 && (
            <div className="empty">No completed orders yet.</div>
          )}

          {completedOrders.map((order) => (
            <div className="completed-row" key={order.id}>
              <span>Room {order.roomNumber}</span>
              <strong>${Number(order.total).toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </div>
    </ManagementLayout>
  );
}