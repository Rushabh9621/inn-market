import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");

app.use(cors());
app.use(express.json());

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
  }
}

function readOrders() {
  ensureDataFile();
  const raw = fs.readFileSync(ordersFile, "utf8");
  return JSON.parse(raw || "[]");
}

function writeOrders(orders) {
  ensureDataFile();
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "The Inn At Clinton Market API" });
});

app.get("/api/orders", (req, res) => {
  const orders = readOrders();
  res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post("/api/orders", (req, res) => {
  const { roomNumber, items, total, notes } = req.body;

  if (!roomNumber || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Room number and at least one item are required." });
  }

  const orders = readOrders();
  const order = {
    id: `ORD-${Date.now()}`,
    roomNumber: String(roomNumber).trim(),
    items,
    total: Number(total || 0),
    notes: notes || "",
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(order);
  writeOrders(orders);
  res.status(201).json(order);
});

app.patch("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ["new", "ready", "completed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Order not found." });
  }

  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString()
  };

  writeOrders(orders);
  res.json(orders[index]);
});

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`Inn Market API running at http://localhost:${PORT}`);
});
