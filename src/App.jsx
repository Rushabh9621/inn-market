import "./App.css";
import GuestPage from "./pages/GuestPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  if (path === "/admin") {
    return <Admin />;
  }

  return <GuestPage />;
}

export default App;