package com.kerala.dhms.repository;

import com.kerala.dhms.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, Long> {
    List<Referral> findByPatientIdOrderByReferralDateDesc(Long patientId);
}
