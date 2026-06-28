import "./App.css";
import GuestPage from "./pages/GuestPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  return <GuestPage />;
}

export default App;