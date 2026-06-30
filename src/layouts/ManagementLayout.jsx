export default function ManagementLayout({
  title,
  subtitle,
  sidebar,
  children,
}) {
  return (
    <div className="management-layout">
      {sidebar}

      <main className="management-content">
        <div className="dashboard-header">
          <div>
            <div className="eyebrow">{subtitle}</div>
            <h1>{title}</h1>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}