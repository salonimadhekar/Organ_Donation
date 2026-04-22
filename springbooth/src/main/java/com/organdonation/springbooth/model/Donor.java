package com.organdonation.springbooth.model;
import jakarta.persistence.*;
import java.util.List;
@Entity
public class Donor {
    @Embedded
    private Info info;
    private String bloodGroup;
    private String tissue;
    private int organSize;
    private String consentStatus;
    private String status;
    @ElementCollection
    private List<String> organsDonated;
    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;


    private boolean isActive;
    @Id
    private String donorId;




    public Donor(){}
    public Donor(Info info, String bloodGroup, String tissue,
                 int organSize, List<String> organsDonated, Hospital hospital,String id) {


        this.info = info;
        this.bloodGroup = bloodGroup;
        this.tissue = tissue;
        this.organSize = organSize;
        this.organsDonated = organsDonated;
        this.hospital = hospital;
        this.donorId = id;






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


    public String getConsentStatus(){return consentStatus;}


    public String getStatus(){return status;}




    public List<String> getOrgansDonated() {
        return organsDonated;
    }


    public Hospital getHospital() {
        return hospital;
    }


    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }


    public void setConsentStatus(String consentStatus){ this.consentStatus=consentStatus;}


    public void setStatus(String status){this.status=status;}


    public boolean isActive() {
        return isActive;
    }


    public void setActive(boolean active) {
        isActive = active;
    }


    public String getDonorId() {
        return donorId;
    }


    public void setDonorId(String donorId) {
        this.donorId = donorId;
    }
}
