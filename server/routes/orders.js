import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

export default function createOrderRoutes(io) {
  const router = express.Router();

  router.get("/orders", getOrders);
  router.get("/orders/all", getAllOrders);
  router.post("/orders", createOrder(io));
  router.patch("/orders/:id", updateOrderStatus(io));

  return router;
}