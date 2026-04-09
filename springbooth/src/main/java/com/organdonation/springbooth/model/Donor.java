package com.organdonation.springbooth.model;

import java.util.List;

public class Donor {
    private Info info;
    private String bloodGroup;
    private String tissue;
    private int organSize;
    private List<String> organsDonated;
    private String hospitalId;
    private boolean isActive;
    private String donorId;



    public Donor(Info info, String bloodGroup, String tissue,
                 int organSize, List<String> organsDonated, String hospitalId,String id) {

        this.info = info;
        this.bloodGroup = bloodGroup;
        this.tissue = tissue;
        this.organSize = organSize;
        this.organsDonated = organsDonated;
        this.hospitalId = hospitalId;
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


    public List<String> getOrgansDonated() {
        return organsDonated;
    }

    public String getHospitalId() {
        return hospitalId;
    }

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
