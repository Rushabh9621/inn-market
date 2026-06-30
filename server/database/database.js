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
        CREATE TABLE IF NOT EXISTS inventory_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      productName TEXT NOT NULL,
      previousStock INTEGER NOT NULL,
      newStock INTEGER NOT NULL,
      quantityChanged INTEGER NOT NULL,
      reason TEXT NOT NULL,
      reference TEXT,
      user TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
        CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roomNumber TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT
    );
  `);

  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
  const roomCount = db.prepare(
  "SELECT COUNT(*) as count FROM rooms"
).get().count;

if (roomCount === 0) {
  const insertRoom = db.prepare(`
    INSERT INTO rooms (roomNumber, active, createdAt)
    VALUES (?, ?, ?)
  `);

  const now = new Date().toISOString();

  const rooms = [
    "100","101","102","103","104","105","106","107",
    "108","109","110","111","112","113","114","115",
    "116","117","118","119","120","122","124","200",
    "201","202","203","204","205","206","207","208",
    "209","210","211","212","213","214","215","216",
    "217","218","219","220","221","222","224","226",
    "227","228"

  ];

  rooms.forEach((room) => {
    insertRoom.run(room, 1, now);
  });
}

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