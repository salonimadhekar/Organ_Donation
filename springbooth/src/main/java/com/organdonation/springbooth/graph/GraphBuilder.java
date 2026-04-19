package com.organdonation.springbooth.graph;
import com.organdonation.springbooth.model.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
public class GraphBuilder{
    private static HashMap<String,List<Edge>> graph = new HashMap<>();
    public static  void addEdge(String aCity, String bCity, int distance){

        graph.putIfAbsent(bCity,new ArrayList<>());
        graph.putIfAbsent(aCity,new ArrayList<>());
        graph.get(aCity).add(new Edge(bCity,distance));
        graph.get(bCity).add(new Edge(aCity,distance));
    }
    public static void initializeGraph() {

        graph.clear();

        addEdge("Mumbai", "Pune", 150);
        addEdge("Mumbai", "Ahmedabad", 500);
        addEdge("Pune", "Ahmedabad", 400);

        addEdge("Ahmedabad", "Delhi", 900);
        addEdge("Delhi", "Kolkata", 1500);

        addEdge("Delhi", "Hyderabad", 1200);
        addEdge("Hyderabad", "Bangalore", 500);

        addEdge("Bangalore", "Chennai", 350);
        addEdge("Hyderabad", "Chennai", 600);

        addEdge("Pune", "Bangalore", 800);
        addEdge("Mumbai", "Bangalore", 900);

        addEdge("Chennai", "Kolkata", 1600);
        addEdge("Pune", "Hyderabad", 700);
    }

    public static Map<String,List<Edge>> getGraph(){
        return graph;
    }
}

