package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "abdm_consent_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbdmConsentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    @JsonProperty("patient_id")
    private Long patientId;

    @Column(name = "requester_facility_id")
    @JsonProperty("requester_facility_id")
    private String requesterFacilityId;

    private String purpose;

    @Column(name = "data_types", columnDefinition = "TEXT")
    @JsonProperty("data_types")
    private String dataTypes; // JSON array string

    private String status;

    @Column(name = "valid_from")
    @JsonProperty("valid_from")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate validFrom;

    @Column(name = "valid_until")
    @JsonProperty("valid_until")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate validUntil;

    @Column(name = "consent_id")
    @JsonProperty("consent_id")
    private String consentId;

    @Column(name = "created_at")
    @JsonProperty("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
