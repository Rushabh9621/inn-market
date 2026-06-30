import { useEffect, useState } from "react";
import ManagementLayout from "../layouts/ManagementLayout";
import Sidebar from "../components/Sidebar";
import RoomCard from "../components/RoomCard";
import { getRooms } from "../services/api";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  async function loadRooms() {
    const data = await getRooms();
    setRooms(data);
  }

  useEffect(() => {
    loadRooms();
  }, []);

  const activeRooms = rooms.filter((room) => room.active === 1).length;

  return (
    <ManagementLayout
      title="Rooms"
      subtitle="Management Console"
      sidebar={<Sidebar activePage="rooms" />}
    >
      <div className="inventory-summary">
        <div className="summary-card">
          <span>Total Rooms</span>
          <strong>{rooms.length}</strong>
        </div>

        <div className="summary-card">
          <span>Active Rooms</span>
          <strong>{activeRooms}</strong>
        </div>

        <div className="summary-card">
          <span>QR Ready</span>
          <strong>{activeRooms}</strong>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-title">
          <h2>Room QR Links</h2>
          <span>{rooms.length}</span>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </ManagementLayout>
  );
}