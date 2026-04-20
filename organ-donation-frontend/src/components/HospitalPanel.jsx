import { useState } from "react";
import { api } from "../api";

const CITIES = [
  "Mumbai", "Pune", "Ahmedabad", "Delhi", "Kolkata",
  "Hyderabad", "Bangalore", "Chennai",
];

const INIT = { hospitalId: "", hospitalName: "", city: "" };

export default function HospitalPanel() {
  const [form, setForm] = useState(INIT);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState([]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.hospitalId || !form.hospitalName || !form.city) {
      setMsg({ type: "error", text: "All fields are required." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.registerHospital(form);
      setMsg({ type: "success", text: res });
      setRegistered((p) => [...p, form]);
      setForm(INIT);
    } catch {
      setMsg({ type: "error", text: "Failed to register hospital." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">Register Hospital</div>
          <div className="form-grid">
            <div className="field">
              <label>Hospital ID</label>
              <input
                value={form.hospitalId}
                onChange={(e) => set("hospitalId", e.target.value)}
                placeholder="e.g. H001"
              />
            </div>
            <div className="field">
              <label>Hospital Name</label>
              <input
                value={form.hospitalName}
                onChange={(e) => set("hospitalName", e.target.value)}
                placeholder="e.g. Apollo Mumbai"
              />
            </div>
            <div className="field">
              <label>City</label>
              <select value={form.city} onChange={(e) => set("city", e.target.value)}>
                <option value="">— Select City —</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? <span className="spinner" /> : "🏥"} Register Hospital
          </button>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        </div>

        <div className="card">
          <div className="card-title">City Network</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CITIES.map((c) => (
              <span key={c} className="tag tag-city" style={{ fontSize: 13, padding: "6px 14px" }}>
                {c}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)", lineHeight: 1.7 }}>
            Only cities in the organ transport graph are supported.<br />
            Dijkstra's algorithm routes organs between these nodes.
          </div>
        </div>
      </div>

      {registered.length > 0 && (
        <div className="card">
          <div className="card-title">Registered This Session</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {registered.map((h) => (
                  <tr key={h.hospitalId}>
                    <td><span style={{ fontFamily: "var(--mono)" }}>{h.hospitalId}</span></td>
                    <td>{h.hospitalName}</td>
                    <td><span className="tag tag-city">{h.city}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
