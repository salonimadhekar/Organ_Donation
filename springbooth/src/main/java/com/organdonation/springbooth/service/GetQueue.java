/*
package com.organdonation.springbooth.service;

import java.util.PriorityQueue;
import java.util.Map;
import com.organdonation.springbooth.model.*;


import com.organdonation.springbooth.graph.OrganGraph;

//import static org.example.Main.hospitals;

*/

package com.organdonation.springbooth.service;

import java.util.PriorityQueue;
import java.util.Map;

import com.organdonation.springbooth.model.*;
import com.organdonation.springbooth.service.DataStore;

public class GetQueue {

    static CalculateScore c = new CalculateScore();

    public static PriorityQueue<Patient> getQueue(CalculateScore score,
                                                  Map<String, Integer> distMap,
                                                  int organtime) {

        PriorityQueue<Patient> list = new PriorityQueue<>(

                (a, b) -> {

                   // Hospital ha = DataStore.hospitals.get(a.getHospital().getHospitalId());
                    //Hospital hb = DataStore.hospitals.get(b.getHospital().getHospitalId());

                    int distA = distMap.getOrDefault(a.getHospital().getCity(), Integer.MAX_VALUE);
                    int distB = distMap.getOrDefault(b.getHospital().getCity(), Integer.MAX_VALUE);

                    double scoreA = c.calculateScore(a, distA, organtime);
                    double scoreB = c.calculateScore(b, distB, organtime);

                    return Double.compare(scoreB, scoreA); // max priority
                }
        );

        return list;
    }
}