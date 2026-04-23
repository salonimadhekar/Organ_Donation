package com.organdonation.springbooth.repository;
import com.organdonation.springbooth.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient,String>{


    List<Patient> findByOrgansNeededContainingIgnoreCaseAndHospital_HospitalId(String organ, String hospitalId);
    List<Patient>findByOrgansNeededContainingIgnoreCase(String organ);
}
