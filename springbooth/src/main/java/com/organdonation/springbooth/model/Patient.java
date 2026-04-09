package com.organdonation.springbooth.model;

import java.util.List;

public class Patient {
    private String patientId;
    private Info info;

    private String bloodGroup;
    private String tissue;
    private int organSize;

    private int waitingTime;

    private List<String> organsNeeded;

    private String hospitalId;
    private boolean isAvailable = true;

    public Patient(String patientId, Info info, String bloodGroup, String tissue,
                   int organSize, int waitingTime,
                   List<String> organsNeeded, String hospitalId) {

        this.patientId = patientId;
        this.info = info;
        this.bloodGroup = bloodGroup;
        this.tissue = tissue;
        this.organSize = organSize;
        this.waitingTime = waitingTime;
        this.organsNeeded = organsNeeded;
        this.hospitalId = hospitalId;
    }

    public String getPatientId() {
        return patientId;
    }

    public Info getInfo() {
        return info;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getTissue() {
        return tissue;
    }

    public int getOrganSize() {
        return organSize;
    }

    public int getWaitingTime() {
        return waitingTime;
    }

    public List<String> getOrgansNeeded() {
        return organsNeeded;
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    @Override
    public String toString() {
        return "Patient ID: " + patientId +
                ", Name: " + info.getName() +
                ", Blood: " + bloodGroup +
                ", Waiting: " + waitingTime +
                ", Organs: " + organsNeeded;
    }
}
