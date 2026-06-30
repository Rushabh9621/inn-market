import { db } from "../database/database.js";
import {
  changeProductStock,
  getStockStatus,
} from "../services/inventoryService.js";

export function getInventory(req, res) {
  const products = db
    .prepare("SELECT * FROM products ORDER BY category ASC, name ASC")
    .all()
    .map((product) => ({
      ...product,
      status: getStockStatus(Number(product.stock)),
    }));

  res.json(products);
}

export function restockProduct(req, res) {
  const productId = req.params.id;
  const quantity = Number(req.body.quantity || 0);

  if (quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }

  try {
    const updatedProduct = changeProductStock({
      productId,
      quantityChanged: quantity,
      reason: "Restock",
      reference: "Manual",
      user: "Rushabh",
    });

    res.json({
      ...updatedProduct,
      status: getStockStatus(Number(updatedProduct.stock)),
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
export function getInventoryHistory(req, res) {
  const history = db
    .prepare("SELECT * FROM inventory_history ORDER BY createdAt DESC LIMIT 100")
    .all();

  res.json(history);
}