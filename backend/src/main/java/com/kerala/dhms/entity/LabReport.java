package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "lab_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    @JsonProperty("patient_id")
    private Long patientId;

    @Column(name = "visit_id")
    @JsonProperty("visit_id")
    private Long visitId;

    @Column(name = "test_name")
    @JsonProperty("test_name")
    private String testName;

    @Column(name = "test_date")
    @JsonProperty("test_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate testDate;

    private String result;

    @Column(name = "reference_range")
    @JsonProperty("reference_range")
    private String referenceRange;

    private String status;

    @Column(name = "file_url")
    @JsonProperty("file_url")
    private String fileUrl;

    private String facility;
}
