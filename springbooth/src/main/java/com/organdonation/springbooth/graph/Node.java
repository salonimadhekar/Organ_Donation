package com.organdonation.springbooth.graph;
import com.organdonation.springbooth.model.*;

public class Node{
    private String city;
    //private Hospital hospital;
    private int sourceDist;
    public Node(String city,int sourceDist){
        this.city = city;
        this.sourceDist = sourceDist;
    }
    public String getCity(){return city;}


    public int getSourceDist() {
        return sourceDist;
    }
}
