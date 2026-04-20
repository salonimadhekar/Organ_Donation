import { useState } from "react";
import { api } from "../api";

const ORGANS = ["heart", "lungs", "liver", "kidney", "pancreas", "intestine"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const TISSUES = ["Type1", "Type2", "Type3", "Type4"];

const INIT = {
  donorId: "",
  bloodGroup: "",
  tissue: "",
  organSize: "",
  organsDonated: [],
  hospital: { hospitalId: "" },
  info: { name: "", age: "", aadharNo: "", location: "" },
};

export default function DonorPanel() {
  const [form, setForm] = useState(INIT);
  const [organInput, setOrganInput] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activateId, setActivateId] = useState("");
  const [activating, setActivating] = useState(false);
  const [allocResult, setAllocResult] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setInfo = (k, v) => setForm((f) => ({ ...f, info: { ...f.info, [k]: v } }));

  const addOrgan = (o) => {
    if (!o || form.organsDonated.includes(o)) return;
    setForm((f) => ({ ...f, organsDonated: [...f.organsDonated, o] }));
    setOrganInput("");
  };

  const removeOrgan = (o) =>
    setForm((f) => ({ ...f, organsDonated: f.organsDonated.filter((x) => x !== o) }));

  const submit = async () => {
    if (!form.donorId || !form.bloodGroup || !form.tissue || !form.organSize || !form.hospital.hospitalId) {
      setMsg({ type: "error", text: "Please fill all required fields." });
      return;
    }
    if (form.organsDonated.length === 0) {
      setMsg({ type: "error", text: "Add at least one organ to donate." });
      return;
    }
    setLoading(true); setMsg(null);
    try {
      const payload = {
        ...form,
        organSize: parseInt(form.organSize),
        info: { ...form.info, age: parseInt(form.info.age) },
      };
      const res = await api.addDonor(payload);
      setMsg({ type: "success", text: res });
      setForm(INIT);
    } catch {
      setMsg({ type: "error", text: "Failed to add donor." });
    } finally {
      setLoading(false);
    }
  };

  const activate = async () => {
    if (!activateId.trim()) { setMsg({ type: "error", text: "Enter a Donor ID to activate." }); return; }
    setActivating(true); setAllocResult(null); setMsg(null);
    try {
      const res = await api.activateDonor(activateId.trim());
      if (typeof res === "string") {
        setMsg({ type: "error", text: res });
      } else if (Array.isArray(res)) {
        setAllocResult(res);
        setMsg({ type: "success", text: `Donor activated! ${res.length} allocation(s) made.` });
      }
    } catch {
      setMsg({ type: "error", text: "Activation failed. Check donor ID." });
    } finally {
      setActivating(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">Add Donor</div>
        <div style={{ marginBottom: 14 }}>
          <div className="section-label">Personal Info</div>
          <div className="form-grid">
            <div className="field"><label>Full Name</label>
              <input value={form.info.name} onChange={(e) => setInfo("name", e.target.value)} placeholder="Donor name" />
            </div>
            <div className="field"><label>Age</label>
              <input type="number" value={form.info.age} onChange={(e) => setInfo("age", e.target.value)} placeholder="Age" />
            </div>
            <div className="field"><label>Aadhar No</label>
              <input value={form.info.aadharNo} onChange={(e) => setInfo("aadharNo", e.target.value)} placeholder="XXXX XXXX XXXX" />
            </div>
            <div className="field"><label>Location</label>
              <input value={form.info.location} onChange={(e) => setInfo("location", e.target.value)} placeholder="City / Area" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="section-label">Medical Info</div>
          <div className="form-grid">
            <div className="field"><label>Donor ID *</label>
              <input value={form.donorId} onChange={(e) => set("donorId", e.target.value)} placeholder="e.g. D001" />
            </div>
            <div className="field"><label>Hospital ID *</label>
              <input value={form.hospital.hospitalId} onChange={(e) => set("hospital", { hospitalId: e.target.value })} placeholder="e.g. H001" />
            </div>
            <div className="field"><label>Blood Group *</label>
              <select value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>
                <option value="">— Select —</option>
                {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="field"><label>Tissue Type *</label>
              <select value={form.tissue} onChange={(e) => set("tissue", e.target.value)}>
                <option value="">— Select —</option>
                {TISSUES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field"><label>Organ Size (1-10) *</label>
              <input type="number" min="1" max="10" value={form.organSize} onChange={(e) => set("organSize", e.target.value)} placeholder="5" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Organs to Donate</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {ORGANS.map((o) => (
              <button
                key={o}
                className="btn btn-ghost"
                style={{
                  padding: "6px 14px", fontSize: 12,
                  ...(form.organsDonated.includes(o) ? { borderColor: "var(--accent2)", color: "var(--accent2)", background: "rgba(0,153,255,0.1)" } : {})
                }}
                onClick={() => form.organsDonated.includes(o) ? removeOrgan(o) : addOrgan(o)}
              >
                {form.organsDonated.includes(o) ? "✓ " : ""}{o}
              </button>
            ))}
          </div>
          {form.organsDonated.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {form.organsDonated.map((o) => (
                <span key={o} className="organ-chip">
                  {o} <button onClick={() => removeOrgan(o)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : "➕"} Add Donor
        </button>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      </div>

      <div className="card">
        <div className="card-title">Activate Donor & Allocate Organs</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 4 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Donor ID</label>
            <input value={activateId} onChange={(e) => setActivateId(e.target.value)} placeholder="Enter donor ID to activate" />
          </div>
          <button className="btn btn-danger" onClick={activate} disabled={activating} style={{ marginBottom: 0 }}>
            {activating ? <span className="spinner" /> : "🔥"} Activate
          </button>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>
          Activates donor → runs compatibility check → scores patients → allocates organs
        </div>
        {msg && activateId && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {allocResult && allocResult.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div className="section-label">Allocation Results</div>
            <div className="result-grid">
              {allocResult.map((r, i) => (
                <div className="result-card" key={i}>
                  <h3>{r.name}</h3>
                  <div className="rc-id">ID: {r.patientId}</div>
                  <div className="rc-row">
                    <span>Waiting Time</span>
                    <span>{r["waiting time"]} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {allocResult && allocResult.length === 0 && (
          <div className="alert alert-info" style={{ marginTop: 12 }}>No compatible patients found for this donor's organs.</div>
        )}
      </div>
    </div>
  );
}