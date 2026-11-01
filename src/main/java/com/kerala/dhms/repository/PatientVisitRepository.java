package com.kerala.dhms.repository;

import com.kerala.dhms.entity.PatientVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientVisitRepository extends JpaRepository<PatientVisit, Long> {
    List<PatientVisit> findByPatientIdOrderByVisitDateDesc(Long patientId);
    List<PatientVisit> findTop5ByPatientIdOrderByVisitDateDesc(Long patientId);
}
