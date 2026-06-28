import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { API_URL, createOrder } from "../services/api";

export default function GuestPage() {
  const [products, setProducts] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [quantities, setQuantities] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [error, setError] = useState("");

  async function loadProducts() {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const changeQty = (id, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + amount, 0),
    }));
  };

  const items = products
    .map((p) => ({
      name: p.name,
      price: Number(p.price),
      quantity: quantities[p.id] || 0,
    }))
    .filter((item) => item.quantity > 0);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const selectedCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const reviewOrder = () => {
    setError("");

    if (!roomNumber.trim()) {
      alert("Please enter your room number.");
      return;
    }

    if (items.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    setShowReview(true);
  };

  const confirmOrder = async () => {
    try {
      const order = await createOrder({
        roomNumber,
        items,
        total,
      });

      setLastOrder(order);
      setShowReview(false);
      setSubmitted(true);
    } catch {
      setError("Could not send order. Make sure the server is running, then try again.");
    }
  };

  const startNewOrder = () => {
    setRoomNumber("");
    setQuantities({});
    setShowReview(false);
    setSubmitted(false);
    setLastOrder(null);
    setError("");
    loadProducts();
  };

  if (submitted && lastOrder) {
    return (
      <div className="page">
        <div className="card success-card">
          <img src={logo} className="logo" alt="The Inn At Clinton" />
          <div className="success-icon">✅</div>
          <div className="eyebrow">Order Sent</div>
          <h1>Thank you!</h1>
          <p>Your order has been sent to the Front Desk.</p>

          <div className="success-summary">
            <strong>Room {lastOrder.roomNumber}</strong>
            <strong>${lastOrder.total.toFixed(2)}</strong>
          </div>

          <p>Please pick up your order at the Front Desk.</p>
          <p>Payment by cash or card at pickup.</p>

          <button className="secondary-button" onClick={startNewOrder}>
            Start New Order
          </button>
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
          Order from your room and pick up at the Front Desk.
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
          <h2>Products</h2>
          <span>{selectedCount} selected</span>
        </div>

        {products.map((product) => (
          <div className="product" key={product.id}>
            <div className="product-left">
              <div className="product-icon">{product.icon || "🥤"}</div>
              <div>
                <strong>{product.name}</strong>
                <span>${Number(product.price).toFixed(2)}</span>
              </div>
            </div>

            <div className="qty">
              <button onClick={() => changeQty(product.id, -1)}>-</button>
              <span>{quantities[product.id] || 0}</span>
              <button onClick={() => changeQty(product.id, 1)}>+</button>
            </div>
          </div>
        ))}

        <div className="cart-bar">
          <div>
            <strong>Total</strong>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={reviewOrder}>Review Order</button>
        </div>

        {showReview && (
          <div className="modal-backdrop">
            <div className="review-modal">
              <div className="eyebrow">Review Order</div>
              <h2>Room {roomNumber}</h2>

              {items.map((item) => (
                <div className="review-row" key={item.name}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}

              <div className="review-total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              {error && <div className="error-box">{error}</div>}

              <div className="review-actions">
                <button
                  className="secondary-button"
                  onClick={() => setShowReview(false)}
                >
                  Cancel
                </button>
                <button className="primary-button" onClick={confirmOrder}>
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}