import { db } from "../database/database.js";

function getStatus(stock) {
  if (stock <= 0) return "Out";
  if (stock <= 5) return "Critical";
  if (stock <= 20) return "Low";
  return "Healthy";
}

export function getInventory(req, res) {
  const products = db
    .prepare("SELECT * FROM products ORDER BY category ASC, name ASC")
    .all()
    .map((product) => ({
      ...product,
      status: getStatus(Number(product.stock)),
    }));

  res.json(products);
}

export function restockProduct(req, res) {
  const productId = req.params.id;
  const quantity = Number(req.body.quantity || 0);

  if (quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const newStock = Number(product.stock) + quantity;
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE products
    SET stock = ?, updatedAt = ?
    WHERE id = ?
  `).run(newStock, now, productId);

  const updatedProduct = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(productId);

  res.json({
    ...updatedProduct,
    status: getStatus(Number(updatedProduct.stock)),
  });
}