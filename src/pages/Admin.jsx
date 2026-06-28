import { useEffect, useMemo, useState } from "react";
import logo from "../assets/logo.png";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "../services/api";

const categories = ["Drinks", "Snacks", "Toiletries", "Laundry", "Ice", "Other"];

const emptyForm = {
  name: "",
  category: "Drinks",
  price: "",
  stock: "",
  icon: "🥤",
  active: true,
};

function getStockStatus(stock) {
  if (stock <= 5) return { label: "Critical", className: "stock-critical" };
  if (stock <= 20) return { label: "Low", className: "stock-low" };
  return { label: "Good", className: "stock-good" };
}

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

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

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeProduct(id) {
    const confirmDelete = window.confirm("Disable this product?");
    if (!confirmDelete) return;

    await deleteProduct(id);
    loadProducts();
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((groups, product) => {
      const category = product.category || "Other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
      return groups;
    }, {});
  }, [filteredProducts]);

  return (
    <div className="management-layout">
      <aside className="management-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">🏨</div>
          <div>
            <strong>Inn Market OS</strong>
            <span>The Inn At Clinton</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="active">🥤 Products</button>
          <button disabled>📦 Orders</button>
          <button disabled>📊 Inventory</button>
          <button disabled>📈 Reports</button>
          <button disabled>📱 QR Codes</button>
          <button disabled>⚙ Settings</button>
        </nav>

        <div className="sidebar-footer">Version 1.0 Preview</div>
      </aside>

      <main className="management-content">
        <div className="dashboard-header">
          <div>
            <div className="eyebrow">Management Console</div>
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
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>

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
              <span>{filteredProducts.length}</span>
            </div>

            <div className="admin-tools">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
              />

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            {Object.keys(groupedProducts).length === 0 && (
              <div className="empty">No products found.</div>
            )}

            {Object.entries(groupedProducts).map(([category, items]) => (
              <div key={category} className="admin-category-section">
                <h3>{category}</h3>

                {items.map((product) => {
                  const stockStatus = getStockStatus(Number(product.stock));

                  return (
                    <div className="admin-product-card" key={product.id}>
                      <div className="product-left">
                        <div className="product-icon">
                          {product.icon || "🥤"}
                        </div>

                        <div>
                          <strong>{product.name}</strong>
                          <span>${Number(product.price).toFixed(2)}</span>

                          <span
                            className={`stock-badge ${stockStatus.className}`}
                          >
                            Stock {product.stock} • {stockStatus.label}
                          </span>

                          <span>
                            {product.active === 1 ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="admin-actions">
                        <button onClick={() => editProduct(product)}>
                          Edit
                        </button>
                        <button
                          className="dark-button"
                          onClick={() => removeProduct(product.id)}
                        >
                          Disable
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}