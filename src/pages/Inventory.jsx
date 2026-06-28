import { useEffect, useMemo, useState } from "react";
import logo from "../assets/logo.png";
import { getInventory, restockProduct } from "../services/api";

function statusClass(status) {
  if (status === "Out") return "stock-critical";
  if (status === "Critical") return "stock-critical";
  if (status === "Low") return "stock-low";
  return "stock-good";
}

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [restockAmounts, setRestockAmounts] = useState({});
  const [search, setSearch] = useState("");

  async function loadInventory() {
    const data = await getInventory();
    setItems(data);
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function handleRestock(id) {
    const quantity = Number(restockAmounts[id] || 0);

    if (quantity <= 0) {
      alert("Enter a restock quantity greater than 0.");
      return;
    }

    await restockProduct(id, quantity);

    setRestockAmounts((prev) => ({
      ...prev,
      [id]: "",
    }));

    loadInventory();
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const lowStockCount = items.filter(
    (item) => item.status === "Low" || item.status === "Critical" || item.status === "Out"
  ).length;

  return (
    <div className="management-layout">
      <aside className="management-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">🏨</div>
          <div>
            <strong>Inn Market OS</strong>
            <span>The Inn At Clinton</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button>🥤 Products</button>
          <button disabled>📦 Orders</button>
          <button className="active">📊 Inventory</button>
          <button disabled>📈 Reports</button>
          <button disabled>📱 QR Codes</button>
          <button disabled>⚙ Settings</button>
        </nav>

        <div className="sidebar-footer">Version 1.0 Preview</div>
      </aside>

      <main className="management-content">
        <div className="dashboard-header">
          <div>
            <div className="eyebrow">Management Console</div>
            <h1>Inventory</h1>
          </div>

          <img src={logo} className="dashboard-logo" alt="The Inn At Clinton" />
        </div>

        <div className="inventory-summary">
          <div className="summary-card">
            <span>Total Products</span>
            <strong>{items.length}</strong>
          </div>

          <div className="summary-card">
            <span>Low Stock Alerts</span>
            <strong>{lowStockCount}</strong>
          </div>

          <div className="summary-card">
            <span>Healthy Items</span>
            <strong>{items.length - lowStockCount}</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-title">
            <h2>Inventory Items</h2>
            <span>{filteredItems.length}</span>
          </div>

          <div className="admin-tools">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
            />
          </div>

          {filteredItems.map((item) => (
            <div className="inventory-card" key={item.id}>
              <div className="inventory-main">
                <div className="product-icon">{item.icon || "🥤"}</div>

                <div>
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                  <span>${Number(item.price).toFixed(2)}</span>
                </div>
              </div>

              <div className="inventory-stock">
                <strong>{item.stock}</strong>
                <span className={`stock-badge ${statusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="restock-box">
                <input
                  type="number"
                  value={restockAmounts[item.id] || ""}
                  onChange={(e) =>
                    setRestockAmounts((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  placeholder="Qty"
                />

                <button onClick={() => handleRestock(item.id)}>Restock</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}