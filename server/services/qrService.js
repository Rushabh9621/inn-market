import QRCode from "qrcode";

export async function generateRoomQRCode(roomNumber, baseUrl) {
  const guestUrl = `${baseUrl}/?room=${roomNumber}`;

  const qrDataUrl = await QRCode.toDataURL(guestUrl, {
    width: 300,
    margin: 2,
  });

  return {
    roomNumber,
    guestUrl,
    qrDataUrl,
  };
}