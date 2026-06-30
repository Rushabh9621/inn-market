import { generateRoomQRCode } from "../services/qrService.js";

export async function getRoomQRCode(req, res) {
  const roomNumber = req.params.roomNumber;
  const baseUrl = req.query.baseUrl || "http://localhost:5173";

  try {
    const qr = await generateRoomQRCode(roomNumber, baseUrl);
    res.json(qr);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
}