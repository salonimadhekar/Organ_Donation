package com.organdonation.springbooth.controller;

import com.organdonation.springbooth.model.*;
import com.organdonation.springbooth.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/donor")
public class DonorController {

    @Autowired
    private AllocationService allocationService;

    // ➕ Add donor
    @PostMapping("/add")
    public String addDonor(@RequestBody Donor d) {

        Hospital h = DataStore.hospitals.get(d.getHospitalId());

        if (h == null) return "Hospital not found";

        h.addDonor(d);

        return "Donor added successfully";
    }

    // 🔥 Activate donor & allocate organs
    @PostMapping("/activate/{hospitalId}/{index}")
    public Object activateDonor(@PathVariable String hospitalId,
                                @PathVariable int index) {

        Hospital h = DataStore.hospitals.get(hospitalId);

        if (h == null) return "Hospital not found";

        Donor d = h.getDonors().get(index);

        return allocationService.allocateOrgans(d);
    }
}