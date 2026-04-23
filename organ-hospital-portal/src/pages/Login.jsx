import { useState } from "react";
import { api } from "../api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"

  // Login state
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  // Register state
  const [reg, setReg] = useState({ hospitalId:"", hospitalName:"", city:"", password:"", confirmPassword:"" });
  const [regError, setRegError]     = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);

  const setR = (k, v) => setReg(r => ({ ...r, [k]: v }));

  const switchMode = (m) => {
    setMode(m);
    setError(""); setRegError(""); setRegSuccess("");
  };

  // ── LOGIN ──
  const submit = async () => {
    if (!hospitalId || !password) { setError("Enter Hospital ID and password."); return; }
    setLoading(true); setError("");
    try {
      const res = await api.loginHospital(hospitalId.trim(), password);
      if (res && res.hospitalId) {
        onLogin(res);
      } else {
        setError(typeof res === "string" ? res : "Invalid credentials.");
      }
    } catch {
      setError("Server error. Is the backend running?");
    }
    setLoading(false);
  };

  // ── REGISTER ──
  const submitRegister = async () => {
    setRegError(""); setRegSuccess("");
    if (!reg.hospitalId || !reg.hospitalName || !reg.city || !reg.password) {
      setRegError("All fields are required."); return;
    }
    if (reg.password !== reg.confirmPassword) {
      setRegError("Passwords do not match."); return;
    }
    setRegLoading(true);
    try {
      const res = await api.registerHospital({
        hospitalId:   reg.hospitalId.trim(),
        hospitalName: reg.hospitalName.trim(),
        city:         reg.city.trim(),
        password:     reg.password,
      });
      if (typeof res === "string" && res.toLowerCase().includes("exists")) {
        setRegError("Hospital ID already registered.");
      } else if (res && res.hospitalId) {
        setRegSuccess("Hospital registered! You can now sign in.");
        setReg({ hospitalId:"", hospitalName:"", city:"", password:"", confirmPassword:"" });
        setTimeout(() => switchMode("login"), 1500);
      } else {
        setRegError(typeof res === "string" ? res : "Registration failed.");
      }
    } catch {
      setRegError("Server error. Is the backend running?");
    }
    setRegLoading(false);
  };

  return (
      <div className="login-page">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-brand">
            <span className="login-heart">🫀</span>
            <h1 className="login-title">OrganLink<br />Hospital Portal</h1>
            <p className="login-sub">
              Secure access for registered hospitals to manage organ allocation,
              patient priority, and donor coordination.
            </p>
            <div className="login-stats">
              <div className="login-stat">
                <div className="login-stat-num">6</div>
                <div className="login-stat-label">Organs Tracked</div>
              </div>
              <div className="login-stat">
                <div className="login-stat-num">13</div>
                <div className="login-stat-label">City Network</div>
              </div>
              <div className="login-stat">
                <div className="login-stat-num">Real-time</div>
                <div className="login-stat-label">Priority Engine</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-form-wrap">

            {/* Toggle */}
            <div style={{ display:"flex", gap:8, marginBottom:24, background:"var(--bg)", borderRadius:"var(--radius)", padding:4, border:"1px solid var(--border)" }}>
              <button
                  className={`btn btn-full ${mode==="login" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => switchMode("login")}
              >
                Sign In
              </button>
              <button
                  className={`btn btn-full ${mode==="register" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => switchMode("register")}
              >
                Register Hospital
              </button>
            </div>

            {/* ── LOGIN FORM ── */}
            {mode === "login" && (
                <>
                  <h2 className="login-form-title">Hospital Sign In</h2>
                  <p className="login-form-sub">Enter your hospital credentials to continue</p>

                  <div className="field">
                    <label>Hospital ID</label>
                    <input
                        value={hospitalId}
                        onChange={e => setHospitalId(e.target.value)}
                        placeholder="e.g. H001"
                        onKeyDown={e => e.key === "Enter" && submit()}
                    />
                  </div>

                  <div className="field">
                    <label>Password</label>
                    <div style={{ position:"relative" }}>
                      <input
                          type={showPass ? "text" : "password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Enter password"
                          onKeyDown={e => e.key === "Enter" && submit()}
                          style={{ paddingRight:44 }}
                      />
                      <button
                          onClick={() => setShowPass(s => !s)}
                          style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, padding:0, color:"var(--muted)" }}
                      >
                        {showPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {error && <div className="alert alert-error">{error}</div>}

                  <button className="btn btn-primary btn-full" onClick={submit} disabled={loading} style={{ marginTop:20 }}>
                    {loading ? <span className="spinner" /> : "Sign In →"}
                  </button>

                  <p style={{ marginTop:16, fontSize:12, color:"var(--muted)", textAlign:"center" }}>
                    New hospital?{" "}
                    <span style={{ color:"var(--teal)", cursor:"pointer", fontWeight:600 }} onClick={() => switchMode("register")}>
                  Register here
                </span>
                  </p>
                </>
            )}

            {/* ── REGISTER FORM ── */}
            {mode === "register" && (
                <>
                  <h2 className="login-form-title">Register Hospital</h2>
                  <p className="login-form-sub">Create your hospital account to join the network</p>

                  <div className="field">
                    <label>Hospital ID *</label>
                    <input value={reg.hospitalId} onChange={e => setR("hospitalId", e.target.value)} placeholder="e.g. H004" />
                  </div>

                  <div className="field">
                    <label>Hospital Name *</label>
                    <input value={reg.hospitalName} onChange={e => setR("hospitalName", e.target.value)} placeholder="e.g. Fortis Bengaluru" />
                  </div>

                  <div className="field">
                    <label>City *</label>
                    <input value={reg.city} onChange={e => setR("city", e.target.value)} placeholder="e.g. Bengaluru" />
                  </div>

                  <div className="field">
                    <label>Password *</label>
                    <div style={{ position:"relative" }}>
                      <input
                          type={showRegPass ? "text" : "password"}
                          value={reg.password}
                          onChange={e => setR("password", e.target.value)}
                          placeholder="Create a password"
                          style={{ paddingRight:44 }}
                      />
                      <button
                          onClick={() => setShowRegPass(s => !s)}
                          style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, padding:0, color:"var(--muted)" }}
                      >
                        {showRegPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <label>Confirm Password *</label>
                    <input
                        type="password"
                        value={reg.confirmPassword}
                        onChange={e => setR("confirmPassword", e.target.value)}
                        placeholder="Repeat password"
                        onKeyDown={e => e.key === "Enter" && submitRegister()}
                    />
                  </div>

                  {regError   && <div className="alert alert-error">{regError}</div>}
                  {regSuccess && <div className="alert alert-success">{regSuccess}</div>}

                  <button className="btn btn-primary btn-full" onClick={submitRegister} disabled={regLoading} style={{ marginTop:20 }}>
                    {regLoading ? <span className="spinner" /> : "Register Hospital →"}
                  </button>

                  <p style={{ marginTop:16, fontSize:12, color:"var(--muted)", textAlign:"center" }}>
                    Already registered?{" "}
                    <span style={{ color:"var(--teal)", cursor:"pointer", fontWeight:600 }} onClick={() => switchMode("login")}>
                  Sign in here
                </span>
                  </p>
                </>
            )}

          </div>
        </div>
      </div>
  );
}