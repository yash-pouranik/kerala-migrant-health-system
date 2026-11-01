package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "health_conditions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    @JsonProperty("patient_id")
    private Long patientId;

    @Column(name = "condition_name")
    @JsonProperty("condition_name")
    private String conditionName;

    @Column(name = "icd_code")
    @JsonProperty("icd_code")
    private String icdCode;

    private String severity;

    @Column(name = "diagnosed_date")
    @JsonProperty("diagnosed_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate diagnosedDate;

    @Column(name = "is_active")
    @JsonProperty("is_active")
    @Builder.Default
    private Integer isActive = 1;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
