export default function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="page-header">
      <div className="page-header-icon">{icon}</div>

      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}