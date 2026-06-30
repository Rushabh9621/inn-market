import { useEffect, useState } from "react";
import { getRoomQRCode } from "../services/api";
import Button from "./Button";

export default function QRCard({ room }) {
  const [qr, setQr] = useState(null);

  useEffect(() => {
    async function loadQR() {
      const data = await getRoomQRCode(room.roomNumber);
      setQr(data);
    }

    loadQR();
  }, [room.roomNumber]);

  if (!qr) {
    return (
      <div className="room-card">
        Loading Room {room.roomNumber}...
      </div>
    );
  }

  return (
  <div className="room-card qr-card">
    <div className="qr-room-header">
      <h3>Room {room.roomNumber}</h3>
      <span className="stock-badge stock-good">Ready</span>
    </div>

    <img
      src={qr.qrDataUrl}
      alt={`Room ${room.roomNumber}`}
      className="qr-image"
    />

    <p className="qr-instructions">
      Scan to order from your room.
    </p>

    <div className="room-url">
      {qr.guestUrl}
    </div>

    <div className="qr-actions">
      <Button
        onClick={() => navigator.clipboard.writeText(qr.guestUrl)}
      >
        Copy Link
      </Button>
    </div>
  </div>
);
}