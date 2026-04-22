import { useState, useEffect } from "react";
import { api } from "../api";

const ORGANS = ["heart","lungs","liver","kidney","pancreas","intestine"];
const ORGAN_TIME = { heart:6, lungs:6, liver:12, kidney:36, pancreas:18, intestine:8 };

export default function Overview({ hospital, onNavigate }) {
  const [waitingCounts, setWaitingCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};
      for (const organ of ORGANS) {
        try {
          const list = await api.getWaitingList(organ);
          counts[organ] = Array.isArray(list) ? list.filter(p => p.available !== false).length : 0;
        } catch { counts[organ] = 0; }
      }
      setWaitingCounts(counts);
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const total = Object.values(waitingCounts).reduce((a, b) => a + b, 0);
  const critical = ORGANS.filter(o => ORGAN_TIME[o] <= 8);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Good morning, {hospital.hospitalName} 👋</h1>
        <p>Here's the current state of the organ donation network.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card red" data-icon="⏳">
          <div className="stat-num">{loading ? "—" : total}</div>
          <div className="stat-label">Total Waiting</div>
        </div>
        <div className="stat-card teal" data-icon="🫀">
          <div className="stat-num">{ORGANS.length}</div>
          <div className="stat-label">Organs Tracked</div>
        </div>
        <div className="stat-card amber" data-icon="⚠️">
          <div className="stat-num">{loading ? "—" : (waitingCounts["heart"] || 0) + (waitingCounts["lungs"] || 0)}</div>
          <div className="stat-label">Critical (Heart/Lungs)</div>
        </div>
        <div className="stat-card" data-icon="🏥">
          <div className="stat-num">13</div>
          <div className="stat-label">City Network</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Quick Actions</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-danger" onClick={() => onNavigate("allocate")}>
            🔬 Allocate Organ
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate("patients")}>
            🩺 View My Patients
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate("waiting")}>
            ⏳ Waiting List
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate("donor")}>
            ❤️ Register Donor
          </button>
        </div>
      </div>

      {/* Organ Waiting Counts */}
      <div className="card">
        <div className="card-title">Patients Waiting by Organ</div>
        {loading ? (
          <div style={{ textAlign: "center", padding: 32 }}>
            <span className="spinner spinner-dark" />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {ORGANS.map(organ => {
              const count = waitingCounts[organ] || 0;
              const time = ORGAN_TIME[organ];
              const isCritical = time <= 8;
              return (
                <div key={organ} style={{
                  border: `1px solid ${isCritical ? "var(--red-border)" : "var(--border)"}`,
                  background: isCritical ? "var(--red-bg)" : "var(--bg)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                  onClick={() => onNavigate("waiting")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: isCritical ? "var(--red)" : "var(--muted)", marginBottom: 4 }}>
                        {organ}
                      </div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: isCritical ? "var(--red)" : "var(--text)" }}>
                        {count}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Viability</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: isCritical ? "var(--red)" : "var(--teal)", fontWeight: 600 }}>{time}h</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">Allocation Flow</div>
        <div className="flow-steps">
          {[
            { label: "Register Hospital", sub: "One-time setup" },
            { label: "Add Patients", sub: "Clock starts immediately" },
            { label: "Register Donor", sub: "Auto-approved" },
            { label: "Activate Donor", sub: "Algorithm runs" },
            { label: "Review Top 3", sub: "Doctor confirms" },
            { label: "Organ Allocated", sub: "Patient notified" },
          ].map((s, i) => (
            <div key={i} className="flow-step done">
              <div className="flow-step-num">Step {i + 1}</div>
              <div className="flow-step-label">{s.label}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
