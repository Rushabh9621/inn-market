import Sidebar from "../components/Sidebar";
import PageHeader from "../components/ui/PageHeader";

export default function Settings() {
  return (
    <div className="management-shell">
      <Sidebar activePage="settings" />

      <main className="management-main">
        <PageHeader
          icon="⚙️"
          title="Settings"
          subtitle="Manage Inn Market OS configuration."
        />

        <div className="settings-grid">
          <section className="settings-card">
            <h2>Hotel Information</h2>

            <label>Motel Name</label>
            <input value="The Inn At Clinton" readOnly />

            <label>System Name</label>
            <input value="Inn Market OS" readOnly />
          </section>

          <section className="settings-card">
            <h2>Guest Ordering</h2>

            <label>Pickup Location</label>
            <input value="Front Desk" readOnly />

            <label>Estimated Pickup Time</label>
            <input value="5–10 Minutes" readOnly />

            <label>Payment Methods</label>
            <input value="Cash or Card at pickup" readOnly />
          </section>

          <section className="settings-card">
            <h2>System Status</h2>

            <div className="settings-status">
              <span>Guest Ordering</span>
              <strong>Enabled</strong>
            </div>

            <div className="settings-status">
              <span>Inventory Tracking</span>
              <strong>Enabled</strong>
            </div>

            <div className="settings-status">
              <span>QR Room Links</span>
              <strong>Enabled</strong>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}