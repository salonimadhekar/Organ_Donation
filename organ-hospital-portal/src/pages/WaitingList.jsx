import { useState } from "react";
import { api } from "../api";

const ORGANS = ["heart","lungs","liver","kidney","pancreas","intestine"];
const ORGAN_TIME = { heart:6, lungs:6, liver:12, kidney:36, pancreas:18, intestine:8 };

export default function WaitingList({ hospital }) {
  const [organ, setOrgan] = useState("");
  const [patients, setPatients] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async (o) => {
    if (!o) return;
    setLoading(true); setPatients(null);
    try {
      const res = await api.getWaitingList(o);
      setPatients(Array.isArray(res) ? res : []);
    } catch { setPatients([]); }
    finally { setLoading(false); }
  };

  const handleOrgan = (o) => { setOrgan(o); fetch(o); };

  const maxPriority = patients ? Math.max(...patients.map(p => p.dynamicPriority), 1) : 1;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Waiting List</h1>
        <p>All patients sorted by dynamic priority score — updates every 60 seconds.</p>
      </div>

      {/* Organ selector */}
      <div className="card" style={{ marginBottom:16 }}>
        <div className="card-title">Select Organ</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {ORGANS.map(o => {
            const isCritical = ORGAN_TIME[o] <= 8;
            return (
              <button key={o}
                className="btn"
                style={{
                  padding:"10px 18px",
                  background: organ===o ? (isCritical?"var(--red)":"var(--teal)") : "var(--bg)",
                  color: organ===o ? "#fff" : isCritical ? "var(--red)" : "var(--text2)",
                  border: `1.5px solid ${isCritical?"var(--red-border)":"var(--border)"}`,
                  fontWeight: organ===o ? 700 : 500,
                }}
                onClick={() => handleOrgan(o)}
              >
                {o}
                <span style={{ marginLeft:6, fontSize:10, opacity:0.7 }}>{ORGAN_TIME[o]}h</span>
              </button>
            );
          })}
        </div>
      </div>

      {!organ && (
        <div className="empty">
          <div className="empty-icon">⏳</div>
          <h3>Select an organ above</h3>
          <p>View the priority-sorted waiting list for any organ</p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign:"center", padding:48 }}>
          <span className="spinner spinner-dark" style={{ width:28, height:28 }} />
        </div>
      )}

      {patients && patients.length === 0 && (
        <div className="empty">
          <div className="empty-icon">✅</div>
          <h3>No patients waiting</h3>
          <p>No patients currently need a {organ}</p>
        </div>
      )}

      {patients && patients.length > 0 && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div className="card-title" style={{ marginBottom:0 }}>
              {patients.length} patient{patients.length!==1?"s":""} waiting for <span style={{ color:"var(--teal)" }}>{organ}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--muted)" }}>
              <span className="pulse-dot" />
              Updates every 60s
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Patient</th>
                  <th>Hospital</th>
                  <th>Blood</th>
                  <th>Tissue</th>
                  <th>Size</th>
                  <th>Urgency</th>
                  <th>Priority Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={p.patientId} style={ i === 0 ? { background:"rgba(192,57,43,0.03)" } : {} }>
                    <td>
                      <div style={{
                        width:28, height:28, borderRadius:"50%",
                        background: i===0?"var(--red)":i===1?"var(--amber)":i===2?"var(--teal)":"var(--border)",
                        color: i<3?"#fff":"var(--muted)",
                        display:"grid", placeItems:"center",
                        fontFamily:"var(--mono)", fontSize:12, fontWeight:700
                      }}>
                        {i+1}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight:600 }}>{p.info?.name || "—"}</div>
                      <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--muted)" }}>{p.patientId}</div>
                    </td>
                    <td style={{ fontSize:12, color:"var(--text2)" }}>
                      {p.hospital?.hospitalName || "—"}
                      <div style={{ fontSize:11, color:"var(--muted)" }}>{p.hospital?.city}</div>
                    </td>
                    <td><span className="tag tag-blood">{p.bloodGroup}</span></td>
                    <td><span style={{ fontFamily:"var(--mono)", fontSize:12 }}>{p.tissue}</span></td>
                    <td style={{ fontFamily:"var(--mono)" }}>{p.organSize}</td>
                    <td>
                      <div style={{
                        display:"inline-flex", alignItems:"center", gap:4,
                        fontWeight:700, fontFamily:"var(--mono)",
                        color: p.urgency>=8?"var(--red)":p.urgency>=5?"var(--amber)":"var(--teal)"
                      }}>
                        {p.urgency}/10
                      </div>
                    </td>
                    <td>
                      <div className="priority-bar-wrap">
                        <div className="priority-bar" style={{ minWidth:80 }}>
                          <div
                            className={`priority-bar-fill ${p.dynamicPriority/maxPriority > 0.7?"high":p.dynamicPriority/maxPriority>0.4?"mid":""}`}
                            style={{ width:`${(p.dynamicPriority/maxPriority)*100}%` }}
                          />
                        </div>
                        <span className="priority-num">{Math.round(p.dynamicPriority)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`tag ${p.available!==false?"tag-waiting":"tag-allocated"}`}>
                        {p.available!==false?"Waiting":"Allocated"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop:14, fontSize:12, color:"var(--muted)", lineHeight:1.7 }}>
            <strong>Priority formula:</strong> (urgency × 5) + (days waiting × 2).
            Patients with the same urgency will be ranked higher as they wait longer.
          </div>
        </div>
      )}
    </div>
  );
}