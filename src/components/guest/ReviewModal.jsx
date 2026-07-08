// src/components/guest/ReviewModal.jsx

export default function ReviewModal({
  showReview,
  roomNumber,
  items,
  total,
  error,
  onCancel,
  onConfirm,
}) {
  if (!showReview) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="review-modal">
        <h2>🛒 Order Summary</h2>
        <p className="review-room">Room {roomNumber}</p>

        <div className="review-items">
          {items.map((item) => (
            <div className="review-item" key={item.name}>
              <span>
                {item.name} ×{item.quantity}
              </span>
              <strong>
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>

        <div className="review-total">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>

        <div className="pickup-estimate">
          <span>Estimated Pickup</span>
          <strong>5–10 Minutes</strong>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>

          <button className="primary-btn" onClick={onConfirm}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}