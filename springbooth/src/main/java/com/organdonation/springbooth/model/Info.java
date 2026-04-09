package com.organdonation.springbooth.model;

public class Info {
    private String name;
    private int age;
    private String aadharNo;
    private String location;

    public Info(String name, int age, String aadharNo, String location) {
        this.name = name;
        this.age = age;
        this.aadharNo = aadharNo;
        this.location = location;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getAadharNo() {
        return aadharNo;
    }

    public String getLocation() {
        return location;
    }
}