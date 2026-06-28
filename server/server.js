import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
  },
});

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "server", "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "inn-market.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    roomNumber TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id)
  );
`);

function formatOrder(row) {
  const items = db
    .prepare("SELECT name, price, quantity FROM order_items WHERE orderId = ?")
    .all(row.id);

  return {
    id: row.id,
    roomNumber: row.roomNumber,
    total: row.total,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items,
  };
}

function getLastTwoDaysOrders() {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const rows = db
    .prepare("SELECT * FROM orders WHERE createdAt >= ? ORDER BY createdAt DESC")
    .all(twoDaysAgo);

  return rows.map(formatOrder);
}

app.get("/api/orders", (req, res) => {
  res.json(getLastTwoDaysOrders());
});

app.get("/api/orders/all", (req, res) => {
  const rows = db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all();
  res.json(rows.map(formatOrder));
});

app.post("/api/orders", (req, res) => {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  const insertOrder = db.prepare(`
    INSERT INTO orders (id, roomNumber, total, status, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (orderId, name, price, quantity)
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    insertOrder.run(id, req.body.roomNumber, req.body.total, "new", createdAt);

    req.body.items.forEach((item) => {
      insertItem.run(id, item.name, item.price, item.quantity);
    });
  });

  transaction();

  const order = formatOrder(
    db.prepare("SELECT * FROM orders WHERE id = ?").get(id)
  );

  io.emit("ordersUpdated", getLastTwoDaysOrders());

  res.status(201).json(order);
});

app.patch("/api/orders/:id", (req, res) => {
  db.prepare(`
    UPDATE orders
    SET status = ?, updatedAt = ?
    WHERE id = ?
  `).run(req.body.status, new Date().toISOString(), req.params.id);

  io.emit("ordersUpdated", getLastTwoDaysOrders());

  res.json({ success: true });
});

io.on("connection", () => {
  console.log("Dashboard connected");
});

server.listen(3001, () => {
  console.log("Inn Market API running at http://localhost:3001");
});