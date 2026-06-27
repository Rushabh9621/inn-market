import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import path from "path";

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
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadOrders() {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }

  const data = fs.readFileSync(ORDERS_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function getLastTwoDaysOrders(orders) {
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;

  return orders.filter((order) => {
    return new Date(order.createdAt).getTime() >= twoDaysAgo;
  });
}

let orders = loadOrders();

app.get("/api/orders", (req, res) => {
  res.json(getLastTwoDaysOrders(orders));
});

app.get("/api/orders/all", (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const order = {
    id: Date.now().toString(),
    roomNumber: req.body.roomNumber,
    items: req.body.items,
    total: req.body.total,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  orders.unshift(order);
  saveOrders(orders);

  io.emit("ordersUpdated", getLastTwoDaysOrders(orders));

  res.status(201).json(order);
});

app.patch("/api/orders/:id", (req, res) => {
  orders = orders.map((order) =>
    order.id === req.params.id
      ? { ...order, status: req.body.status, updatedAt: new Date().toISOString() }
      : order
  );

  saveOrders(orders);

  io.emit("ordersUpdated", getLastTwoDaysOrders(orders));

  res.json({ success: true });
});

io.on("connection", () => {
  console.log("Dashboard connected");
});

server.listen(3001, () => {
  console.log("Inn Market API running at http://localhost:3001");
});