const BASE_URL = "http://localhost:8080";
export const addPatient = async(data)=>{
    const res = await fetch(`${BASE_URL}/patient/add`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    return res;
}
export const addDonor = async(data)=>{
    const res = await fetch(`${BASE_URL}/donor/add`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    return res;
}
export const activateDonor = async(id)=>{
    const res = await fetch(`${BASE_URL}/donor/activate/${id}`,{
        method:"POST",
    });
    return res.json();
};