import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initializeDatabase } from "./database/database.js";
import productRoutes from "./routes/products.js";
import createOrderRoutes from "./routes/orders.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

initializeDatabase();

app.use("/api", productRoutes);
app.use("/api", createOrderRoutes(io));

io.on("connection", () => {
  console.log("Dashboard connected");
});

server.listen(3001, () => {
  console.log("Inn Market API running at http://localhost:3001");
});