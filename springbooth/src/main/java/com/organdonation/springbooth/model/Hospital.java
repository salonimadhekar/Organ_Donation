package com.organdonation.springbooth.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity
public class Hospital {
    @Id
    private String hospitalId;
    private String hospitalName;
    private String city;
    @OneToMany(mappedBy = "hospital")
    @JsonBackReference
    private List<Patient> patients = new ArrayList<>();
    @OneToMany
    private List<Donor> donors = new ArrayList<>();
    public Hospital(){}

    public Hospital(String hospitalId, String hospitalName,String city) {
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.city = city;
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public List<Donor> getDonors() {
        return donors;
    }
    public String getCity(){
        return city;
    }

    public void addPatient(Patient p) {
        patients.add(p);
    }

    public void addDonor(Donor d) {
        donors.add(d);
    }
    @Override
    public boolean equals(Object o){
        if(this==o)return true;
        if(!(o instanceof Hospital)) return false;
        Hospital h = (Hospital) o;
        return hospitalId.equals(h.hospitalId);
    }
    @Override
    public int hashCode(){
        return hospitalId.hashCode();
    }
}
