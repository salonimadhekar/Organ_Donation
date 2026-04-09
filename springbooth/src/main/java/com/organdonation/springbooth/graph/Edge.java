package com.organdonation.springbooth.graph;
import com.organdonation.springbooth.model.*;
public class Edge{
    private Hospital target;
    private int distance;
    public Edge(Hospital target,
                int distance){
        this.target = target;
        this.distance = distance;
    }


    public Hospital getTarget() {
        return target;
    }
    public int getDistance() {
        return distance;
    }




}