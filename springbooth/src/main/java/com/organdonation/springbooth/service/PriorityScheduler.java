package com.organdonation.springbooth.service;


import com.organdonation.springbooth.model.Patient;
import com.organdonation.springbooth.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.util.List;


@Service
public class PriorityScheduler {
    @Autowired
    private PatientRepository patientRepo;
    @Scheduled(fixedRate = 60000)
    public void updateAll(){
        System.out.println("Scheduler running...");
        List<Patient> patients = patientRepo.findAll();
        for(Patient p: patients){
            p.updatePriority();
        }
        patientRepo.saveAll(patients);
    }




}

