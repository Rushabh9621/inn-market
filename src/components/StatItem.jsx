export default function StatItem({ icon, label, value }) {
  return (
    <div className="stat-item">
      <div className="stat-left">
        <div className="stat-icon">{icon}</div>
        <span>{label}</span>
      </div>

      <strong>{value}</strong>
    </div>
  );
}