package com.organdonation.springbooth.service;
import com.organdonation.springbooth.model.*;
public class CalculateScore{
    public double calculateScore(Patient patient, int distance,int organtime){
        return patient.getDynamicPriority()
                + (organtime * 2)
                - (distance * 0.5);
    }


}
