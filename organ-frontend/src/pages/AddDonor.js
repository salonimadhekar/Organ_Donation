import React, { useState } from "react";
import { addDonor } from "../services/api";
function AddDonor(){
    const [form,setForm] = useState({
        donorId:"",
        bloodGroup:"",
        aadharNo:"",
        age:"",
        location:"",
        name:"",
        organSize:"",
        tissue:"",
        hospitalId:"",
        organ:""
    });
    const handleSubmit = async()=>{
        const data={
            donorId : form.donorId,
            bloodGroup:form.bloodGroup,
            info:{
                aadharNo:form.aadharNo,
                age:Number(form.age),
                location:form.location,
                name:form.name
            },
            organSize:Number(form.organSize),
            organDonated:[form.organ],
            tissue:form.tissue,
            hospital:{
                hospitalId:form.hospitalId
            }

        };
        try {
        const res = await addDonor(data);
        alert ("Donor added successfully");

        const text = await res.text();
        console.log("Response:", text);

    } catch (err) {
        console.error("ERROR:", err);
  }
    };
    return(
        <div>
            <h2>Add Donor</h2>
            <input placeholder="Donor ID"
                onChange={(e) => setForm({ ...form, donorId: e.target.value })} />

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

            <input placeholder="Organ (kidney)"
                onChange={(e) => setForm({ ...form, organ: e.target.value })} />

            <input placeholder="Hospital ID"
                onChange={(e) => setForm({ ...form, hospitalId: e.target.value })} />

            <br /><br />
            <button onClick={handleSubmit}>Add Donor</button>
        </div>
    );
    
}
export default AddDonor;