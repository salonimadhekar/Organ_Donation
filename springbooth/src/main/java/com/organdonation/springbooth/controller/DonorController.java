package com.organdonation.springbooth.controller;


import com.organdonation.springbooth.model.*;
import com.organdonation.springbooth.repository.DonorRepository;
import com.organdonation.springbooth.repository.HospitalRepository;
import com.organdonation.springbooth.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/donor")
public class DonorController {


    @Autowired
    private AllocationService allocationService;
    @Autowired
    private HospitalRepository hospitalRepo;
    @Autowired
    private DonorRepository donorRepo;


    // ➕ Add donor
    @PostMapping("/add")
    public String addDonor(@RequestBody Donor d) {


        Hospital h = hospitalRepo.findById(d.getHospital().getHospitalId()).orElse(null);


        if (h == null) return "Hospital not found";


        d.setHospital(h);


        // 🔥 AUTO APPROVE (your shortcut)
        d.setConsentStatus("MEDICAL_APPROVED");
        d.setStatus("PENDING");


        donorRepo.save(d);


        return "Donor added successfully";
    }


    // 🔥 Activate donor & allocate organs
    @PostMapping("/activate/{donorId}")
    public Object activateDonor(@PathVariable String donorId) {


        Donor d = donorRepo.findById(donorId).orElse(null);


        if (d == null) return "Donor not found";
        if (!"MEDICAL_APPROVED".equals(d.getConsentStatus())) {
            return "Donor not ready for allocation";
        }


        d.setStatus("AVAILABLE");




        return allocationService.allocateOrgans(d);
    }


}
