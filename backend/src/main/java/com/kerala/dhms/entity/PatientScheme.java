package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "patient_schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    @JsonProperty("patient_id")
    private Long patientId;

    @Column(name = "scheme_name")
    @JsonProperty("scheme_name")
    private String schemeName;

    @Column(name = "enrollment_status")
    @JsonProperty("enrollment_status")
    private String enrollmentStatus;

    @Column(name = "policy_id")
    @JsonProperty("policy_id")
    private String policyId;

    @Column(name = "coverage_amount")
    @JsonProperty("coverage_amount")
    private Double coverageAmount;

    @Column(name = "valid_until")
    @JsonProperty("valid_until")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate validUntil;

    @Column(name = "claims_used")
    @JsonProperty("claims_used")
    @Builder.Default
    private Double claimsUsed = 0.0;
}
