import "./App.css";
import GuestPage from "./pages/GuestPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Inventory from "./pages/Inventory";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  if (path === "/admin") {
    return <Admin />;
  }

  if (path === "/inventory") {
    return <Inventory />;
  }

  return <GuestPage />;
}

export default App;