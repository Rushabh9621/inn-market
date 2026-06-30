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
        <a className={activePage === "products" ? "active" : ""} href="/admin">
          🥤 Products
        </a>

        <a className={activePage === "inventory" ? "active" : ""} href="/inventory">
          📊 Inventory
        </a>

        <a className={activePage === "orders" ? "active" : ""} href="/dashboard">
          📦 Orders
        </a>

        <span>📈 Reports</span>
        <span>📱 QR Codes</span>
        <span>⚙ Settings</span>
      </nav>

      <div className="sidebar-footer">Version 0.10.0</div>
    </aside>
  );
}