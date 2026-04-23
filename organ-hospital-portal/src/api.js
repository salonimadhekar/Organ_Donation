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
  loginHospital: (hospitalId, password) => req(`/hospital/login?hospitalId=${hospitalId}&password=${password}`, { method: "POST" }),
  getAllHospitals: () => req("/hospital/all"),

  // ── DONOR ──
  addDonor: (data) => req("/donor/add", { method: "POST", body: JSON.stringify(data) }),
  activateDonor: (id) => req(`/donor/activate/${id}`, { method: "POST" }),
  getAllDonors: () => req("/donor/all"),

  // ── PATIENT ──
  addPatient: (data) => req("/patient/add", { method: "POST", body: JSON.stringify(data) }),
  addAllPatients: (data) => req("/patient/addAll", { method: "POST", body: JSON.stringify(data) }),
  getPatientsByOrgan: (organ,hospitalId) => req(`/patient/organ/${organ}/${hospitalId}`),
  getWaitingList: (organ, hospitalId) => req(`/patient/waiting-list/${organ}/${hospitalId}`),
  updateUrgency: (id, urgency,hospitalId) => req(`/patient/update-condition/${id}?urgency=${urgency}&hospitalId=${hospitalId}`, { method: "PUT" }),

  // ── ALLOCATION ──
  acceptAllocation: (patientId, donorId) =>
    req(`/allocation/accept?patientId=${patientId}&donorId=${donorId}`, { method: "POST" }),
};