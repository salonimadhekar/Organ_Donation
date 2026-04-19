package com.organdonation.springbooth.graph;
import com.organdonation.springbooth.model.*;
public class Edge{
    private String target;
    private int distance;
    public Edge(String target,
                int distance){
        this.target = target;
        this.distance = distance;
    }


    public String getTarget() {
        return target;
    }
    public int getDistance() {
        return distance;
    }




}