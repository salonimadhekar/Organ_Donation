package com.organdonation.springbooth.repository;
import com.organdonation.springbooth.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface HospitalRepository extends JpaRepository<Hospital,String>{
}
