import { useEffect, useState } from "react";
import ManagementLayout from "../layouts/ManagementLayout";
import Sidebar from "../components/Sidebar";
import QRCard from "../components/QRCard";
import { getRooms } from "../services/api";

export default function QRManager() {
  const [rooms, setRooms] = useState([]);

  async function loadRooms() {
    const data = await getRooms();
    setRooms(data);
  }

  useEffect(() => {
    loadRooms();
  }, []);

  const activeRooms = rooms.filter((room) => room.active === 1);

  return (
    <ManagementLayout
      title="QR Manager"
      subtitle="Management Console"
      sidebar={<Sidebar activePage="qrcodes" />}
    >
      <div className="dashboard-card">
        <div className="dashboard-title">
          <h2>Room QR Codes</h2>

          <div className="qr-toolbar">
            <button className="primary-button" onClick={() => window.print()}>
              🖨 Print All QR Cards
            </button>

            <span>{activeRooms.length}</span>
          </div>
        </div>

        <div className="rooms-grid">
          {activeRooms.map((room) => (
            <QRCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </ManagementLayout>
  );
}