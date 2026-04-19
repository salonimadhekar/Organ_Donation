package com.organdonation.springbooth.service;
import com.organdonation.springbooth.model.*;
public class CalculateScore{
    public double calculateScore(Patient patient, int distance,int organtime){
        double score =
                (patient.getWaitingTime() * 3)
                        + (organtime * 5)
                        - (distance * 0.6);

        return score;
    }

}