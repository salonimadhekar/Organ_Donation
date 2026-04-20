import { useState } from "react";
import { api } from "../api";

const ORGAN_TIMES = {
  heart: 6, lungs: 6, liver: 12, kidney: 36,
  pancreas: 18, intestine: 8,
};

const CITIES = [
  "Mumbai", "Pune", "Ahmedabad", "Delhi",
  "Kolkata", "Hyderabad", "Bangalore", "Chennai",
];

const EDGES = [
  ["Mumbai", "Pune", 150],
  ["Mumbai", "Ahmedabad", 500],
  ["Pune", "Ahmedabad", 400],
  ["Ahmedabad", "Delhi", 900],
  ["Delhi", "Kolkata", 1500],
  ["Delhi", "Hyderabad", 1200],
  ["Hyderabad", "Bangalore", 500],
  ["Bangalore", "Chennai", 350],
  ["Hyderabad", "Chennai", 600],
  ["Pune", "Bangalore", 800],
  ["Mumbai", "Bangalore", 900],
  ["Chennai", "Kolkata", 1600],
  ["Pune", "Hyderabad", 700],
];

export default function AllocationPanel() {
  const [donorId, setDonorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState(null);

  const activate = async () => {
    if (!donorId.trim()) { setMsg({ type: "error", text: "Enter donor ID." }); return; }
    setLoading(true); setResult(null); setMsg(null);
    try {
      const res = await api.activateDonor(donorId.trim());
      if (typeof res === "string") {
        setMsg({ type: "error", text: res });
      } else {
        setResult(res);
        setMsg({
          type: res.length > 0 ? "success" : "info",
          text: res.length > 0
            ? `✅ Allocation complete — ${res.length} patient(s) matched`
            : "Donor activated but no compatible patients found.",
        });
      }
    } catch {
      setMsg({ type: "error", text: "Request failed. Is the backend running?" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Quick Activate */}
      <div className="card">
        <div className="card-title">Quick Activate & Allocate</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Donor ID</label>
            <input
              value={donorId}
              onChange={(e) => setDonorId(e.target.value)}
              placeholder="Enter registered donor ID"
              onKeyDown={(e) => e.key === "Enter" && activate()}
            />
          </div>
          <button className="btn btn-danger" onClick={activate} disabled={loading}>
            {loading ? <span className="spinner" /> : "🔥"} Activate Donor
          </button>
        </div>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {result && result.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="section-label">Allocated Patients</div>
            <div className="result-grid">
              {result.map((r, i) => (
                <div className="result-card" key={i}>
                  <h3>{r.name}</h3>
                  <div className="rc-id">Patient ID: {r.patientId}</div>
                  <div className="rc-row">
                    <span>Waiting Time</span>
                    <span>{r["waiting time"]} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scoring Formula */}
      <div className="two-col">
        <div className="card">
          <div className="card-title">Scoring Algorithm</div>
          <div style={{
            background: "var(--surface2)", borderRadius: 10, padding: "16px 20px",
            fontFamily: "var(--mono)", fontSize: 13, marginBottom: 16,
            border: "1px solid var(--border)", lineHeight: 2.2,
            color: "var(--accent)"
          }}>
            score = (waitingTime × 3)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (organTime × 5)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;− (distance × 0.6)
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.8 }}>
            <div style={{ marginBottom: 6 }}><span style={{ color: "var(--text)" }}>waitingTime × 3</span> — urgency of patient</div>
            <div style={{ marginBottom: 6 }}><span style={{ color: "var(--text)" }}>organTime × 5</span> — organ viability window</div>
            <div><span style={{ color: "var(--text)" }}>distance × 0.6</span> — transport cost penalty</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Organ Viability Times</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(ORGAN_TIMES).map(([organ, time]) => (
              <div key={organ} style={{
                background: "var(--surface2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "10px 14px", minWidth: 100,
              }}>
                <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: 1 }}>{organ}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: time <= 8 ? "var(--danger)" : time <= 18 ? "var(--warn)" : "var(--accent)", marginTop: 4 }}>
                  {time}h
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compatibility Filters */}
      <div className="card">
        <div className="card-title">Compatibility Filters</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { label: "Blood Group Match", icon: "🩸", desc: "Patient and donor must have identical blood groups." },
            { label: "Tissue Type Match", icon: "🧬", desc: "Tissue type must match exactly between donor and recipient." },
            { label: "Organ Size ≤ 2", icon: "📐", desc: "Organ size difference must be within 2 units (1–10 scale)." },
          ].map((f) => (
            <div key={f.label} style={{
              background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: 10, padding: 18,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{f.label}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transport Graph */}
      <div className="card">
        <div className="card-title">Transport Network (Dijkstra Graph)</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div className="section-label" style={{ marginBottom: 10 }}>City Nodes</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CITIES.map((c) => <span key={c} className="tag tag-city" style={{ fontSize: 12 }}>{c}</span>)}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Routes (km)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {EDGES.map(([a, b, d]) => (
                <div key={`${a}-${b}`} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                  {a} ↔ {b}: <span style={{ color: "var(--text)" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
