import { useState } from "react";
import { api } from "../api";

const ORGANS = ["heart", "lungs", "liver", "kidney", "pancreas", "intestine"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const TISSUES = ["Type1", "Type2", "Type3", "Type4"];

const INIT = {
patientId: "",
bloodGroup: "",
tissue: "",
organSize: "",
waitingTime: "",
organsNeeded: [],
hospital: { hospitalId: "" },
info: { name: "", age: "", aadharNo: "", location: "" },
};

export default function PatientPanel() {
const [tab, setTab] = useState("add");
const [form, setForm] = useState(INIT);
const [msg, setMsg] = useState(null);
const [loading, setLoading] = useState(false);
const [searchOrgan, setSearchOrgan] = useState("");
const [searchResults, setSearchResults] = useState(null);
const [searching, setSearching] = useState(false);

const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
const setInfo = (k, v) =>
setForm((f) => ({ ...f, info: { ...f.info, [k]: v } }));

const toggleOrgan = (o) => {
setForm((f) => ({
...f,
organsNeeded: f.organsNeeded.includes(o)
? f.organsNeeded.filter((x) => x !== o)
: [...f.organsNeeded, o],
}));
};

const submit = async () => {
if (
!form.patientId ||
!form.bloodGroup ||
!form.tissue ||
!form.organSize ||
!form.hospital.hospitalId ||
!form.waitingTime
) {
setMsg({ type: "error", text: "Please fill all required fields." });
return;
}

```
if (form.organsNeeded.length === 0) {
  setMsg({ type: "error", text: "Select at least one organ needed." });
  return;
}

setLoading(true);
setMsg(null);

try {
  const payload = {
    ...form,
    organSize: parseInt(form.organSize),
    waitingTime: parseInt(form.waitingTime),
    info: {
      ...form.info,
      age: form.info.age ? parseInt(form.info.age) : 0, // ✅ fix
    },
  };

  const res = await api.addPatient(payload);
  setMsg({ type: "success", text: res });
  setForm(INIT);
} catch {
  setMsg({ type: "error", text: "Failed to add patient." });
} finally {
  setLoading(false);
}
```

};

const search = async () => {
if (!searchOrgan) return;
setSearching(true);
setSearchResults(null);
try {
const res = await api.getPatientsByOrgan(searchOrgan);
setSearchResults(res);
} catch {
setSearchResults([]);
} finally {
setSearching(false);
}
};

return ( <div>
<div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
{["add", "search"].map((t) => (
<button
key={t}
className={`btn ${tab === t ? "btn-primary" : "btn-ghost"}`}
onClick={() => {
setTab(t);
setMsg(null);
}}
>
{t === "add" ? "➕ Add Patient" : "🔍 Search by Organ"} </button>
))} </div>

```
  {tab === "add" && (
    <div className="card">
      <div className="card-title">Add Patient</div>

      <div style={{ marginBottom: 14 }}>
        <div className="section-label">Personal Info</div>
        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input
              value={form.info.name}
              onChange={(e) => setInfo("name", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Age</label>
            <input
              type="number"
              value={form.info.age}
              onChange={(e) => setInfo("age", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Aadhar No</label>
            <input
              value={form.info.aadharNo}
              onChange={(e) => setInfo("aadharNo", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Location</label>
            <input
              value={form.info.location}
              onChange={(e) => setInfo("location", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div className="section-label">Medical Info</div>
        <div className="form-grid">
          <div className="field">
            <label>Patient ID *</label>
            <input
              value={form.patientId}
              onChange={(e) => set("patientId", e.target.value)}
            />
          </div>

          {/* ✅ FIXED hospital */}
          <div className="field">
            <label>Hospital ID *</label>
            <input
              value={form.hospital.hospitalId}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  hospital: {
                    ...f.hospital,
                    hospitalId: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div className="field">
            <label>Blood Group *</label>
            <select
              value={form.bloodGroup}
              onChange={(e) => set("bloodGroup", e.target.value)}
            >
              <option value="">— Select —</option>
              {BLOOD_GROUPS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Tissue Type *</label>
            <select
              value={form.tissue}
              onChange={(e) => set("tissue", e.target.value)}
            >
              <option value="">— Select —</option>
              {TISSUES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Organ Size *</label>
            <input
              type="number"
              value={form.organSize}
              onChange={(e) => set("organSize", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Waiting Time *</label>
            <input
              type="number"
              value={form.waitingTime}
              onChange={(e) => set("waitingTime", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        {ORGANS.map((o) => (
          <button
            key={o}
            type="button"   // ✅ FIX
            onClick={() => toggleOrgan(o)}
          >
            {form.organsNeeded.includes(o) ? "✓ " : ""}
            {o}
          </button>
        ))}
      </div>

      <button type="button" onClick={submit} disabled={loading}>
        {loading ? "Loading..." : "Add Patient"}
      </button>

      {msg && <p>{msg.text}</p>}
    </div>
  )}
</div>
```

);
}
