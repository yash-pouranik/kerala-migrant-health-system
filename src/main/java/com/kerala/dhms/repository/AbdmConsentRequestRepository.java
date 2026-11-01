package com.kerala.dhms.repository;

import com.kerala.dhms.entity.AbdmConsentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AbdmConsentRequestRepository extends JpaRepository<AbdmConsentRequest, Long> {
    List<AbdmConsentRequest> findByPatientIdOrderByCreatedAtDesc(Long patientId);
}
