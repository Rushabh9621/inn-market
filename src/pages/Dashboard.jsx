import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import logo from "../assets/logo.png";
import { API_URL, getOrders, updateOrderStatus } from "../services/api";

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

    return () => socket.disconnect();
  }, []);

  async function handleStatus(id, status) {
    await updateOrderStatus(id, status);
  }

  const activeOrders = orders.filter((order) => order.status !== "completed");
  const completedOrders = orders.filter((order) => order.status === "completed");

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <div className="eyebrow">Front Desk</div>
          <h1>The Inn At Clinton Market</h1>
        </div>

        <img src={logo} className="dashboard-logo" alt="The Inn At Clinton" />
      </div>

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
                  <strong>Room {order.roomNumber}</strong>
                  <small>
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>

                <strong>${order.total.toFixed(2)}</strong>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.name}>
                    {item.quantity} × {item.name}
                  </div>
                ))}
              </div>

              <div className="order-actions">
                {order.status === "new" && (
                  <button onClick={() => handleStatus(order.id, "ready")}>
                    Mark Ready
                  </button>
                )}

                <button
                  className="dark-button"
                  onClick={() => handleStatus(order.id, "completed")}
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
            <div className="completed-order" key={order.id}>
              <span>Room {order.roomNumber}</span>
              <strong>${order.total.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}