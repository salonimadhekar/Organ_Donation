package com.organdonation.springbooth.graph;
import com.organdonation.springbooth.model.*;

public class Node{
    private Hospital hospital;
    private int sourceDist;
    public Node(Hospital hospital,int sourceDist){
        this.hospital = hospital;
        this.sourceDist = sourceDist;
    }
    public Hospital getHospital(){return hospital;}


    public int getSourceDist() {
        return sourceDist;
    }
}
