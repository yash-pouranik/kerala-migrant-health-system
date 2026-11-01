package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "vaccinations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    @JsonProperty("patient_id")
    private Long patientId;

    @Column(name = "vaccine_name")
    @JsonProperty("vaccine_name")
    private String vaccineName;

    @Column(name = "dose_number")
    @JsonProperty("dose_number")
    private Integer doseNumber;

    private String status; // 'Completed', 'Pending'

    @Column(name = "administered_date")
    @JsonProperty("administered_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate administeredDate;

    @Column(name = "next_due_date")
    @JsonProperty("next_due_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate nextDueDate;

    @Column(name = "batch_number")
    @JsonProperty("batch_number")
    private String batchNumber;

    @Column(name = "administrator_name")
    @JsonProperty("administrator_name")
    private String administratorName;

    @Column(name = "certificate_url")
    @JsonProperty("certificate_url")
    private String certificateUrl;

    @Column(name = "administered_by")
    @JsonProperty("administered_by")
    private Long administeredBy;
}
