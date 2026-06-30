export default function ActivityCard({ activity }) {
  const changeText =
    activity.quantityChanged > 0
      ? `+${activity.quantityChanged}`
      : `${activity.quantityChanged}`;

  return (
    <div className="activity-card">
      <div>
        <strong>{activity.productName}</strong>
        <span>
          {activity.previousStock} → {activity.newStock}
        </span>
        <span>{activity.reason}</span>
      </div>

      <div className="activity-right">
        <strong>{changeText}</strong>
        <span>{activity.user}</span>
        <span>
          {new Date(activity.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}