package com.organdonation.springbooth.service;

import com.organdonation.springbooth.model.*;
import com.organdonation.springbooth.graph.*;

import com.organdonation.springbooth.repository.DonorRepository;
import com.organdonation.springbooth.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AllocationService {
    @Autowired
    private DonorRepository donorRepo;
    @Autowired
    private PatientRepository patientRepo;

    public List<Map<String,Object>> allocateOrgans(Donor donor) {

        List<Map<String,Object>> finalAllocatedList = new ArrayList<>();



        // Activate donor
        donor.setActive(true);

        if (!donor.isActive()) {
            return finalAllocatedList;
        }

        // Loop through each organ donated
        for (String organ : donor.getOrgansDonated()) {

            List<Patient> candidates =
                    patientRepo.findByOrgansNeededContainingIgnoreCase(organ.toLowerCase());

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

            Hospital sourceHos = donor.getHospital();

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
                selected.setAvailable(false);

                // mark as allocated
                patientRepo.save(selected);
                Map<String,Object> result = new HashMap<>();
                result.put("patientId",selected.getPatientId());
                result.put("name",selected.getInfo().getName());
                result.put("waiting time",selected.getWaitingTime());

                finalAllocatedList.add(result);
            }
        }

        return finalAllocatedList;
    }
}