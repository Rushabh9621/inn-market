export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="loading-spinner-wrap">
      <div className="loading-spinner"></div>
      <p>{text}</p>
    </div>
  );
}