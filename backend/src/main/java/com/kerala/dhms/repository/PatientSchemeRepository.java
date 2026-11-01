package com.kerala.dhms.repository;

import com.kerala.dhms.entity.PatientScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientSchemeRepository extends JpaRepository<PatientScheme, Long> {
    List<PatientScheme> findByPatientId(Long patientId);
}
