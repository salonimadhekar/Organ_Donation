import { useState } from "react";
import HospitalPanel from "./components/HospitalPanel";
import DonorPanel from "./components/DonorPanel";
import PatientPanel from "./components/PatientPanel";
import AllocationPanel from "./components/AllocationPanel";
import "./App.css";

const NAV = [
  { id: "hospital", label: "Hospitals", icon: "🏥" },
  { id: "donor", label: "Donors", icon: "❤️" },
  { id: "patient", label: "Patients", icon: "🩺" },
  { id: "allocate", label: "Allocate", icon: "🔬" },
];

export default function App() {
  const [active, setActive] = useState("hospital");

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">🫀</span>
          <div>
            <div className="brand-name">OrganLink</div>
            <div className="brand-sub">Donation Network</div>
          </div>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${active === n.id ? "active" : ""}`}
              onClick={() => setActive(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
              {active === n.id && <span className="nav-pip" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="status-dot" />
          <span>API: localhost:8080</span>
        </div>
      </aside>

      <main className="main">
        <div className="page-header">
          <h1>{NAV.find((n) => n.id === active)?.label}</h1>
          <div className="header-accent" />
        </div>
        <div className="content">
          {active === "hospital" && <HospitalPanel />}
          {active === "donor" && <DonorPanel />}
          {active === "patient" && <PatientPanel />}
          {active === "allocate" && <AllocationPanel />}
        </div>
      </main>
    </div>
  );
}