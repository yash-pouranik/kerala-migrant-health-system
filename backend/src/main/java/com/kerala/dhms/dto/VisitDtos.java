package com.kerala.dhms.dto;

import lombok.*;

public class VisitDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateVisitForm {
        private String visitDate;
        private String facility;
        private String chiefComplaint;
        private String vitals;
        private String diagnosis;
        private String treatmentNotes;
        private String followUpRequired;
        private String followUpDate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompleteVaccinationForm {
        private String administeredDate;
        private String batchNumber;
        private String administratorName;
        private String nextDueDate;
        private String vaccineName;
    }
}
