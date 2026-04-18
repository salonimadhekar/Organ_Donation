package com.organdonation.springbooth.repository;
import com.organdonation.springbooth.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
public interface DonorRepository extends JpaRepository<Donor,String>{

}
