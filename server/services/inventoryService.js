import { db } from "../database/database.js";

export function getStockStatus(stock) {
  if (stock <= 0) return "Out";
  if (stock <= 5) return "Critical";
  if (stock <= 20) return "Low";
  return "Healthy";
}

export function recordInventoryHistory({
  productId,
  productName,
  previousStock,
  newStock,
  quantityChanged,
  reason,
  reference = "",
  user = "System",
}) {
  db.prepare(`
    INSERT INTO inventory_history (
      productId,
      productName,
      previousStock,
      newStock,
      quantityChanged,
      reason,
      reference,
      user,
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    productId,
    productName,
    previousStock,
    newStock,
    quantityChanged,
    reason,
    reference,
    user,
    new Date().toISOString()
  );
}

export function changeProductStock({
  productId,
  quantityChanged,
  reason,
  reference = "",
  user = "System",
}) {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const previousStock = Number(product.stock);
  const newStock = Math.max(previousStock + Number(quantityChanged), 0);

  db.prepare(`
    UPDATE products
    SET stock = ?, updatedAt = ?
    WHERE id = ?
  `).run(newStock, new Date().toISOString(), productId);

  recordInventoryHistory({
    productId,
    productName: product.name,
    previousStock,
    newStock,
    quantityChanged,
    reason,
    reference,
    user,
  });

  return db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
}