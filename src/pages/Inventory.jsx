import { useEffect, useMemo, useState } from "react";
import ManagementLayout from "../layouts/ManagementLayout";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import InventoryCard from "../components/InventoryCard";
import { getInventory, restockProduct } from "../services/api";

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
    (item) =>
      item.status === "Low" ||
      item.status === "Critical" ||
      item.status === "Out"
  ).length;

  const healthyCount = items.length - lowStockCount;

  const inventoryValue = items.reduce(
    (sum, item) => sum + Number(item.stock) * Number(item.price),
    0
  );

  return (
    <ManagementLayout
      title="Inventory"
      subtitle="Management Console"
      sidebar={<Sidebar activePage="inventory" />}
    >
      <div className="inventory-summary">
        <SummaryCard title="Total Products" value={items.length} />
        <SummaryCard title="Low Stock Alerts" value={lowStockCount} color="warning" />
        <SummaryCard title="Healthy Items" value={healthyCount} color="success" />
        <SummaryCard
          title="Inventory Value"
          value={`$${inventoryValue.toFixed(2)}`}
          color="info"
        />
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

        {filteredItems.length === 0 && (
          <div className="empty">No inventory items found.</div>
        )}

        {filteredItems.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            restockValue={restockAmounts[item.id] || ""}
            onRestockChange={(value) =>
              setRestockAmounts((prev) => ({
                ...prev,
                [item.id]: value,
              }))
            }
            onRestock={() => handleRestock(item.id)}
          />
        ))}
      </div>
    </ManagementLayout>
  );
}