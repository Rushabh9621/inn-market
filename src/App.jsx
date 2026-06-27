import { useEffect, useMemo, useState } from "react";
import logo from "./assets/logo.png";
import "./App.css";

const API_URL = "http://localhost:3001/api";

const products = [
  { id: "water", name: "Water", price: 2, icon: "💧" },
  { id: "coke", name: "Coke", price: 2, icon: "🥤" },
  { id: "pepsi", name: "Pepsi", price: 2, icon: "🥤" },
  { id: "mountain-dew", name: "Mountain Dew", price: 2, icon: "🍋" }
];

function currency(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

function GuestOrderPage() {
  const [roomNumber, setRoomNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [quantities, setQuantities] = useState({});
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [error, setError] = useState("");

  const selectedItems = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        quantity: quantities[product.id] || 0,
        lineTotal: (quantities[product.id] || 0) * product.price
      }))
      .filter((item) => item.quantity > 0);
  }, [quantities]);

  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  function changeQuantity(productId, amount) {
    setQuantities((current) => {
      const nextQty = Math.max((current[productId] || 0) + amount, 0);
      return { ...current, [productId]: nextQty };
    });
  }

  function startReview() {
    setError("");

    if (!roomNumber.trim()) {
      setError("Please enter your room number.");
      return;
    }

    if (selectedItems.length === 0) {
      setError("Please select at least one item.");
      return;
    }

    setReviewing(true);
  }

  async function confirmOrder() {
    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber,
          notes,
          total,
          items: selectedItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            lineTotal: item.lineTotal
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Order could not be sent.");
      }

      const order = await response.json();
      setSubmittedOrder(order);
      setReviewing(false);
    } catch (err) {
      setError("Could not send order. Make sure the server is running, then try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedOrder) {
    return (
      <main className="page">
        <section className="card success-card">
          <img src={logo} alt="The Inn At Clinton" className="logo" />
          <div className="success-icon">✅</div>
          <p className="eyebrow">Order Sent</p>
          <h1>Thank you!</h1>
          <p className="subtitle">Your order has been sent to the Front Desk.</p>
          <div className="summary-box">
            <strong>Room {submittedOrder.roomNumber}</strong>
            <span>{currency(submittedOrder.total)}</span>
          </div>
          <p className="pickup-message">Please pick up your order at the Front Desk. Payment by cash or card at pickup.</p>
          <button className="secondary-button" onClick={() => window.location.reload()}>Start New Order</button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <img src={logo} alt="The Inn At Clinton" className="logo" />
        <p className="eyebrow">Guest Market</p>
        <h1>The Inn At Clinton Market</h1>
        <p className="subtitle">Order drinks from your room and pick them up at the Front Desk.</p>
        <div className="notice">Pickup only • Payment at Front Desk • Cash or Card</div>

        <label htmlFor="roomNumber">Room Number</label>
        <input
          id="roomNumber"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="Example: 214"
          inputMode="numeric"
        />

        <div className="section-title">
          <h2>Drinks</h2>
          <span>{selectedCount} selected</span>
        </div>

        <div className="products-list">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-left">
                <div className="product-icon">{product.icon}</div>
                <div>
                  <strong>{product.name}</strong>
                  <span>{currency(product.price)}</span>
                </div>
              </div>
              <div className="qty">
                <button type="button" onClick={() => changeQuantity(product.id, -1)}>-</button>
                <span>{quantities[product.id] || 0}</span>
                <button type="button" onClick={() => changeQuantity(product.id, 1)}>+</button>
              </div>
            </article>
          ))}
        </div>

        <label htmlFor="notes">Special Notes <small>(optional)</small></label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Example: Please call room when ready"
        />

        {error && <div className="error-message">{error}</div>}

        <div className="cart-summary">
          <div>
            <span>Total</span>
            <strong>{currency(total)}</strong>
          </div>
          <button className="order-button" type="button" onClick={startReview}>Review Order</button>
        </div>

        <p className="note">Payment will be made at the Front Desk.</p>
      </section>

      {reviewing && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <p className="eyebrow">Review Order</p>
            <h2>Room {roomNumber}</h2>
            <div className="review-list">
              {selectedItems.map((item) => (
                <div className="review-row" key={item.id}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>{currency(item.lineTotal)}</strong>
                </div>
              ))}
            </div>
            {notes && <p className="review-notes"><strong>Notes:</strong> {notes}</p>}
            <div className="review-total">
              <span>Total</span>
              <strong>{currency(total)}</strong>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setReviewing(false)}>Cancel</button>
              <button className="order-button" type="button" onClick={confirmOrder} disabled={submitting}>
                {submitting ? "Sending..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Could not load orders", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, status) {
    await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    loadOrders();
  }

  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 5000);
    return () => clearInterval(timer);
  }, []);

  const newOrders = orders.filter((order) => order.status !== "completed");
  const completedOrders = orders.filter((order) => order.status === "completed").slice(0, 10);

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Front Desk</p>
          <h1>The Inn At Clinton Market</h1>
        </div>
        <img src={logo} alt="The Inn At Clinton" className="dashboard-logo" />
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-title">
            <h2>Active Orders</h2>
            <span>{newOrders.length}</span>
          </div>

          {loading && <p>Loading orders...</p>}
          {!loading && newOrders.length === 0 && <p className="empty-state">No active orders right now.</p>}

          <div className="order-list">
            {newOrders.map((order) => (
              <article className={`order-card ${order.status}`} key={order.id}>
                <div className="order-card-header">
                  <div>
                    <p className="room-label">Room {order.roomNumber}</p>
                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <strong>{currency(order.total)}</strong>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id}>{item.quantity} × {item.name}</div>
                  ))}
                </div>
                {order.notes && <p className="order-notes">Notes: {order.notes}</p>}
                <div className="order-actions">
                  {order.status === "new" && (
                    <button onClick={() => updateStatus(order.id, "ready")}>Mark Ready</button>
                  )}
                  {order.status === "ready" && <span className="ready-badge">Ready for Pickup</span>}
                  <button className="complete-button" onClick={() => updateStatus(order.id, "completed")}>Complete</button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-title">
            <h2>Completed</h2>
            <span>{completedOrders.length}</span>
          </div>
          {completedOrders.length === 0 && <p className="empty-state">No completed orders yet.</p>}
          <div className="completed-list">
            {completedOrders.map((order) => (
              <div className="completed-row" key={order.id}>
                <span>Room {order.roomNumber}</span>
                <strong>{currency(order.total)}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <DashboardPage />;
  }

  return <GuestOrderPage />;
}

export default App;
