import { db } from "../database/database.js";

export function getRooms(req, res) {
  const rooms = db.prepare("SELECT * FROM rooms ORDER BY roomNumber ASC").all();
  res.json(rooms);
}

export function createRoom(req, res) {
  const roomNumber = String(req.body.roomNumber || "").trim();

  if (!roomNumber) {
    return res.status(400).json({ error: "Room number is required" });
  }

  const now = new Date().toISOString();

  try {
    const result = db
      .prepare(`
        INSERT INTO rooms (roomNumber, active, createdAt)
        VALUES (?, ?, ?)
      `)
      .run(roomNumber, 1, now);

    const room = db
      .prepare("SELECT * FROM rooms WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(room);
  } catch {
    res.status(400).json({ error: "Room already exists" });
  }
}

export function updateRoom(req, res) {
  const roomNumber = String(req.body.roomNumber || "").trim();
  const active = req.body.active ? 1 : 0;

  db.prepare(`
    UPDATE rooms
    SET roomNumber = ?, active = ?, updatedAt = ?
    WHERE id = ?
  `).run(roomNumber, active, new Date().toISOString(), req.params.id);

  const room = db.prepare("SELECT * FROM rooms WHERE id = ?").get(req.params.id);
  res.json(room);
}