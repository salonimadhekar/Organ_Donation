import React, { useState } from "react";
import { addPatient } from "../services/api";

function AddPatient() {
  const [form, setForm] = useState({
    patientId: "",
    bloodGroup: "",
    aadharNo:"",
    age:"",
    location:"",
    name:"",
    tissue: "",
    organSize: "",
    waitingTime: "",
    organ: "",
    hospitalId: "",
  });

  const handleSubmit = async () => {
    const data = {
      patientId: form.patientId,
      bloodGroup: form.bloodGroup,
      info:{
            aadharNo:form.aadharNo,
            age:Number(form.age),
            location:form.location,
            name:form.name
            },
      tissue: form.tissue,
      organSize: Number(form.organSize),
      waitingTime: Number(form.waitingTime),
      organsNeeded: [form.organ],
      hospital: {
        hospitalId: form.hospitalId,
      },
    };

    await addPatient(data);

    alert("Patient added successfully!");
  };

  return (
    <div>
      <h2>Add Patient</h2>

      <input placeholder="Patient ID"
        onChange={(e) => setForm({ ...form, patientId: e.target.value })} />

      <input placeholder="Blood Group"
        onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} />
      
      <input placeholder="Aadhar No."
        onChange={(e) => setForm({ ...form, aadharNo: e.target.value })} />

      <input placeholder="Age"
        onChange={(e) => setForm({ ...form, age: e.target.value })} />

      <input placeholder="Location"
        onChange={(e) => setForm({ ...form, location: e.target.value })} />

      <input placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Tissue"
        onChange={(e) => setForm({ ...form, tissue: e.target.value })} />

      <input placeholder="Organ Size"
        onChange={(e) => setForm({ ...form, organSize: e.target.value })} />

      <input placeholder="Waiting Time"
        onChange={(e) => setForm({ ...form, waitingTime: e.target.value })} />

      <input placeholder="Organ (kidney)"
        onChange={(e) => setForm({ ...form, organ: e.target.value })} />

      <input placeholder="Hospital ID"
        onChange={(e) => setForm({ ...form, hospitalId: e.target.value })} />

      <br /><br />
      <button onClick={handleSubmit}>Add Patient</button>
    </div>
  );
}

export default AddPatient;