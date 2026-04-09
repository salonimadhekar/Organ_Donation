package com.organdonation.springbooth.controller;
import org.springframework.web.bind.annotation.*;
import com.organdonation.springbooth.model.Hospital;
import com.organdonation.springbooth.service.DataStore;
@RestController
@RequestMapping("/hospital")
public class HospitalController {


    @PostMapping("/register")
    public String register(@RequestBody Hospital h) {
        DataStore.hospitals.put(h.getHospitalId(), h);
        return "Hospital registered";
    }
}