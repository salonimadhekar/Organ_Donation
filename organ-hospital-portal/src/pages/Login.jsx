import { useState } from "react";
import { api } from "../api";

// Simulated hospital credentials (in production, backend would handle this)
// Hospitals must be registered first via /hospital/register
const DEMO_HOSPITALS = [
  { hospitalId: "H001", password: "apollo123", hospitalName: "Apollo Mumbai", city: "Mumbai" },
  { hospitalId: "H002", password: "aiims123",  hospitalName: "AIIMS Delhi",   city: "Delhi" },
  { hospitalId: "H003", password: "ruby123",   hospitalName: "Ruby Hall Pune", city: "Pune" },
];

export default function Login({ onLogin }) {
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [showPass, setShowPass]     = useState(false);

  const submit = async () => {
    if (!hospitalId || !password) { setError("Enter Hospital ID and password."); return; }
    setLoading(true); setError("");

    // Simulate auth delay
    await new Promise(r => setTimeout(r, 600));

    const match = DEMO_HOSPITALS.find(
      h => h.hospitalId === hospitalId.trim() && h.password === password
    );

    if (match) {
      onLogin(match);
    } else {
      setError("Invalid Hospital ID or password.");
    }
    setLoading(false);
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
          <h2 className="login-form-title">Hospital Sign In</h2>
          <p className="login-form-sub">Enter your hospital credentials to continue</p>

          <div className="login-demo">
            <strong>Demo Accounts:</strong><br />
            H001 / apollo123 → Apollo Mumbai<br />
            H002 / aiims123 → AIIMS Delhi<br />
            H003 / ruby123 → Ruby Hall Pune
          </div>

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
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                onKeyDown={e => e.key === "Enter" && submit()}
                style={{ paddingRight: 44 }}
              />
              <button
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", fontSize: 16, padding: 0,
                  color: "var(--muted)"
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            className="btn btn-primary btn-full"
            onClick={submit}
            disabled={loading}
            style={{ marginTop: 20 }}
          >
            {loading ? <span className="spinner" /> : "Sign In →"}
          </button>

          <p style={{ marginTop: 20, fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
            Not registered? Contact the OrganLink network administrator<br />
            to get your hospital onboarded.
          </p>
        </div>
      </div>
    </div>
  );
}
