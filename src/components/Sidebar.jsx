export default function Sidebar({ activePage }) {
  return (
    <aside className="management-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">🏨</div>
        <div>
          <strong>Inn Market OS</strong>
          <span>The Inn At Clinton</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className={activePage === "products" ? "active" : ""}>
          🥤 Products
        </button>

        <button className={activePage === "inventory" ? "active" : ""}>
          📊 Inventory
        </button>

        <button disabled>📦 Orders</button>
        <button disabled>📈 Reports</button>
        <button disabled>📱 QR Codes</button>
        <button disabled>⚙ Settings</button>
      </nav>

      <div className="sidebar-footer">Version 1.0 Preview</div>
    </aside>
  );
}