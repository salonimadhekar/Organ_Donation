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


    @Autowired
    private PriorityScheduler priorityService;


    //public List<Map<String, Object>> allocateOrgans(Donor donor) {


    /*List<Map<String, Object>> finalResults = new ArrayList<>();


    // 🟢 1. VALIDATION LAYER
    if (!"MEDICAL_APPROVED".equalsIgnoreCase(donor.getConsentStatus())) {
        throw new RuntimeException("Donor not ready for allocation");
    }


    // 🟢 2. ACTIVATE DONOR
    donor.setStatus("AVAILABLE");
    donorRepo.save(donor);


    // 🟢 3. UPDATE ALL PATIENT PRIORITIES (Dynamic Engine)
    priorityService.updateAll();


    // 🟢 4. PROCESS EACH ORGAN
    for (String organ : donor.getOrgansDonated()) {


        // 🔍 STEP A: GET CANDIDATES
        List<Patient> candidates =
                patientRepo.findByOrgansNeededContainingIgnoreCase(organ);


        if (candidates == null || candidates.isEmpty()) continue;


        // 🔍 STEP B: FILTER VALID PATIENTS
        List<Patient> validPatients = new ArrayList<>();


        for (Patient p : candidates)




        if (validPatients.isEmpty()) continue;


        // 🧠 STEP C: GRAPH (DISTANCE CALCULATION)
        String sourceCity = donor.getHospital().getCity();


        GraphBuilder.initializeGraph();
        Map<String, List<Edge>> graph = GraphBuilder.getGraph();


        Map<String, Integer> distMap =
                OrganGraph.mainLogic(graph, sourceCity);


        int organTime = Organs.getTime(organ);


        // 🎯 STEP D: PRIORITY QUEUE (UPDATED LOGIC)
        PriorityQueue<Patient> pq = new PriorityQueue<>(
                (a, b) -> {


                    int distA = distMap.getOrDefault(
                            a.getHospital().getCity(),
                            Integer.MAX_VALUE);


                    int distB = distMap.getOrDefault(
                            b.getHospital().getCity(),
                            Integer.MAX_VALUE);


                    double scoreA =
                            a.getDynamicPriority()
                                    - (distA * 0.5)
                                    + (organTime * 2);


                    double scoreB =
                            b.getDynamicPriority()
                                    - (distB * 0.5)
                                    + (organTime * 2);


                    return Double.compare(scoreB, scoreA); // max heap
                }
        );


        pq.addAll(validPatients);*/
    public List<Map<String, Object>> allocateOrgans(Donor donor) {


        List<Map<String, Object>> finalResults = new ArrayList<>();


        // 🟢 1. VALIDATION LAYER
        if (!"MEDICAL_APPROVED".equalsIgnoreCase(donor.getConsentStatus())) {
            throw new RuntimeException("Donor not ready for allocation");
        }


        // 🟢 2. ACTIVATE DONOR
        donor.setStatus("AVAILABLE");
        donorRepo.save(donor);


        // 🟢 3. UPDATE ALL PATIENT PRIORITIES (Dynamic Engine)
        priorityService.updateAll();


        // 🟢 4. PROCESS EACH ORGAN
        for (String organ : donor.getOrgansDonated()) {


            System.out.println("\n=== Processing Organ: " + organ + " ===");


            // 🔍 STEP A: GET CANDIDATES
            List<Patient> candidates =
                    patientRepo.findByOrgansNeededContainingIgnoreCase(organ);


            if (candidates == null || candidates.isEmpty()) {
                System.out.println("No candidates found for organ: " + organ);
                continue;
            }


            System.out.println("Total candidates: " + candidates.size());


            // 🔍 STEP B: FILTER VALID PATIENTS
            List<Patient> validPatients = new ArrayList<>();


            for (Patient p : candidates) {


                System.out.println("\n---- Checking Patient: " + p.getPatientId() + " ----");


                if (!p.isAvailable()) {
                    System.out.println("❌ Rejected: Not Available");
                    continue;
                }


                if (!p.getBloodGroup().equalsIgnoreCase(donor.getBloodGroup())) {
                    System.out.println("❌ Rejected: Blood mismatch (" + p.getBloodGroup() + ")");
                    continue;
                }


                if (!p.getTissue().equalsIgnoreCase(donor.getTissue())) {
                    System.out.println("❌ Rejected: Tissue mismatch (" + p.getTissue() + ")");
                    continue;
                }


                int sizeDiff = Math.abs(p.getOrganSize() - donor.getOrganSize());
                if (sizeDiff > 2) {
                    System.out.println("❌ Rejected: Size mismatch (diff=" + sizeDiff + ")");
                    continue;
                }


                System.out.println("✅ Accepted: " + p.getPatientId() +
                        " | Priority: " + p.getDynamicPriority());


                validPatients.add(p);
            }


            if (validPatients.isEmpty()) {
                System.out.println("No valid patients after filtering");
                continue;
            }


            System.out.println("\nValid patients count: " + validPatients.size());


            // 🧠 STEP C: GRAPH (DISTANCE CALCULATION)
            String sourceCity = donor.getHospital().getCity();


            GraphBuilder.initializeGraph();
            Map<String, List<Edge>> graph = GraphBuilder.getGraph();


            Map<String, Integer> distMap =
                    OrganGraph.mainLogic(graph, sourceCity);


            int organTime = Organs.getTime(organ);


            // 🎯 STEP D: PRIORITY QUEUE (UPDATED LOGIC)
            PriorityQueue<Patient> pq = new PriorityQueue<>(
                    (a, b) -> {


                        int distA = distMap.getOrDefault(
                                a.getHospital().getCity(),
                                Integer.MAX_VALUE);


                        int distB = distMap.getOrDefault(
                                b.getHospital().getCity(),
                                Integer.MAX_VALUE);


                        double scoreA =
                                a.getDynamicPriority()
                                        - (distA * 0.5)
                                        + (organTime * 2);


                        double scoreB =
                                b.getDynamicPriority()
                                        - (distB * 0.5)
                                        + (organTime * 2);


                        return Double.compare(scoreB, scoreA);
                    }
            );


            pq.addAll(validPatients);


            System.out.println("\n--- PQ Entries ---");
            for (Patient p : validPatients) {
                System.out.println("PQ Add: " + p.getPatientId() +
                        " | Priority: " + p.getDynamicPriority());
            }


            // 🏆 STEP E: TOP K MATCHES (NO AUTO ALLOCATION)
            int k = 3;


            while (!pq.isEmpty() && k-- > 0) {


                Patient p = pq.poll();


                System.out.println("🎯 Selected: " + p.getPatientId());


                Map<String, Object> res = new HashMap<>();


                res.put("organ", organ);
                res.put("patientId", p.getPatientId());
                res.put("name", p.getInfo().getName());
                res.put("priority", p.getDynamicPriority());


                int distance = distMap.getOrDefault(
                        p.getHospital().getCity(),
                        Integer.MAX_VALUE);


                res.put("distance", distance);


                finalResults.add(res);
            }
        }


        return finalResults;
    }
}




// 🏆 STEP E: TOP K MATCHES (NO AUTO ALLOCATION)
          /* int k = 3;


           while (!pq.isEmpty() && k-- > 0) {


               Patient p = pq.poll();


               Map<String, Object> res = new HashMap<>();


               res.put("organ", organ);
               res.put("patientId", p.getPatientId());
               res.put("name", p.getInfo().getName());
               res.put("priority", p.getDynamicPriority());


               int distance = distMap.getOrDefault(
                       p.getHospital().getCity(),
                       Integer.MAX_VALUE);


               res.put("distance", distance);


               finalResults.add(res);


               // ❗ DO NOT mark allocated here
               // This is only suggestion phase
           }
       }


       // 🟢 RETURN ALL MATCHES (for hospital decision)
       return finalResults;
   }
}*/
