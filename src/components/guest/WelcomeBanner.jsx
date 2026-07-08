// src/components/guest/WelcomeBanner.jsx

import logo from "../../assets/logo.png";

export default function WelcomeBanner() {
  return (
    <>
      <img src={logo} className="logo" alt="The Inn At Clinton" />

      <div className="eyebrow">Guest Market</div>

      <h1>Welcome to The Inn At Clinton</h1>

      <p className="subtitle">
        Order from your room and pick up at the Front Desk.
      </p>

      <div className="info-box">
        Pickup only • Payment at Front Desk • Cash or Card
      </div>
    </>
  );
}