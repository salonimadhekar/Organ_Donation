package com.organdonation.springbooth.controller;
import com.organdonation.springbooth.model.*;

import com.organdonation.springbooth.repository.HospitalRepository;
import com.organdonation.springbooth.repository.PatientRepository;
import com.organdonation.springbooth.service.DataStore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/patient")

public class PatientController {
    @Autowired
    private PatientRepository patientRepo;
    @Autowired
    private HospitalRepository hospitalRepo;
    @PostMapping("/addAll")
    public String addAll(@RequestBody List<Patient> patients){
        for(Patient p: patients){
            if(p.getHospital()==null)return "Hospital missing";
            Hospital h = hospitalRepo.findById((p.getHospital().getHospitalId())).orElse(null);
            if(h==null)return "Hospital not found";
            p.setHospital(h);
            patientRepo.save(p);
        }
        return "All patients added";
    }
    @PostMapping("/add")
    public String add(@RequestBody Patient p) {
        if(p.getHospital()==null) return "Hospital not provided";

        Hospital h = hospitalRepo.findById(p.getHospital().getHospitalId()).orElse(null);

        if (h == null) return "Hospital not found";
        p.setHospital(h);
        patientRepo.save(p);

        for (String organ : p.getOrgansNeeded()) {
            DataStore.organMap
                    .computeIfAbsent(organ.toLowerCase(), k -> new ArrayList<>())
                    .add(p);
        }

        return "Patient added";
    }

    @GetMapping("/organ/{organ}")
    public List<Patient> view(@PathVariable String organ) {
        return patientRepo.findByOrgansNeededContainingIgnoreCase(organ);
    }
}
