import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const DATA_DIR = path.join(process.cwd(), "server", "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new Database(path.join(DATA_DIR, "inn-market.db"));

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      roomNumber TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Drinks',
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      icon TEXT DEFAULT '🥤',
      active INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT
    );
  `);

  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count;

  if (productCount === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (name, category, price, stock, icon, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    insertProduct.run("Water", "Drinks", 2, 120, "💧", 1, now);
    insertProduct.run("Coke", "Drinks", 2, 80, "🥤", 1, now);
    insertProduct.run("Pepsi", "Drinks", 2, 80, "🥤", 1, now);
    insertProduct.run("Mountain Dew", "Drinks", 2, 80, "🥤", 1, now);
  }
}