package com.organdonation.springbooth.controller;
import com.organdonation.springbooth.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.organdonation.springbooth.model.Hospital;
import com.organdonation.springbooth.service.DataStore;

import java.util.List;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/hospital")
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepo;
    @PostMapping("/register")
    public String register(@RequestBody Hospital h) {
        //DataStore.hospitals.put(h.getHospitalId(), h);
        hospitalRepo.save(h);
        return "Hospital registered";
    }
    // 👇 ADD THIS HERE
    @GetMapping("/all")
    public List<Hospital> getAllHospitals() {
        return hospitalRepo.findAll();
    }
}