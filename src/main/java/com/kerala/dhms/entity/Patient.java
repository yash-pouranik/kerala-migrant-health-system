package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", unique = true, nullable = false)
    @JsonProperty("patient_id")
    private String patientId;

    @Column(name = "full_name", nullable = false)
    @JsonProperty("full_name")
    private String fullName;

    private Integer age;

    private String gender;

    @Column(name = "blood_group")
    @JsonProperty("blood_group")
    private String bloodGroup;

    @Column(name = "date_of_birth")
    @JsonProperty("date_of_birth")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String mobile;

    private String email;

    @Column(name = "abha_id")
    @JsonProperty("abha_id")
    private String abhaId;

    @Column(name = "abdm_linked")
    @JsonProperty("abdm_linked")
    @Builder.Default
    private Integer abdmLinked = 0;

    @Column(name = "abdm_linked_at")
    @JsonProperty("abdm_linked_at")
    private LocalDateTime abdmLinkedAt;

    @Column(name = "abdm_reference_id")
    @JsonProperty("abdm_reference_id")
    private String abdmReferenceId;

    @Column(name = "origin_state")
    @JsonProperty("origin_state")
    private String originState;

    @Column(name = "origin_district")
    @JsonProperty("origin_district")
    private String originDistrict;

    @Column(name = "current_location")
    @JsonProperty("current_location")
    private String currentLocation;

    @Column(name = "current_address", columnDefinition = "TEXT")
    @JsonProperty("current_address")
    private String currentAddress;

    @Column(name = "accommodation_type")
    @JsonProperty("accommodation_type")
    private String accommodationType;

    @Column(name = "room_occupancy")
    @JsonProperty("room_occupancy")
    private Integer roomOccupancy;

    @Column(name = "has_clean_water")
    @JsonProperty("has_clean_water")
    @Builder.Default
    private Integer hasCleanWater = 1;

    @Column(name = "toilet_access")
    @JsonProperty("toilet_access")
    private String toiletAccess;

    @Column(name = "emergency_contact_name")
    @JsonProperty("emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    @JsonProperty("emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "emergency_contact_relation")
    @JsonProperty("emergency_contact_relation")
    private String emergencyContactRelation;

    @Column(name = "registered_by")
    @JsonProperty("registered_by")
    private Long registeredBy;

    @Column(name = "registered_at")
    @JsonProperty("registered_at")
    @Builder.Default
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Column(name = "last_updated")
    @JsonProperty("last_updated")
    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();

    @Column(name = "is_active")
    @JsonProperty("is_active")
    @Builder.Default
    private Integer isActive = 1;

    @Transient
    @JsonProperty("conditions_count")
    @Builder.Default
    private Long conditionsCount = 0L;

    @Transient
    @JsonProperty("vaccines_completed")
    @Builder.Default
    private Long vaccinesCompleted = 0L;

    @PrePersist
    public void prePersist() {
        if (registeredAt == null) registeredAt = LocalDateTime.now();
        if (lastUpdated == null) lastUpdated = LocalDateTime.now();
        if (isActive == null) isActive = 1;
        if (abdmLinked == null) abdmLinked = 0;
    }

    @PreUpdate
    public void preUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
