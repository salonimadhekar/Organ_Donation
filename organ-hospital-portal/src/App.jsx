import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

export default function App() {
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("hospital");
    if (saved) setHospital(JSON.parse(saved));
  }, []);

  const login = (h) => {
    sessionStorage.setItem("hospital", JSON.stringify(h));
    setHospital(h);
  };

  const logout = () => {
    sessionStorage.removeItem("hospital");
    setHospital(null);
  };

  if (!hospital) return <Login onLogin={login} />;
  return <Dashboard hospital={hospital} onLogout={logout} />;
}