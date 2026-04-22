import { useState } from "react";
import { api } from "../api";

const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];
const TISSUES = ["Type1","Type2","Type3","Type4"];
const ORGANS = ["heart","lungs","liver","kidney","pancreas","intestine"];

const INIT = {
  patientId:"", bloodGroup:"", tissue:"", organSize:"", urgency:"5",
  organsNeeded:[], hospital:{ hospitalId:"" },
  info:{ name:"", age:"", aadharNo:"", location:"" },
};

export default function MyPatients({ hospital }) {
  const [tab, setTab] = useState("add");
  const [form, setForm] = useState({ ...INIT, hospital:{ hospitalId: hospital.hospitalId } });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Urgency update modal
  const [urgencyModal, setUrgencyModal] = useState(null); // { patientId, name, current }
  const [newUrgency, setNewUrgency] = useState(5);
  const [updatingUrgency, setUpdatingUrgency] = useState(false);
  const [urgencyMsg, setUrgencyMsg] = useState(null);

  // Search
  const [searchId, setSearchId] = useState("");
  const [searchOrgan, setSearchOrgan] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setInfo = (k, v) => setForm(f => ({ ...f, info: { ...f.info, [k]: v } }));
  const toggleOrgan = (o) => setForm(f => ({
    ...f,
    organsNeeded: f.organsNeeded.includes(o)
      ? f.organsNeeded.filter(x => x !== o)
      : [...f.organsNeeded, o]
  }));

  const submit = async () => {
    if (!form.patientId || !form.bloodGroup || !form.tissue || !form.organSize || form.organsNeeded.length === 0) {
      setMsg({ type:"error", text:"Fill all required fields and select at least one organ." });
      return;
    }
    setLoading(true); setMsg(null);
    try {
      const payload = {
        ...form,
        organSize: parseInt(form.organSize),
        urgency: parseInt(form.urgency),
        info: { ...form.info, age: parseInt(form.info.age) },
      };
      const res = await api.addPatient(payload);
      setMsg({ type:"success", text: typeof res === "string" ? res : "Patient added successfully!" });
      setForm({ ...INIT, hospital:{ hospitalId: hospital.hospitalId } });
    } catch {
      setMsg({ type:"error", text:"Failed. Is the backend running?" });
    } finally { setLoading(false); }
  };

  const searchPatients = async () => {
    if (!searchOrgan) return;
    setSearching(true); setSearchResults(null);
    try {
      const res = await api.getPatientsByOrgan(searchOrgan);
      setSearchResults(Array.isArray(res) ? res : []);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  const openUrgencyModal = (p) => {
    setNewUrgency(p.urgency || 5);
    setUrgencyMsg(null);
    setUrgencyModal(p);
  };

  const submitUrgency = async () => {
    setUpdatingUrgency(true); setUrgencyMsg(null);
    try {
      const res = await api.updateUrgency(urgencyModal.patientId, newUrgency);
      setUrgencyMsg({ type:"success", text: typeof res === "string" ? res : "Urgency updated!" });
      setTimeout(() => { setUrgencyModal(null); searchPatients(); }, 1200);
    } catch {
      setUrgencyMsg({ type:"error", text:"Update failed." });
    } finally { setUpdatingUrgency(false); }
  };

  const urgencyLabel = (u) => u >= 8 ? "CRITICAL" : u >= 5 ? "MODERATE" : "LOW";
  const urgencyClass = (u) => u >= 8 ? "high" : u >= 5 ? "mid" : "low";

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Patients</h1>
        <p>Register new patients and manage existing patient urgency levels.</p>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[["add","➕ Add Patient"],["search","🔍 Find Patients"]].map(([t,l]) => (
          <button key={t} className={`btn ${tab===t?"btn-primary":"btn-ghost"}`} onClick={() => { setTab(t); setMsg(null); }}>{l}</button>
        ))}
      </div>

      {tab === "add" && (
        <div className="card">
          <div className="card-title">Register New Patient</div>

          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:10 }}>Personal Info</div>
            <div className="form-grid">
              <div className="field"><label>Full Name *</label><input value={form.info.name} onChange={e=>setInfo("name",e.target.value)} placeholder="Patient name" /></div>
              <div className="field"><label>Age</label><input type="number" value={form.info.age} onChange={e=>setInfo("age",e.target.value)} placeholder="Age" /></div>
              <div className="field"><label>Aadhar No</label><input value={form.info.aadharNo} onChange={e=>setInfo("aadharNo",e.target.value)} placeholder="XXXX XXXX XXXX" /></div>
              <div className="field"><label>Location</label><input value={form.info.location} onChange={e=>setInfo("location",e.target.value)} placeholder="City / Area" /></div>
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:10 }}>Medical Info</div>
            <div className="form-grid">
              <div className="field"><label>Patient ID *</label><input value={form.patientId} onChange={e=>set("patientId",e.target.value)} placeholder="e.g. P001" /></div>
              <div className="field">
                <label>Hospital</label>
                <input value={hospital.hospitalName} disabled style={{ opacity:0.6 }} />
              </div>
              <div className="field"><label>Blood Group *</label>
                <select value={form.bloodGroup} onChange={e=>set("bloodGroup",e.target.value)}>
                  <option value="">— Select —</option>
                  {BLOOD_GROUPS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="field"><label>Tissue Type *</label>
                <select value={form.tissue} onChange={e=>set("tissue",e.target.value)}>
                  <option value="">— Select —</option>
                  {TISSUES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field"><label>Organ Size (1–10) *</label><input type="number" min="1" max="10" value={form.organSize} onChange={e=>set("organSize",e.target.value)} placeholder="5" /></div>
            </div>
          </div>

          {/* Urgency Slider */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:10 }}>Initial Urgency Score</div>
            <div className="urgency-display">
              <div className={`urgency-num ${urgencyClass(parseInt(form.urgency))}`}>{form.urgency}</div>
              <div style={{ flex:1 }}>
                <input type="range" min="1" max="10" value={form.urgency} onChange={e=>set("urgency",e.target.value)} style={{ width:"100%" }} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--muted)", marginTop:4 }}>
                  <span>Low</span><span>Moderate</span><span>Critical</span>
                </div>
              </div>
              <div style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, background: parseInt(form.urgency)>=8 ? "var(--red-bg)" : parseInt(form.urgency)>=5 ? "var(--amber-bg)" : "var(--teal-bg)", color: parseInt(form.urgency)>=8 ? "var(--red)" : parseInt(form.urgency)>=5 ? "var(--amber)" : "var(--teal)", border:"1px solid", borderColor: parseInt(form.urgency)>=8 ? "var(--red-border)" : parseInt(form.urgency)>=5 ? "var(--amber-border)" : "var(--teal-border)" }}>
                {urgencyLabel(parseInt(form.urgency))}
              </div>
            </div>
          </div>

          {/* Organs */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:10 }}>Organs Needed *</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ORGANS.map(o => (
                <button key={o} className="btn btn-ghost btn-sm"
                  style={form.organsNeeded.includes(o) ? { borderColor:"var(--red)", color:"var(--red)", background:"var(--red-bg)" } : {}}
                  onClick={() => toggleOrgan(o)}>
                  {form.organsNeeded.includes(o) ? "✓ " : ""}{o}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? <span className="spinner" /> : "🩺"} Register Patient
          </button>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        </div>
      )}

      {tab === "search" && (
        <div className="card">
          <div className="card-title">Find & Update Patients</div>
          <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"flex-end" }}>
            <div className="field" style={{ flex:1 }}>
              <label>Search by Organ Needed</label>
              <select value={searchOrgan} onChange={e=>setSearchOrgan(e.target.value)}>
                <option value="">— Select Organ —</option>
                {ORGANS.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={searchPatients} disabled={searching||!searchOrgan}>
              {searching ? <span className="spinner" /> : "🔍"} Search
            </button>
          </div>

          {searchResults === null && (
            <div className="empty"><div className="empty-icon">🩺</div><p>Select an organ and search</p></div>
          )}

          {searchResults && searchResults.length === 0 && (
            <div className="empty"><div className="empty-icon">✅</div><h3>No patients found</h3><p>No patients waiting for {searchOrgan}</p></div>
          )}

          {searchResults && searchResults.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>ID</th><th>Name</th><th>Blood</th><th>Urgency</th><th>Priority Score</th><th>Status</th><th>Action</th>
                </tr></thead>
                <tbody>
                  {searchResults.map(p => (
                    <tr key={p.patientId}>
                      <td><span style={{ fontFamily:"var(--mono)", fontSize:12 }}>{p.patientId}</span></td>
                      <td style={{ fontWeight:600 }}>{p.info?.name || "—"}</td>
                      <td><span className="tag tag-blood">{p.bloodGroup}</span></td>
                      <td>
                        <span style={{ fontFamily:"var(--mono)", fontWeight:700, color: p.urgency>=8?"var(--red)":p.urgency>=5?"var(--amber)":"var(--teal)" }}>
                          {p.urgency}/10
                        </span>
                      </td>
                      <td>
                        <div className="priority-bar-wrap">
                          <div className="priority-bar">
                            <div className="priority-bar-fill" style={{ width:`${Math.min(100,(p.dynamicPriority/100)*100)}%` }} />
                          </div>
                          <span className="priority-num">{Math.round(p.dynamicPriority)}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`tag ${p.available!==false?"tag-waiting":"tag-allocated"}`}>
                          {p.available!==false?"Waiting":"Allocated"}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-amber btn-sm" onClick={() => openUrgencyModal(p)}>
                          ⚡ Update Urgency
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Urgency Update Modal */}
      {urgencyModal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setUrgencyModal(null)}>
          <div className="modal">
            <div className="modal-head">
              <div>
                <div className="modal-title">Update Patient Urgency</div>
                <div className="modal-sub">{urgencyModal.info?.name || urgencyModal.patientId} · {urgencyModal.patientId}</div>
              </div>
              <button className="modal-close" onClick={() => setUrgencyModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ background:"var(--amber-bg)", border:"1px solid var(--amber-border)", borderRadius:"var(--radius-sm)", padding:"12px 16px", marginBottom:20, fontSize:13, color:"var(--amber)" }}>
                ⚠️ Updating urgency will immediately recalculate this patient's priority score and affect their position in the allocation queue.
              </div>

              <div style={{ textAlign:"center", marginBottom:20 }}>
                <div className={`urgency-num ${urgencyClass(newUrgency)}`} style={{ fontSize:64 }}>{newUrgency}</div>
                <div style={{ fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color: newUrgency>=8?"var(--red)":newUrgency>=5?"var(--amber)":"var(--teal)" }}>
                  {urgencyLabel(newUrgency)}
                </div>
              </div>

              <input type="range" min="1" max="10" value={newUrgency} onChange={e=>setNewUrgency(parseInt(e.target.value))} style={{ width:"100%", marginBottom:8 }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--muted)" }}>
                <span>1 — Low</span><span>5 — Moderate</span><span>10 — Critical</span>
              </div>

              <div style={{ marginTop:16, padding:"12px 16px", background:"var(--bg)", borderRadius:"var(--radius-sm)", fontSize:12, color:"var(--muted)", fontFamily:"var(--mono)" }}>
                New Priority ≈ ({newUrgency} × 5) + (days waiting × 2) = <strong style={{ color:"var(--text)" }}>{newUrgency*5}+days</strong>
              </div>

              {urgencyMsg && <div className={`alert alert-${urgencyMsg.type}`}>{urgencyMsg.text}</div>}

              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setUrgencyModal(null)}>Cancel</button>
                <button className="btn btn-amber" onClick={submitUrgency} disabled={updatingUrgency}>
                  {updatingUrgency ? <span className="spinner" /> : "⚡"} Update Urgency
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}