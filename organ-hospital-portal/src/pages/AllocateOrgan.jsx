import { useState } from "react";
import { api } from "../api";

export default function AllocateOrgan({ hospital }) {
  const [donorId, setDonorId]         = useState("");
  const [activating, setActivating]   = useState(false);
  const [candidates, setCandidates]   = useState(null); // array from backend
  const [activateMsg, setActivateMsg] = useState(null);
  const [currentDonorId, setCurrentDonorId] = useState(null);

  // Grouped by organ
  const [grouped, setGrouped]         = useState({});

  // Selection per organ
  const [selected, setSelected]       = useState({}); // { organ: patientId }

  // Confirm state
  const [confirming, setConfirming]   = useState(false);
  const [confirmResults, setConfirmResults] = useState([]);
  const [confirmMsg, setConfirmMsg]   = useState(null);
  const [confirmed, setConfirmed]     = useState(false);

  const activate = async () => {
    if (!donorId.trim()) { setActivateMsg({ type:"error", text:"Enter a Donor ID." }); return; }
    setActivating(true); setCandidates(null); setActivateMsg(null);
    setSelected({}); setGrouped({}); setConfirmResults([]); setConfirmed(false);

    try {
      const res = await api.activateDonor(donorId.trim());

      if (typeof res === "string") {
        setActivateMsg({ type:"error", text: res });
      } else if (Array.isArray(res)) {
        if (res.length === 0) {
          setActivateMsg({ type:"info", text:"Donor activated, but no compatible patients found for any organ." });
          setCandidates([]);
        } else {
          setCandidates(res);
          setCurrentDonorId(donorId.trim());

          // Group by organ
          const g = {};
          res.forEach(r => {
            if (!g[r.organ]) g[r.organ] = [];
            g[r.organ].push(r);
          });
          setGrouped(g);
          setActivateMsg({ type:"success", text:`Donor activated! Found candidates for ${Object.keys(g).length} organ(s). Select one patient per organ below.` });
        }
      }
    } catch {
      setActivateMsg({ type:"error", text:"Request failed. Ensure backend is running." });
    } finally { setActivating(false); }
  };

  const selectCandidate = (organ, patientId) => {
    setSelected(s => ({ ...s, [organ]: patientId }));
  };

  const confirmAll = async () => {
    const entries = Object.entries(selected);
    if (entries.length === 0) {
      setConfirmMsg({ type:"error", text:"Select at least one patient to confirm." });
      return;
    }

    setConfirming(true); setConfirmMsg(null);
    const results = [];

    for (const [organ, patientId] of entries) {
      try {
        const res = await api.acceptAllocation(patientId, currentDonorId);
        results.push({ organ, patientId, success: true, msg: typeof res === "string" ? res : "Confirmed" });
      } catch {
        results.push({ organ, patientId, success: false, msg: "Failed" });
      }
    }

    setConfirmResults(results);
    setConfirmed(true);
    setConfirming(false);
    setConfirmMsg({
      type: results.every(r=>r.success) ? "success" : "warn",
      text: `${results.filter(r=>r.success).length}/${results.length} allocation(s) confirmed.`
    });
  };

  const reset = () => {
    setDonorId(""); setCandidates(null); setActivateMsg(null);
    setSelected({}); setGrouped({}); setConfirmResults([]); setConfirmed(false);
    setCurrentDonorId(null);
  };

  const rankLabel = (i) => ["#1 Best Match","#2 Runner-up","#3 Third"][i] || `#${i+1}`;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Allocate Organ</h1>
        <p>Activate a donor to run the matching algorithm, then confirm the allocation.</p>
      </div>

      {/* Step indicator */}
      <div className="flow-steps" style={{ marginBottom:24 }}>
        {[
          { label:"Enter Donor ID", done: !!currentDonorId },
          { label:"Activate Donor", done: candidates !== null },
          { label:"Select Patients", done: Object.keys(selected).length > 0 },
          { label:"Confirm Allocation", done: confirmed },
        ].map((s, i) => (
          <div key={i} className={`flow-step ${s.done?"done":""}`}>
            <div className="flow-step-num">Step {i+1}</div>
            <div className="flow-step-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activate */}
      <div className="card" style={{ marginBottom:16 }}>
        <div className="card-title">Step 1 — Activate Donor</div>
        <div style={{ display:"flex", gap:12, alignItems:"flex-end" }}>
          <div className="field" style={{ flex:1 }}>
            <label>Donor ID</label>
            <input
              value={donorId}
              onChange={e=>setDonorId(e.target.value)}
              placeholder="Enter registered donor ID (e.g. D001)"
              onKeyDown={e=>e.key==="Enter"&&activate()}
            />
          </div>
          <button className="btn btn-danger" onClick={activate} disabled={activating || confirmed}>
            {activating ? <span className="spinner" /> : "🔥"} Activate & Run Algorithm
          </button>
          {confirmed && (
            <button className="btn btn-ghost" onClick={reset}>↺ New Allocation</button>
          )}
        </div>
        <div style={{ fontSize:12, color:"var(--muted)", marginTop:8 }}>
          This runs compatibility filter → Dijkstra routing → priority scoring → returns top 3 candidates per organ.
        </div>
        {activateMsg && <div className={`alert alert-${activateMsg.type}`}>{activateMsg.text}</div>}
      </div>

      {/* Candidates by Organ */}
      {grouped && Object.keys(grouped).length > 0 && !confirmed && (
        <div>
          {Object.entries(grouped).map(([organ, list]) => (
            <div key={organ} className="card" style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div>
                  <div className="card-title" style={{ marginBottom:4 }}>
                    Step 2 — Select Patient for <span style={{ color:"var(--teal)" }}>{organ}</span>
                  </div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>
                    {list.length} compatible candidate{list.length!==1?"s":""} — ranked by priority score
                  </div>
                </div>
                {selected[organ] && (
                  <div style={{ fontSize:12, color:"var(--teal)", fontWeight:600 }}>
                    ✓ Selected: {list.find(p=>p.patientId===selected[organ])?.name}
                  </div>
                )}
              </div>

              <div className="candidate-list">
                {list.map((c, i) => (
                  <div
                    key={c.patientId}
                    className={`candidate-card ${selected[organ]===c.patientId?"selected":""}`}
                    onClick={() => selectCandidate(organ, c.patientId)}
                  >
                    <div className={`candidate-rank ${i===0?"rank-1":""}`}>{rankLabel(i)}</div>
                    <div className="candidate-card-top">
                      <div>
                        <div className="candidate-name">{c.name}</div>
                        <div className="candidate-id">{c.patientId}</div>
                      </div>
                      <div className="candidate-score">
                        <div className="candidate-score-num">{Math.round(c.priority)}</div>
                        <div className="candidate-score-label">Priority</div>
                      </div>
                    </div>

                    <div className="candidate-meta">
                      <span className="tag tag-organ">{organ}</span>
                      <span style={{ fontSize:12, color:"var(--muted)", fontFamily:"var(--mono)" }}>
                        📍 {c.distance === 0 ? "Same city" : `${c.distance} km`}
                      </span>
                      {selected[organ]===c.patientId && (
                        <span style={{
                          marginLeft:"auto", fontSize:11, fontWeight:700,
                          color:"var(--teal)", background:"var(--teal-bg)",
                          border:"1px solid var(--teal-border)", borderRadius:20,
                          padding:"3px 10px"
                        }}>
                          ✓ Selected
                        </span>
                      )}
                    </div>

                    {/* Score breakdown */}
                    <div style={{
                      marginTop:12, padding:"10px 12px",
                      background:"var(--bg)", borderRadius:"var(--radius-sm)",
                      fontSize:11, fontFamily:"var(--mono)", color:"var(--muted)",
                      display:"flex", gap:16
                    }}>
                      <span>Priority: <strong style={{color:"var(--text)"}}>{Math.round(c.priority)}</strong></span>
                      <span>Distance penalty: <strong style={{color:"var(--red)"}}>−{(c.distance*0.5).toFixed(0)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Confirm Button */}
          <div className="card">
            <div className="card-title">Step 3 — Confirm Allocation</div>
            <div style={{ marginBottom:16 }}>
              {Object.keys(grouped).map(organ => (
                <div key={organ} style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"10px 0", borderBottom:"1px solid var(--border)"
                }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span className="tag tag-organ">{organ}</span>
                    <span style={{ fontSize:13 }}>
                      {selected[organ]
                        ? <><strong>{grouped[organ].find(p=>p.patientId===selected[organ])?.name}</strong> <span style={{color:"var(--muted)",fontFamily:"var(--mono)",fontSize:11}}>({selected[organ]})</span></>
                        : <span style={{ color:"var(--red)", fontSize:12 }}>⚠ Not selected</span>
                      }
                    </span>
                  </div>
                  {selected[organ]
                    ? <span style={{ fontSize:11, color:"var(--teal)", fontWeight:600 }}>✓ Ready</span>
                    : <span style={{ fontSize:11, color:"var(--muted)" }}>Pending</span>
                  }
                </div>
              ))}
            </div>

            {confirmMsg && <div className={`alert alert-${confirmMsg.type}`}>{confirmMsg.text}</div>}

            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button
                className="btn btn-primary"
                onClick={confirmAll}
                disabled={confirming || Object.keys(selected).length===0}
              >
                {confirming ? <span className="spinner" /> : "✅"} Confirm Selected Allocations
              </button>
              <button className="btn btn-ghost" onClick={reset}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmed State */}
      {confirmed && confirmResults.length > 0 && (
        <div className="card">
          <div style={{ textAlign:"center", padding:"24px 0 16px" }}>
            <div style={{ fontSize:56, marginBottom:12 }}>✅</div>
            <div style={{ fontFamily:"var(--serif)", fontSize:28, marginBottom:6 }}>Allocation Complete</div>
            <div style={{ color:"var(--muted)", fontSize:14 }}>The following patients have been matched with donor {currentDonorId}</div>
          </div>

          <div style={{ display:"grid", gap:12, marginTop:20 }}>
            {confirmResults.map((r, i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"14px 18px",
                background: r.success ? "var(--teal-bg)" : "var(--red-bg)",
                border:`1px solid ${r.success?"var(--teal-border)":"var(--red-border)"}`,
                borderRadius:"var(--radius-sm)"
              }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span className="tag tag-organ">{r.organ}</span>
                  <span style={{ fontWeight:600 }}>Patient {r.patientId}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color: r.success?"var(--teal)":"var(--red)" }}>
                  {r.success ? "✓ "+r.msg : "✗ "+r.msg}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:20, textAlign:"center" }}>
            <button className="btn btn-primary" onClick={reset}>↺ New Allocation</button>
          </div>
        </div>
      )}

      {/* Empty / no candidates */}
      {candidates && candidates.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🔬</div>
          <h3>No compatible patients found</h3>
          <p>No patients matched this donor's blood group, tissue type, and organ size requirements.</p>
        </div>
      )}
    </div>
  );
}