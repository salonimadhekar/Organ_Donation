package com.organdonation.springbooth.controller;


import com.organdonation.springbooth.model.Donor;
import com.organdonation.springbooth.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.organdonation.springbooth.repository.DonorRepository;
import com.organdonation.springbooth.repository.PatientRepository;

@CrossOrigin(origins = "http://localhost:3000")  // ← ADD THIS
@RestController
@RequestMapping("/allocation")
public class AllocationController {
    @Autowired
    private  DonorRepository donorRepo;
    @Autowired
    private PatientRepository patientRepo;
    @PostMapping("/accept")
    public String acceptMatch(@RequestParam String patientId,
                              @RequestParam String donorId) {


        Patient p = patientRepo.findById(patientId).orElse(null);
        Donor d = donorRepo.findById(donorId).orElse(null);


        if (p == null || d == null) return "Invalid";


        p.setAvailable(false);
        p.setStatus("ALLOCATED");


        d.setStatus("ASSIGNED");


        patientRepo.save(p);
        donorRepo.save(d);


        return "Allocation confirmed";
    }


}
