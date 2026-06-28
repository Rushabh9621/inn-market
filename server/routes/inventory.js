import express from "express";
import {
  getInventory,
  restockProduct,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/inventory", getInventory);
router.post("/inventory/:id/restock", restockProduct);

export default router;