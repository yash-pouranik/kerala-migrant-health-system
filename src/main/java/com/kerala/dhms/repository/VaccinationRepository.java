package com.kerala.dhms.repository;

import com.kerala.dhms.entity.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {

    @Query("SELECT v FROM Vaccination v WHERE v.patientId = :patientId " +
           "ORDER BY CASE WHEN v.status = 'Pending' THEN 1 ELSE 2 END, v.vaccineName ASC")
    List<Vaccination> findByPatientIdCustomSorted(@Param("patientId") Long patientId);

    long countByPatientIdAndStatus(Long patientId, String status);

    long countByStatus(String status);
}
