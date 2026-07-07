import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { API_URL, createOrder } from "../services/api";
import ProductCard from "../components/guest/ProductCard";
import StickyCart from "../components/guest/StickyCart";

const categories = ["Drinks", "Snacks", "Toiletries"];

export default function GuestPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Drinks");
  const [roomNumber, setRoomNumber] = useState("");
  const [isQrRoom, setIsQrRoom] = useState(false);
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

    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");

    if (room) {
      setRoomNumber(room);
      setIsQrRoom(true);
    }
  }, []);

  const changeQty = (id, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + amount, 0),
    }));
  };

  const filteredProducts = products.filter(
  (product) => product.category === activeCategory
);

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
    setQuantities({});
    setShowReview(false);
    setSubmitted(false);
    setLastOrder(null);
    setError("");
    loadProducts();

    if (!isQrRoom) {
      setRoomNumber("");
    }
  };

  if (submitted && lastOrder) {
    return (
      <div className="page">
        <div className="card success-card">
          <img src={logo} className="logo" alt="The Inn At Clinton" />
          <div className="success-icon">✅</div>
          <div className="eyebrow">Order Received</div>
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
        <h1>Welcome to The Inn At Clinton</h1>

        <p className="subtitle">
          Order from your room and pick up at the Front Desk.
        </p>

        <div className="info-box">
          Pickup only • Payment at Front Desk • Cash or Card
        </div>

        {isQrRoom ? (
          <div className="verified-room">
            <div className="verified-icon">✅</div>
            <div>
              <strong>Room {roomNumber} Verified</strong>
              <span>Your room was detected from the QR code.</span>
            </div>
          </div>
        ) : (
          <>
            <label>Room Number</label>
            <input
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="Example: 214"
            />
          </>
        )}

        <div className="guest-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              
              {category === "Drinks" && "🥤 Drinks"}
              {category === "Snacks" && "🍫 Snacks"}
              {category === "Toiletries" && "🪥 Toiletries"}
            </button>
          ))}
        </div>

        <div className="section-header">
          <h2>{activeCategory} Products</h2>
          <span>{selectedCount} selected</span>
        </div>

        <div className="guest-product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
  key={product.id}
  product={product}
  quantity={quantities[product.id] || 0}
  onDecrease={() => changeQty(product.id, -1)}
  onIncrease={() => changeQty(product.id, 1)}
/>
          ))}
        </div>

        <StickyCart
  selectedCount={selectedCount}
  total={total}
  onReview={reviewOrder}
/>

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