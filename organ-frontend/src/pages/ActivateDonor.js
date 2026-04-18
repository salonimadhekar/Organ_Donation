import React, { useState } from "react";
import { activateDonor } from "../services/api";
function ActivateDonor(){
    const[donorId,setDonorId] = useState("");
    const[result,setResult] = useState([]);
    const handleActivate = async()=>{
        try {
        const data = await activateDonor(donorId);

        console.log("Response:", data);   // ✅ correct debug

        setResult(data);

    } catch (err) {
        console.error("Error:", err);
    }
    };
    return (
        <div>
            <h2>Activate Donor</h2>
            <input placeholder="Enter Donor Id"
            onChange={(e)=>setDonorId(e.target.value)}/>
            <button onClick={handleActivate}>Activate</button>
            <h3>Allocation Result:</h3>
            {result.length===0&&<p>No Allocation</p>}
            {result.map((p,index)=>(
                <div key={index}>
                    <p><b>ID:</b>{p.patientId}</p>
                    <p><b>Name:</b>{p.name}</p>
                    <p><b>Waiting Time:</b>{p.waitingTime}</p>
                    <hr />

                </div>
            ))}
        </div>
    );
   
}
export default ActivateDonor;