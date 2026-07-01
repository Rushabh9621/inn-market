import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import GuestPage from "./pages/GuestPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Inventory from "./pages/Inventory";
import Rooms from "./pages/Rooms";
import QRManager from "./pages/QRManager";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/qrcodes" element={<QRManager />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;