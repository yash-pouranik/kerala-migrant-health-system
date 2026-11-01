package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    @JsonProperty("patient_id")
    private Long patientId;

    @Column(name = "visit_id")
    @JsonProperty("visit_id")
    private Long visitId;

    @Column(name = "medicine_name")
    @JsonProperty("medicine_name")
    private String medicineName;

    private String dosage;

    private String frequency;

    private String duration;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "prescribed_date")
    @JsonProperty("prescribed_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate prescribedDate;
}
