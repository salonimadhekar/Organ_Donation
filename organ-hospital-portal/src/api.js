const BASE = "http://localhost:8080";

const req = async (url, opts = {}) => {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

export const api = {
  // ── HOSPITAL ──
  registerHospital: (data) => req("/hospital/register", { method: "POST", body: JSON.stringify(data) }),
  getAllHospitals: () => req("/hospital/all"),

  // ── DONOR ──
  addDonor: (data) => req("/donor/add", { method: "POST", body: JSON.stringify(data) }),
  activateDonor: (id) => req(`/donor/activate/${id}`, { method: "POST" }),
  getAllDonors: () => req("/donor/all"),

  // ── PATIENT ──
  addPatient: (data) => req("/patient/add", { method: "POST", body: JSON.stringify(data) }),
  addAllPatients: (data) => req("/patient/addAll", { method: "POST", body: JSON.stringify(data) }),
  getPatientsByOrgan: (organ) => req(`/patient/organ/${organ}`),
  getWaitingList: (organ) => req(`/patient/waiting-list/${organ}`),
  updateUrgency: (id, urgency) => req(`/patient/update-condition/${id}?urgency=${urgency}`, { method: "PUT" }),

  // ── ALLOCATION ──
  acceptAllocation: (patientId, donorId) =>
    req(`/allocation/accept?patientId=${patientId}&donorId=${donorId}`, { method: "POST" }),
};