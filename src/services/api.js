export const API_URL = "http://localhost:3001";

export async function getOrders() {
  const res = await fetch(`${API_URL}/api/orders`);
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_URL}/api/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return res.json();
}