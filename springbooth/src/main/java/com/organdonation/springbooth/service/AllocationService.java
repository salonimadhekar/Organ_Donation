package com.organdonation.springbooth.service;

import com.organdonation.springbooth.model.*;
import com.organdonation.springbooth.graph.*;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AllocationService {

    public List<Patient> allocateOrgans(Donor donor) {

        List<Patient> finalAllocatedList = new ArrayList<>();

        // Activate donor
        donor.setActive(true);

        if (!donor.isActive()) {
            return finalAllocatedList;
        }

        // Loop through each organ donated
        for (String organ : donor.getOrgansDonated()) {

            List<Patient> candidates =
                    DataStore.organMap.get(organ.toLowerCase());

            if (candidates == null || candidates.isEmpty()) {
                continue;
            }

            List<Patient> validPatients = new ArrayList<>();

            // 🔍 FILTERING LOGIC
            for (Patient p : candidates) {

                if (!p.isAvailable()) continue;

                if (!p.getBloodGroup().equalsIgnoreCase(donor.getBloodGroup()))
                    continue;

                if (!p.getTissue().equalsIgnoreCase(donor.getTissue()))
                    continue;

                if (Math.abs(p.getOrganSize() - donor.getOrganSize()) > 2)
                    continue;

                validPatients.add(p);
            }

            if (validPatients.isEmpty()) {
                continue;
            }

            // 🔥 GRAPH + DISTANCE LOGIC
            String hospitalId = donor.getHospitalId();
            Hospital sourceHos = DataStore.hospitals.get(hospitalId);

            Map<Hospital, List<Edge>> graph = GraphBuilder.getGraph();
            Map<Hospital, Integer> distMap =
                    OrganGraph.mainLogic(graph, sourceHos);

            // ⏱ Organ viability time
            int organTime = Organs.getTime(organ);

            // 🎯 PRIORITY QUEUE (SCORING)
            CalculateScore scoreService = new CalculateScore();
            PriorityQueue<Patient> pq =
                    GetQueue.getQueue(scoreService, distMap, organTime);

            for (Patient p : validPatients) {
                pq.add(p);
            }

            // 🏆 SELECT BEST PATIENT
            if (!pq.isEmpty()) {
                Patient selected = pq.poll();

                // mark as allocated
                selected.setAvailable(false);

                finalAllocatedList.add(selected);
            }
        }

        return finalAllocatedList;
    }
}