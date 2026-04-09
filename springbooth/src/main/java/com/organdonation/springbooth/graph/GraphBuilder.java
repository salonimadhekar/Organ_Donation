package com.organdonation.springbooth.graph;
import com.organdonation.springbooth.model.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
public class GraphBuilder{
    private static HashMap<Hospital,List<Edge>> graph = new HashMap<>();
    public static  void addEdge(Hospital a, Hospital b, int distance){
        graph.putIfAbsent(b,new ArrayList<>());
        graph.putIfAbsent(a,new ArrayList<>());
        graph.get(a).add(new Edge(b,distance));
        graph.get(b).add(new Edge(a,distance));
    }
    public static Map<Hospital,List<Edge>> getGraph(){
        return graph;
    }
}

