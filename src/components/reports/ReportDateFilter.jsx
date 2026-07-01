export default function ReportDateFilter({ activeRange, setActiveRange }) {
  const ranges = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  return (
    <div className="report-date-filter">
      {ranges.map((range) => (
        <button
          key={range.key}
          className={activeRange === range.key ? "active" : ""}
          onClick={() => setActiveRange(range.key)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}