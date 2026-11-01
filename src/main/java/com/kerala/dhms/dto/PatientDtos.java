package com.kerala.dhms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kerala.dhms.entity.*;
import lombok.*;

import java.util.List;

public class PatientDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PatientListPage {
        private List<Patient> patients;
        private long total;
        private int page;
        private int totalPages;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PatientDetailDto {
        private Patient patient;
        @JsonProperty("health_conditions")
        private List<HealthCondition> healthConditions;
        private List<Vaccination> vaccinations;
        private List<PatientScheme> schemes;
        private List<PatientVisit> visits;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreatePatientRequest {
        private String id;
        private String name;
        private Integer age;
        private String gender;
        private String mobile;
        private String abhaId;
        private String origin;
        private String district;
        private String housing;
        private Integer occupants;
    }
}
