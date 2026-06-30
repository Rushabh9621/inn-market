export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: "14px",
        padding: "14px 20px",
        fontSize: "16px",
        fontWeight: "800",
        cursor: "pointer",
        background: "#4338f2",
        color: "white",
      }}
    >
      {children}
    </button>
  );
}