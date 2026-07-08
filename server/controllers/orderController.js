import { db } from "../database/database.js";
import { changeProductStock } from "../services/inventoryService.js";

function formatOrder(row) {
  const items = db
    .prepare("SELECT name, price, quantity FROM order_items WHERE orderId = ?")
    .all(row.id);

  return {
    id: row.id,
    roomNumber: row.roomNumber,
    total: row.total,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items,
  };
}

export function getLastTwoDaysOrders() {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const rows = db
    .prepare("SELECT * FROM orders WHERE createdAt >= ? ORDER BY createdAt DESC")
    .all(twoDaysAgo);

  return rows.map(formatOrder);
}

export function getOrders(req, res) {
  res.json(getLastTwoDaysOrders());
}

export function getAllOrders(req, res) {
  const rows = db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all();
  res.json(rows.map(formatOrder));
}

export function createOrder(io) {
  return (req, res) => {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    const insertOrder = db.prepare(`
      INSERT INTO orders (id, roomNumber, total, status, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, name, price, quantity)
      VALUES (?, ?, ?, ?)
    `);

    

    const transaction = db.transaction(() => {
      insertOrder.run(id, req.body.roomNumber, req.body.total, "new", createdAt);

      req.body.items.forEach((item) => {
  insertItem.run(id, item.name, item.price, item.quantity);

  const product = db
    .prepare("SELECT id FROM products WHERE name = ?")
    .get(item.name);

  if (product) {
    changeProductStock({
      productId: product.id,
      quantityChanged: -item.quantity,
      reason: "Guest Order",
      reference: id,
      user: `Room ${req.body.roomNumber}`,
    });
  }
});
    });

    transaction();

    const order = formatOrder(
      db.prepare("SELECT * FROM orders WHERE id = ?").get(id)
    );

    io.emit("ordersUpdated", getLastTwoDaysOrders());

    res.status(201).json(order);
  };
}

export function updateOrderStatus(io) {
  return (req, res) => {
    db.prepare(`
      UPDATE orders
      SET status = ?, updatedAt = ?
      WHERE id = ?
    `).run(req.body.status, new Date().toISOString(), req.params.id);

    io.emit("ordersUpdated", getLastTwoDaysOrders());

    res.json({ success: true });
  };
}