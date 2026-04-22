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
            p.setWaitingTime(System.currentTimeMillis());
            p.updatePriority();
            p.setStatus("WAITING");
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


        // 🔥 ADD THESE (same as addAll)
        p.setWaitingTime(System.currentTimeMillis());
        p.updatePriority();
        p.setStatus("WAITING");


        patientRepo.save(p);


        return "Patient added";
    }


    @GetMapping("/organ/{organ}")
    public List<Patient> view(@PathVariable String organ) {
        return patientRepo.findByOrgansNeededContainingIgnoreCase(organ);
    }
    @PutMapping("/update-condition/{id}")
    public String updateCondition(@PathVariable String id,
                                  @RequestParam int urgency) {


        Patient p = patientRepo.findById(id).orElse(null);
        if (p == null) return "Not found";


        p.setUrgency(urgency);
        p.updatePriority();


        patientRepo.save(p);


        return "Updated";
    }
    @GetMapping("/waiting-list/{organ}")
    public List<Patient> getWaitingList(@PathVariable String organ) {


        List<Patient> patients =
                patientRepo.findByOrgansNeededContainingIgnoreCase(organ);


        patients.sort((a, b) ->
                Double.compare(b.getDynamicPriority(), a.getDynamicPriority())
        );


        return patients;
    }
}
