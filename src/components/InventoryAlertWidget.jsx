import AlertCard from "./AlertCard";
export default function InventoryAlertWidget({ items }) {
  const alertItems = items.filter(
    (item) =>
      item.status === "Low" ||
      item.status === "Critical" ||
      item.status === "Out"
  );

  return (
    <div className="dashboard-card">
      <div className="dashboard-title">
        <h2>Inventory Alerts</h2>
        <span>{alertItems.length}</span>
      </div>

      {alertItems.length === 0 && (
        <div className="empty">No inventory alerts right now.</div>
      )}

      {alertItems.map((item) => (
  <AlertCard
    key={item.id}
    icon={item.icon || "🥤"}
    title={item.name}
    message={`Only ${item.stock} left in stock`}
    status={item.status}
  />
))}
    </div>
  );
}