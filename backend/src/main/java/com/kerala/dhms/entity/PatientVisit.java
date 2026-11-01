package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patient_visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    @JsonProperty("patient_id")
    private Long patientId;

    @Column(name = "visit_date")
    @JsonProperty("visit_date")
    private LocalDateTime visitDate;

    private String facility;

    @Column(name = "chief_complaint", columnDefinition = "TEXT")
    @JsonProperty("chief_complaint")
    private String chiefComplaint;

    @Column(columnDefinition = "TEXT")
    private String vitals; // JSON string or text

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "treatment_notes", columnDefinition = "TEXT")
    @JsonProperty("treatment_notes")
    private String treatmentNotes;

    @Column(name = "follow_up_required")
    @JsonProperty("follow_up_required")
    @Builder.Default
    private Integer followUpRequired = 0;

    @Column(name = "follow_up_date")
    @JsonProperty("follow_up_date")
    private String followUpDate;

    @Column(name = "visited_by")
    @JsonProperty("visited_by")
    private Long visitedBy;

    @Column(name = "created_at")
    @JsonProperty("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    @Builder.Default
    private List<VisitAttachment> attachments = new ArrayList<>();

    @Transient
    @JsonProperty("vitalsObj")
    private Object vitalsObj;

    @PrePersist
    public void prePersist() {
        if (visitDate == null) visitDate = LocalDateTime.now();
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (followUpRequired == null) followUpRequired = 0;
    }
}
