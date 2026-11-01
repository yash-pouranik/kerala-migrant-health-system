package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "referrals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    @JsonProperty("patient_id")
    private Long patientId;

    @Column(name = "visit_id")
    @JsonProperty("visit_id")
    private Long visitId;

    @Column(name = "to_facility")
    @JsonProperty("to_facility")
    private String toFacility;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private String priority;

    private String status;

    @Column(name = "referral_date")
    @JsonProperty("referral_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate referralDate;
}
