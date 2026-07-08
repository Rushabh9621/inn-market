import { useEffect, useState } from "react";
import { API_URL, createOrder } from "../services/api";
import ProductCard from "../components/guest/ProductCard";
import StickyCart from "../components/guest/StickyCart";
import ReviewModal from "../components/guest/ReviewModal";
import WelcomeBanner from "../components/guest/WelcomeBanner";
import logo from "../assets/logo.png";
import CategorySelector from "../components/guest/CategorySelector";
import LoadingSpinner from "../components/guest/LoadingSpinner";

const categories = ["Drinks", "Snacks", "Toiletries"];

export default function GuestPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Drinks");
  const [searchTerm, setSearchTerm] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isQrRoom, setIsQrRoom] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

async function loadProducts() {
  setLoading(true);
  setError("");

  try {
    const res = await fetch(`${API_URL}/api/products`);

    if (!res.ok) {
      throw new Error("Products request failed");
    }

    const data = await res.json();
    setProducts(data);
  } catch {
    setError("Could not load products. Please make sure the server is running.");
  } finally {
    setLoading(false);
  }
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

const filteredProducts = products.filter((product) => {
  const matchesCategory = product.category === activeCategory;
  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  return matchesCategory && matchesSearch;
});

  const items = products
  .map((p) => ({
    id: p.id,
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

        <div className="eyebrow">Order Confirmed</div>

        <h1>Thank you!</h1>

        <p className="success-message">
          Your order has been sent to the Front Desk.
        </p>

        <div className="success-details">
          <div>
            <span>Room</span>
            <strong>{lastOrder.roomNumber}</strong>
          </div>

          <div>
            <span>Total</span>
            <strong>${Number(lastOrder.total).toFixed(2)}</strong>
          </div>

          <div>
            <span>Estimated Pickup</span>
            <strong>5–10 Minutes</strong>
          </div>
        </div>

        <div className="pickup-note">
          <strong>Pickup at Front Desk</strong>
          <span>Payment by cash or card at pickup.</span>
        </div>

        <button className="primary-button" onClick={startNewOrder}>
          Start New Order
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="page">
      <div className="card">
        <WelcomeBanner />

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

        <CategorySelector
  categories={categories}
  activeCategory={activeCategory}
  onSelect={setActiveCategory}
/>

        <div className="guest-search-box">
  <input
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search products..."
  />
</div>
        <div className="section-header">
          <h2>{activeCategory} Products</h2>
          <span>{selectedCount} selected</span>
        </div>

        {loading && <LoadingSpinner text="Loading products..." />}
        {!loading && filteredProducts.length === 0 && (
  <p className="empty-products-message">
    No products found in {activeCategory}.
  </p>
)}
        {error && <p className="error-box">{error}</p>}
        <div className="guest-product-grid">
          {!loading && filteredProducts.map((product) => (
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

        <ReviewModal
  showReview={showReview}
  roomNumber={roomNumber}
  items={items}
  total={total}
  error={error}
  onCancel={() => setShowReview(false)}
  onConfirm={confirmOrder}
/>
      </div>
    </div>
  );
}