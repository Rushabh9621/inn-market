import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "../services/api";

const emptyForm = {
  name: "",
  category: "Drinks",
  price: "",
  stock: "",
  icon: "🥤",
  active: true,
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function loadProducts() {
    const data = await getAdminProducts();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingId) {
      await updateProduct(editingId, productData);
    } else {
      await createProduct(productData);
    }

    setForm(emptyForm);
    setEditingId(null);
    loadProducts();
  }

  function editProduct(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      icon: product.icon || "🥤",
      active: product.active === 1,
    });
  }

  async function removeProduct(id) {
    const confirmDelete = window.confirm("Disable this product?");
    if (!confirmDelete) return;

    await deleteProduct(id);
    loadProducts();
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <div className="eyebrow">Admin</div>
          <h1>Product Manager</h1>
        </div>

        <img src={logo} className="dashboard-logo" alt="The Inn At Clinton" />
      </div>

      <div className="admin-grid">
        <div className="dashboard-card">
          <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Water"
              required
            />

            <label>Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Drinks"
              required
            />

            <label>Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="2.00"
              required
            />

            <label>Stock</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="100"
              required
            />

            <label>Icon</label>
            <input
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="🥤"
            />

            <label className="checkbox-row">
              <input
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={handleChange}
              />
              Active
            </label>

            <button className="primary-button" type="submit">
              {editingId ? "Save Changes" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-title">
            <h2>Products</h2>
            <span>{products.length}</span>
          </div>

          {products.map((product) => (
            <div className="admin-product-card" key={product.id}>
              <div className="product-left">
                <div className="product-icon">{product.icon || "🥤"}</div>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <span>
                    ${Number(product.price).toFixed(2)} • Stock {product.stock}
                  </span>
                  <span>{product.active === 1 ? "Active" : "Inactive"}</span>
                </div>
              </div>

              <div className="admin-actions">
                <button onClick={() => editProduct(product)}>Edit</button>
                <button className="dark-button" onClick={() => removeProduct(product.id)}>
                  Disable
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}