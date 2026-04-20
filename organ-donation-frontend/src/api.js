const BASE = "http://localhost:8080";

export const api = {
  // Hospital
  registerHospital: (data) =>
    fetch(`${BASE}/hospital/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.text()),

  // Donor
  addDonor: (data) =>
    fetch(`${BASE}/donor/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.text()),

  activateDonor: (donorId) =>
    fetch(`${BASE}/donor/activate/${donorId}`, { method: "POST" }).then((r) =>
      r.json()
    ),

  // Patient
  addPatient: (data) =>
    fetch(`${BASE}/patient/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.text()),

  addAllPatients: (data) =>
    fetch(`${BASE}/patient/addAll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.text()),

  getPatientsByOrgan: (organ) =>
    fetch(`${BASE}/patient/organ/${organ}`).then((r) => r.json()),
};