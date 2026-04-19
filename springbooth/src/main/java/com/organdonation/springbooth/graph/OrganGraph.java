package com.organdonation.springbooth.graph;
import com.organdonation.springbooth.model.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
public class OrganGraph{
    public static HashMap<String,Integer> mainLogic(Map<String,List<Edge>> graph,String source ){
        HashMap<String,Integer> dist = new HashMap<>();//created a hashmap for storing distances
        PriorityQueue<Node> pq = new PriorityQueue<>(
                (a,b)->a.getSourceDist() - b.getSourceDist()
        );//priority queue initialize
        for(String city:graph.keySet()){
            dist.put(city,Integer.MAX_VALUE);
        }//all value infinity
        dist.put(source,0);//source set as 0
        pq.add(new Node(source,0));//added to queue
        while(!pq.isEmpty()){
            Node current = pq.poll();
            if(current.getSourceDist()>dist.get(current.getCity())){
                continue;
            }
            List<Edge> edges = graph.get(current.getCity());
            if(edges==null)continue;
            for(Edge edge: edges)
            {
                int weight = edge.getDistance();
                int newDistance = current.getSourceDist()+weight;


                if(newDistance<dist.get(edge.getTarget())){
                    dist.put(edge.getTarget(),newDistance);
                    pq.add(new Node(edge.getTarget(),newDistance));
                }


            }
        }


        return dist;
    }


}


