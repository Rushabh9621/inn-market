import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ManagementLayout from "../layouts/ManagementLayout";
import Sidebar from "../components/Sidebar";
import { API_URL, getOrders, updateOrderStatus } from "../services/api";
import OrdersSummaryWidget from "../components/OrdersSummaryWidget";
import InventoryAlertWidget from "../components/InventoryAlertWidget";
import { getInventory } from "../services/api";
import RecentActivityWidget from "../components/RecentActivityWidget";
import DailyClosingWidget from "../components/DailyClosingWidget";
import PageHeader from "../components/ui/PageHeader";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [searchRoom, setSearchRoom] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

  const latestOrderIdRef = useRef(null);
  const audioRef = useRef(null);
  const soundEnabledRef = useRef(false);

  async function loadOrders() {
    const data = await getOrders();

    if (data.length > 0 && !latestOrderIdRef.current) {
      latestOrderIdRef.current = data[0].id;
    }

    setOrders(data);
  }

  async function loadInventory() {
    const data = await getInventory();
    setInventory(data);
  }

  function enableSoundAlerts() {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 0.7;
    soundEnabledRef.current = true;
    setSoundEnabled(true);

    audioRef.current.play().then(() => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }).catch(() => {});
  }

  useEffect(() => {
    loadOrders();
    loadInventory();

    const socket = io(API_URL);

    socket.on("ordersUpdated", (updatedOrders) => {
      const newestOrder = updatedOrders[0];

      if (
        newestOrder &&
        latestOrderIdRef.current &&
        newestOrder.id !== latestOrderIdRef.current
      ) {
        setNotification({
          room: newestOrder.roomNumber,
          total: newestOrder.total,
        });

        if (soundEnabledRef.current && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }

        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }

      if (newestOrder) {
        latestOrderIdRef.current = newestOrder.id;
      }

      setOrders(updatedOrders);
      loadInventory();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  async function changeStatus(id, status) {
    await updateOrderStatus(id, status);
    loadOrders();
  }
  function clearOrderFilters() {
  setSearchRoom("");
  setStatusFilter("all");
}

const filteredOrders = orders.filter((order) => {
  const roomText = String(order.roomNumber || "");
  const searchText = String(searchRoom || "");

  const matchesRoom = roomText
    .toLowerCase()
    .includes(searchText.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || order.status === statusFilter;

  return matchesRoom && matchesStatus;
});

const activeOrders = filteredOrders.filter(
  (order) => order.status !== "completed"
);

const completedOrders = filteredOrders.filter(
  (order) => order.status === "completed"
);

  return (
    <ManagementLayout
      title="Operations Center"
      subtitle="Real-Time Motel Operations"
      sidebar={<Sidebar activePage="orders" />}
    >
      {!soundEnabled && (
        <button className="sound-alert-button" onClick={enableSoundAlerts}>
          🔔 Enable Sound Alerts
        </button>
      )}

      {notification && (
        <div className="dashboard-notification">
          <div className="notification-icon">🔔</div>

          <div>
            <strong>New Order Received</strong>
            <p>
              Room {notification.room} • $
              {Number(notification.total).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <PageHeader
        icon="🏠"
        title="Operations Center"
        subtitle="Monitor orders, inventory, and motel activity in real time."
      />

      <OrdersSummaryWidget orders={orders} />
      <InventoryAlertWidget items={inventory} />
      <RecentActivityWidget />
      <DailyClosingWidget orders={orders} inventory={inventory} />
      <div className="order-filter-bar">
  <input
  type="text"
  value={searchRoom}
  onChange={(e) => setSearchRoom(e.target.value)}
  placeholder="Search by room number..."
  autoComplete="off"
/>

  <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="all">All Orders</option>
  <option value="new">New Orders</option>
  <option value="ready">Ready Orders</option>
  <option value="completed">Completed Orders</option>
</select>

<button className="clear-filter-button" onClick={clearOrderFilters}>
  Clear
</button>
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
  <h3>Room {order.roomNumber}</h3>

  <div className={`status-badge ${order.status}`}>
    {order.status.toUpperCase()}
  </div>

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