export default function Sidebar({ activePage }) {
  return (
    <aside className="management-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">🏨</div>
        <div>
          <strong>The Inn At Clinton</strong>
          <span>Inn Market OS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <a className={activePage === "orders" ? "active" : ""} href="/dashboard">
          🏠 Operations
        </a>

        <a className={activePage === "products" ? "active" : ""} href="/admin">
          🥤 Products
        </a>

        <a className={activePage === "inventory" ? "active" : ""} href="/inventory">
          📦 Inventory
        </a>

        <a className={activePage === "rooms" ? "active" : ""} href="/rooms">
          🏨 Rooms
        </a>

        <a className={activePage === "qrcodes" ? "active" : ""} href="/qrcodes">
          📱 QR Manager
        </a>

        <span>📊 Reports</span>
        <span>⚙ Settings</span>
      </nav>

      <div className="sidebar-footer">Version 0.12.0</div>
    </aside>
  );
}