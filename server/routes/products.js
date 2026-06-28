import express from "express";
import {
  createProduct,
  deleteProduct,
  getActiveProducts,
  getAdminProducts,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getActiveProducts);
router.get("/admin/products", getAdminProducts);
router.post("/admin/products", createProduct);
router.put("/admin/products/:id", updateProduct);
router.delete("/admin/products/:id", deleteProduct);

export default router;