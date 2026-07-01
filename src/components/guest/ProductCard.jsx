export default function ProductCard({ product, quantity, onDecrease, onIncrease }) {
  return (
    <div className="guest-product-card">
      <div className="guest-product-brand">{product.icon || "🥤"}</div>

      <strong>{product.name}</strong>
      <span>${Number(product.price).toFixed(2)}</span>

      <div className="qty guest-qty">
        <button onClick={onDecrease}>-</button>
        <span>{quantity || 0}</span>
        <button onClick={onIncrease}>+</button>
      </div>
    </div>
  );
}