import { useState } from "react";
import { api } from "../api";

const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];
const TISSUES      = ["Type1","Type2","Type3","Type4"];
const ORGANS       = ["heart","lungs","liver","kidney","pancreas","intestine"];

const INIT = {
  donorId:"", bloodGroup:"", tissue:"", organSize:"",
  organsDonated:[], hospital:{ hospitalId:"" },
  info:{ name:"", age:"", aadharNo:"", location:"" },
};

export default function AddDonor({ hospital }) {
  const [form, setForm] = useState({ ...INIT, hospital:{ hospitalId: hospital.hospitalId } });
  const [msg, setMsg]   = useState(null);
  const [loading, setLoading] = useState(false);

  const set     = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const setInfo = (k,v) => setForm(f => ({ ...f, info: { ...f.info, [k]: v } }));
  const toggle  = (o)   => setForm(f => ({
    ...f,
    organsDonated: f.organsDonated.includes(o)
      ? f.organsDonated.filter(x=>x!==o)
      : [...f.organsDonated, o]
  }));

  const submit = async () => {
    if (!form.donorId||!form.bloodGroup||!form.tissue||!form.organSize||form.organsDonated.length===0) {
      setMsg({ type:"error", text:"Fill all required fields and select at least one organ." });
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
      setMsg({ type:"success", text: typeof res==="string" ? res : "Donor registered!" });
      setForm({ ...INIT, hospital:{ hospitalId: hospital.hospitalId } });
    } catch {
      setMsg({ type:"error", text:"Failed. Is the backend running?" });
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Register Donor</h1>
        <p>Add a new organ donor to the network. Consent is auto-approved for testing.</p>
      </div>

      <div className="card">
        <div className="card-title">Donor Information</div>

        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:10 }}>Personal Info</div>
          <div className="form-grid">
            <div className="field"><label>Full Name</label><input value={form.info.name} onChange={e=>setInfo("name",e.target.value)} placeholder="Donor name" /></div>
            <div className="field"><label>Age</label><input type="number" value={form.info.age} onChange={e=>setInfo("age",e.target.value)} placeholder="Age" /></div>
            <div className="field"><label>Aadhar No</label><input value={form.info.aadharNo} onChange={e=>setInfo("aadharNo",e.target.value)} placeholder="XXXX XXXX XXXX" /></div>
            <div className="field"><label>Location</label><input value={form.info.location} onChange={e=>setInfo("location",e.target.value)} placeholder="City / Area" /></div>
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:10 }}>Medical Info</div>
          <div className="form-grid">
            <div className="field"><label>Donor ID *</label><input value={form.donorId} onChange={e=>set("donorId",e.target.value)} placeholder="e.g. D001" /></div>
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
            <div className="field"><label>Organ Size (1–10) *</label>
              <input type="number" min="1" max="10" value={form.organSize} onChange={e=>set("organSize",e.target.value)} placeholder="5" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:10 }}>Organs to Donate *</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {ORGANS.map(o => (
              <button key={o} className="btn btn-ghost btn-sm"
                style={form.organsDonated.includes(o) ? { borderColor:"var(--teal)", color:"var(--teal)", background:"var(--teal-bg)", fontWeight:700 } : {}}
                onClick={() => toggle(o)}
              >
                {form.organsDonated.includes(o) ? "✓ " : ""}{o}
              </button>
            ))}
          </div>
          {form.organsDonated.length > 0 && (
            <div style={{ marginTop:10, fontSize:12, color:"var(--muted)" }}>
              Selected: {form.organsDonated.map(o=><span key={o} className="tag tag-organ" style={{marginRight:4}}>{o}</span>)}
            </div>
          )}
        </div>

        {/* Consent info */}
        <div style={{
          background:"var(--teal-bg)", border:"1px solid var(--teal-border)",
          borderRadius:"var(--radius-sm)", padding:"12px 16px", marginBottom:20,
          fontSize:12, color:"var(--teal)", lineHeight:1.6
        }}>
          ✓ <strong>Consent Status:</strong> Will be automatically set to MEDICAL_APPROVED<br/>
          ✓ <strong>Initial Status:</strong> PENDING (ready for activation)
        </div>

        <button className="btn btn-primary" onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : "❤️"} Register Donor
        </button>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      </div>

      {/* Usage note */}
      <div className="card" style={{ marginTop:16 }}>
        <div className="card-title">Next Step</div>
        <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.8 }}>
          After registering, go to <strong>Allocate Organ</strong> and enter this donor's ID to activate them
          and run the matching algorithm. The system will return the top 3 compatible patients per organ.
        </div>
      </div>
    </div>
  );
}
