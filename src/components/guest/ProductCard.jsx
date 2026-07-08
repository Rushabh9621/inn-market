export default function ProductCard({ product, quantity, onDecrease, onIncrease }) {
  const stock = Number(product.stock || 0);
  const currentQuantity = quantity || 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const reachedStockLimit = currentQuantity >= stock;

  return (
    <div className={`guest-product-card ${isOutOfStock ? "out-of-stock" : ""}`}>
      <div className="guest-product-brand">{product.icon || "🥤"}</div>

      <strong>{product.name}</strong>
      <span>${Number(product.price).toFixed(2)}</span>

      {isOutOfStock && <div className="stock-badge out">Out of Stock</div>}

      {isLowStock && <div className="stock-badge low">Only {stock} left</div>}

      {!isOutOfStock ? (
        <>
          <div className="qty guest-qty">
            <button onClick={onDecrease}>-</button>
            <span>{currentQuantity}</span>
            <button onClick={onIncrease} disabled={reachedStockLimit}>
              +
            </button>
          </div>

          {reachedStockLimit && (
            <div className="stock-limit-message">
              Max available selected
            </div>
          )}
        </>
      ) : (
        <button className="unavailable-button" disabled>
          Unavailable
        </button>
      )}
    </div>
  );
}