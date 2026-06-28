import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import logo from "./assets/logo.png";

const API_URL = "http://localhost:3001";

const products = [
  { name: "Water", price: 2, icon: "💧" },
  { name: "Coke", price: 2, icon: "🥤" },
  { name: "Pepsi", price: 2, icon: "🥤" },
  { name: "Mountain Dew", price: 2, icon: "🥤" },
];

function GuestPage() {
  const [roomNumber, setRoomNumber] = useState("");
  const [quantities, setQuantities] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const changeQty = (name, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [name]: Math.max((prev[name] || 0) + amount, 0),
    }));
  };

  const items = products
    .map((p) => ({
      name: p.name,
      price: p.price,
      quantity: quantities[p.name] || 0,
    }))
    .filter((item) => item.quantity > 0);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const submitOrder = async () => {
    if (!roomNumber.trim()) {
      alert("Please enter your room number.");
      return;
    }

    if (items.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    const confirmOrder = window.confirm(
      `Confirm order for Room ${roomNumber}?\n\n${items
        .map((item) => `${item.name} x ${item.quantity}`)
        .join("\n")}\n\nTotal: $${total.toFixed(2)}`
    );

    if (!confirmOrder) return;

    await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomNumber,
        items,
        total,
      }),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="card success-card">
          <img src={logo} className="logo" alt="The Inn At Clinton" />
          <h1>Thank You!</h1>
          <p>Your order has been sent to the Front Desk.</p>
          <p>Please pick it up at the Front Desk.</p>
          <p>Payment will be made at pickup by cash or card.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <img src={logo} className="logo" alt="The Inn At Clinton" />
        <div className="eyebrow">Guest Market</div>
        <h1>The Inn At Clinton Market</h1>
        <p className="subtitle">
          Order drinks from your room and pick them up at the Front Desk.
        </p>

        <div className="info-box">
          Pickup only • Payment at Front Desk • Cash or Card
        </div>

        <label>Room Number</label>
        <input
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="Example: 214"
        />

        <div className="section-header">
          <h2>Drinks</h2>
          <span>{items.reduce((sum, item) => sum + item.quantity, 0)} selected</span>
        </div>

        {products.map((product) => (
          <div className="product" key={product.name}>
            <div className="product-left">
              <div className="product-icon">{product.icon}</div>
              <div>
                <strong>{product.name}</strong>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="qty">
              <button onClick={() => changeQty(product.name, -1)}>-</button>
              <span>{quantities[product.name] || 0}</span>
              <button onClick={() => changeQty(product.name, 1)}>+</button>
            </div>
          </div>
        ))}

        <div className="cart-bar">
          <div>
            <strong>Total</strong>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={submitOrder}>Review Order</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await fetch(`${API_URL}/api/orders`);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();

    const socket = io(API_URL);
    socket.on("ordersUpdated", (updatedOrders) => {
      setOrders(updatedOrders);
    });

    return () => socket.disconnect();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${API_URL}/api/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
  };

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
                <strong>Room {order.roomNumber}</strong>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>

              {order.items.map((item) => (
                <div className="order-item" key={item.name}>
                  {item.name} × {item.quantity}
                </div>
              ))}

              <div className="order-total">Total: ${order.total.toFixed(2)}</div>

              <div className="order-actions">
                {order.status === "new" && (
                  <button onClick={() => updateStatus(order.id, "ready")}>
                    Mark Ready
                  </button>
                )}

                <button onClick={() => updateStatus(order.id, "completed")}>
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
              Room {order.roomNumber} • ${order.total.toFixed(2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  return <GuestPage />;
}
export default App;