package com.kerala.dhms.repository;

import com.kerala.dhms.entity.VisitAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitAttachmentRepository extends JpaRepository<VisitAttachment, Long> {
    List<VisitAttachment> findByVisitId(Long visitId);
}
