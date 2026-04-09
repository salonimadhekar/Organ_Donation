package com.organdonation.springbooth.model;

import java.util.ArrayList;
import java.util.List;

public class Hospital {

    private String hospitalId;
    private String hospitalName;
    private String city;

    private List<Patient> patients = new ArrayList<>();
    private List<Donor> donors = new ArrayList<>();

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
}
