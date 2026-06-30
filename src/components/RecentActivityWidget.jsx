import { useEffect, useState } from "react";
import { getInventoryHistory } from "../services/api";

export default function RecentActivityWidget() {
  const [activities, setActivities] = useState([]);

  async function loadHistory() {
    const data = await getInventoryHistory();
    setActivities(data.slice(0, 10));
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="dashboard-card">
      <div className="dashboard-title">
        <h2>Recent Activity</h2>
        <span>{activities.length}</span>
      </div>

      {activities.length === 0 && (
        <div className="empty">No recent activity.</div>
      )}

      {activities.map((activity) => (
        <div className="activity-card" key={activity.id}>
          <div>
            <strong>{activity.productName}</strong>
            <span>
              {activity.previousStock} → {activity.newStock}
            </span>
            <span>{activity.reason}</span>
          </div>

          <div className="activity-right">
            <strong>
              {activity.quantityChanged > 0 ? "+" : ""}
              {activity.quantityChanged}
            </strong>

            <span>{activity.user}</span>

            <span>
              {new Date(activity.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}