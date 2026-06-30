import logo from "../assets/logo.png";

export default function Header({ title, subtitle = "Management Console" }) {
  return (
    <div className="dashboard-header">
      <div>
        <div className="eyebrow">{subtitle}</div>
        <h1>{title}</h1>
      </div>

      <img src={logo} className="dashboard-logo" alt="The Inn At Clinton" />
    </div>
  );
}