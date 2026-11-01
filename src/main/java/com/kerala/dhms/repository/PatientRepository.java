package com.kerala.dhms.repository;

import com.kerala.dhms.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByPatientId(String patientId);

    long countByIsActive(Integer isActive);

    @Query("SELECT COUNT(DISTINCT p.currentLocation) FROM Patient p WHERE p.isActive = 1")
    long countDistinctCurrentLocation();

    @Query("SELECT p.currentLocation AS name, COUNT(p) AS count FROM Patient p WHERE p.isActive = 1 GROUP BY p.currentLocation")
    List<Map<String, Object>> findDistrictWiseCounts();

    @Query("SELECT p FROM Patient p WHERE p.isActive = 1 " +
           "AND (:search IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.patientId) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.mobile) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:location IS NULL OR p.currentLocation = :location) " +
           "AND (:disease IS NULL OR EXISTS (SELECT 1 FROM HealthCondition hc WHERE hc.patientId = p.id AND LOWER(hc.conditionName) LIKE LOWER(CONCAT('%', :disease, '%')))) " +
           "AND (:userLocation IS NULL OR p.currentLocation = :userLocation) " +
           "ORDER BY p.registeredAt DESC")
    Page<Patient> findWithFilters(
            @Param("search") String search,
            @Param("location") String location,
            @Param("disease") String disease,
            @Param("userLocation") String userLocation,
            Pageable pageable
    );
}
