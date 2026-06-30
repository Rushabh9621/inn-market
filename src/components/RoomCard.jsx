export default function RoomCard({ room }) {
  const qrUrl = `${window.location.origin}/?room=${room.roomNumber}`;

  return (
    <div className="room-card">
      <div>
        <strong>Room {room.roomNumber}</strong>
        <span>{room.active === 1 ? "Active" : "Inactive"}</span>
      </div>

      <div className="room-url">
        {qrUrl}
      </div>
    </div>
  );
}