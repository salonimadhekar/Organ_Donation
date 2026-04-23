package com.organdonation.springbooth.controller;
import com.organdonation.springbooth.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> register(@RequestBody Hospital hospital) {
        if (hospitalRepo.existsById(hospital.getHospitalId())) {
            return ResponseEntity.status(400).body("Hospital ID already exists");
        }
        if (hospital.getPassword() == null || hospital.getPassword().isEmpty()) {
            return ResponseEntity.status(400).body("Password is required");
        }
        hospitalRepo.save(hospital);
        return ResponseEntity.ok(hospital);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String hospitalId,
                                   @RequestParam String password) {
        Hospital h = hospitalRepo.findById(hospitalId).orElse(null);
        if (h == null || !h.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        return ResponseEntity.ok(h);
    }
    // 👇 ADD THIS HERE
    @GetMapping("/all")
    public List<Hospital> getAllHospitals() {
        return hospitalRepo.findAll();
    }
}