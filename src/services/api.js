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

export async function getAdminProducts() {
  const res = await fetch(`${API_URL}/api/admin/products`);
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(`${API_URL}/api/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
    method: "DELETE",
  });

  return res.json();
}
export async function getInventory() {
  const res = await fetch(`${API_URL}/api/inventory`);
  return res.json();
}

export async function restockProduct(id, quantity) {
  const res = await fetch(`${API_URL}/api/inventory/${id}/restock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });

  return res.json();
}