import { db } from "../database/database.js";

export function getActiveProducts(req, res) {
  const products = db
    .prepare("SELECT * FROM products WHERE active = 1 ORDER BY id ASC")
    .all();

  res.json(products);
}

export function getAdminProducts(req, res) {
  const products = db.prepare("SELECT * FROM products ORDER BY id ASC").all();
  res.json(products);
}

export function createProduct(req, res) {
  const now = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO products (name, category, price, stock, icon, active, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.body.name,
    req.body.category || "Drinks",
    Number(req.body.price),
    Number(req.body.stock || 0),
    req.body.icon || "🥤",
    req.body.active ? 1 : 0,
    now
  );

  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(product);
}

export function updateProduct(req, res) {
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE products
    SET name = ?, category = ?, price = ?, stock = ?, icon = ?, active = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    req.body.name,
    req.body.category || "Drinks",
    Number(req.body.price),
    Number(req.body.stock || 0),
    req.body.icon || "🥤",
    req.body.active ? 1 : 0,
    now,
    req.params.id
  );

  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(req.params.id);

  res.json(product);
}

export function deleteProduct(req, res) {
  db.prepare("UPDATE products SET active = 0, updatedAt = ? WHERE id = ?").run(
    new Date().toISOString(),
    req.params.id
  );

  res.json({ success: true });
}