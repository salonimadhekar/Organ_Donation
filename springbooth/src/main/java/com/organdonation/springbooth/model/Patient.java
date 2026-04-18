package com.organdonation.springbooth.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.List;
@Entity
public class Patient {
    @Id
    private String patientId;
    @Embedded
    private Info info;

    private String bloodGroup;
    private String tissue;
    private int organSize;

    private int waitingTime;
    @ElementCollection
    private List<String> organsNeeded;
    @ManyToOne
    @JoinColumn(name = "hospital_id")
    @JsonBackReference
    private Hospital hospital;

    private boolean isAvailable = true;
    public Patient(){}
    public Patient(String patientId, Info info, String bloodGroup, String tissue,
                   int organSize, int waitingTime,
                   List<String> organsNeeded, Hospital hospital) {

        this.patientId = patientId;
        this.info = info;
        this.bloodGroup = bloodGroup;
        this.tissue = tissue;
        this.organSize = organSize;
        this.waitingTime = waitingTime;
        this.organsNeeded = organsNeeded;
        this.hospital = hospital;
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

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
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
