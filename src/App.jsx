import { useState } from "react";
import "./App.css";

const products = [
  { name: "Water", price: 2 },
  { name: "Coke", price: 2 },
  { name: "Pepsi", price: 2 },
  { name: "Mountain Dew", price: 2 },
];

function App() {
  const [room, setRoom] = useState("");
  const [quantities, setQuantities] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const changeQty = (name, amount) => {
    setQuantities((prev) => {
      const next = Math.max((prev[name] || 0) + amount, 0);
      return { ...prev, [name]: next };
    });
  };

  const total = products.reduce(
    (sum, p) => sum + (quantities[p.name] || 0) * p.price,
    0
  );

  const placeOrder = () => {
    if (!room) {
      alert("Please enter your room number.");
      return;
    }

    if (total === 0) {
      alert("Please select at least one item.");
      return;
    }

    console.log("Order placed:", { room, quantities, total });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="card">
          <h1>Thank You!</h1>
          <p>Your order has been sent to the Front Desk.</p>
          <p>Please pick it up at the Front Desk.</p>
          <p>Payment by cash or card at pickup.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>The Inn At Clinton Market</h1>
        <p className="subtitle">
          Order drinks from your room and pick up at the Front Desk.
        </p>

        <label>Room Number</label>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Example: 214"
        />

        <h2>Drinks</h2>

        {products.map((product) => (
          <div className="product" key={product.name}>
            <div>
              <strong>{product.name}</strong>
              <span>${product.price.toFixed(2)}</span>
            </div>

            <div className="qty">
              <button onClick={() => changeQty(product.name, -1)}>-</button>
              <span>{quantities[product.name] || 0}</span>
              <button onClick={() => changeQty(product.name, 1)}>+</button>
            </div>
          </div>
        ))}

        <div className="total">Total: ${total.toFixed(2)}</div>

        <button className="orderButton" onClick={placeOrder}>
          Place Order
        </button>

        <p className="note">Payment will be made at the Front Desk.</p>
      </div>
    </div>
  );
}

export default App;