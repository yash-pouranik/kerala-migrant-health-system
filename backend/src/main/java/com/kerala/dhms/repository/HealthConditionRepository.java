package com.kerala.dhms.repository;

import com.kerala.dhms.entity.HealthCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthConditionRepository extends JpaRepository<HealthCondition, Long> {
    List<HealthCondition> findByPatientId(Long patientId);
    long countByPatientIdAndIsActive(Long patientId, Integer isActive);
    long countByIsActive(Integer isActive);
}
