import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import GuestPage from "./pages/GuestPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;