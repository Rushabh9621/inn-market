import express from "express";
import {
  getInventory,
  getInventoryHistory,
  restockProduct,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/inventory", getInventory);
router.get("/inventory/history", getInventoryHistory);
router.post("/inventory/:id/restock", restockProduct);

export default router;