export default function StickyCart({ selectedCount, total, onReview }) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="cart-bar">
      <div>
        <strong>🛒 {selectedCount} Items</strong>
        <span>Total ${total.toFixed(2)}</span>
      </div>

      <button onClick={onReview}>Review Order →</button>
    </div>
  );
}