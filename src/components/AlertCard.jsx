export default function AlertCard({ icon = "⚠️", title, message, status }) {
  return (
    <div className="alert-card">
      <div className="alert-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{message}</span>
      </div>

      <div className={`alert-status alert-${status.toLowerCase()}`}>
        {status}
      </div>
    </div>
  );
}