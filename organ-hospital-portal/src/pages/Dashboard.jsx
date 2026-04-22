import { useState } from "react";
import Overview from "./Overview";
import MyPatients from "./MyPatients";
import WaitingList from "./WaitingList";
import AllocateOrgan from "./AllocateOrgan";
import AddDonor from "./AddDonor";

const NAV = [
  { section: "Overview" },
  { id: "overview",   label: "Dashboard",     icon: "📊" },
  { section: "Patients" },
  { id: "patients",   label: "My Patients",   icon: "🩺" },
  { id: "waiting",    label: "Waiting List",  icon: "⏳" },
  { section: "Donors & Allocation" },
  { id: "allocate",   label: "Allocate Organ",icon: "🔬" },
  { id: "donor",      label: "Register Donor",icon: "❤️" },
];

export default function Dashboard({ hospital, onLogout }) {
  const [page, setPage] = useState("overview");
  const [badge, setBadge] = useState(0); // pending allocation badge

  const initials = hospital.hospitalName
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🫀</div>
            <div>
              <div className="sidebar-logo-name">OrganLink</div>
              <div className="sidebar-logo-sub">Hospital Portal</div>
            </div>
          </div>
          <div className="sidebar-hospital">
            <div className="sidebar-hospital-label">Logged in as</div>
            <div className="sidebar-hospital-name">{hospital.hospitalName}</div>
            <div className="sidebar-hospital-city">📍 {hospital.city}</div>
          </div>
        </div>

        <nav className="nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div key={i} className="nav-section">{item.section}</div>
            ) : (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === "allocate" && badge > 0 && (
                  <span className="nav-badge">{badge}</span>
                )}
              </button>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div>
              <div className="sidebar-user-name">{hospital.hospitalName}</div>
              <div className="sidebar-user-role">Hospital Admin</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-full btn-sm"
            onClick={onLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main">
        {page === "overview"  && <Overview  hospital={hospital} onNavigate={setPage} />}
        {page === "patients"  && <MyPatients hospital={hospital} />}
        {page === "waiting"   && <WaitingList hospital={hospital} />}
        {page === "allocate"  && <AllocateOrgan hospital={hospital} onBadge={setBadge} />}
        {page === "donor"     && <AddDonor hospital={hospital} />}
      </main>
    </div>
  );
}