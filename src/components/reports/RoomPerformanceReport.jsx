export default function RoomPerformanceReport({ topRooms }) {
  if (topRooms.length === 0) {
    return (
      <div className="empty">
        No completed room orders yet.
      </div>
    );
  }

  return (
    <>
      {topRooms.map((room, index) => (
        <div className="stat-item" key={room.room}>
          <div>
            <span>
              #{index + 1} • Room {room.room}
            </span>

            <small>
              {room.orders} Orders
            </small>
          </div>

          <strong>${room.revenue.toFixed(2)}</strong>
        </div>
      ))}
    </>
  );
}