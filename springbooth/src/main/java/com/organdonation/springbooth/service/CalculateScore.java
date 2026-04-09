package com.organdonation.springbooth.service;
import com.organdonation.springbooth.model.*;
public class CalculateScore{
    public double calculateScore(Patient patient, int distance,int organtime){
        double high = 8.5;
        double medium = 6.5;
        double low = 2.5;
        double score = organtime*medium+patient.getWaitingTime()*low- (double) distance/100*low;
        return score;
    }

}