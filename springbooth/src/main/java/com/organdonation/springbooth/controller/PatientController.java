package com.organdonation.springbooth.controller;
import com.organdonation.springbooth.model.*;

import com.organdonation.springbooth.service.DataStore;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/patient")

public class PatientController {

    @PostMapping("/add")
    public String add(@RequestBody Patient p) {

        Hospital h = DataStore.hospitals.get(p.getHospitalId());

        if (h == null) return "Hospital not found";

        h.addPatient(p);
        DataStore.patients.put(p.getPatientId(), p);

        for (String organ : p.getOrgansNeeded()) {
            DataStore.organMap
                    .computeIfAbsent(organ.toLowerCase(), k -> new ArrayList<>())
                    .add(p);
        }

        return "Patient added";
    }

    @GetMapping("/organ/{organ}")
    public List<Patient> view(@PathVariable String organ) {
        return DataStore.organMap.getOrDefault(organ.toLowerCase(), new ArrayList<>());
    }
}
