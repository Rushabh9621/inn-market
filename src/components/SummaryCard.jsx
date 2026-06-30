export default function SummaryCard({
  title,
  value,
  color = "default",
}) {
  return (
    <div className={`summary-card ${color}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}