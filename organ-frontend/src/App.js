import React from "react";
import AddPatient from "./pages/AddPatient";
import AddDonor from "./pages/AddDonor";
import ActivateDonor from "./pages/ActivateDonor";
function App() {
  return (
    <div>
      <h1>Organ Donation System</h1>
      <AddPatient />
      <AddDonor />
      <ActivateDonor />
    </div>
  );
}

export default App;