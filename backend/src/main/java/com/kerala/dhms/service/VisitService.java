package com.kerala.dhms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kerala.dhms.dto.VisitDtos.CreateVisitForm;
import com.kerala.dhms.entity.PatientVisit;
import com.kerala.dhms.entity.VisitAttachment;
import com.kerala.dhms.repository.PatientVisitRepository;
import com.kerala.dhms.repository.VisitAttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitService {

    private final PatientVisitRepository patientVisitRepository;
    private final VisitAttachmentRepository visitAttachmentRepository;
    private final FileStorageService fileStorageService;
    private final SocketIOService socketIOService;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<PatientVisit> getVisits(Long patientId) {
        List<PatientVisit> visits = patientVisitRepository.findByPatientIdOrderByVisitDateDesc(patientId);
        for (PatientVisit v : visits) {
            v.setAttachments(visitAttachmentRepository.findByVisitId(v.getId()));
            if (v.getVitals() != null && !v.getVitals().isBlank()) {
                try {
                    v.setVitalsObj(objectMapper.readValue(v.getVitals(), Object.class));
                } catch (Exception ignored) { }
            }
        }
        return visits;
    }

    @Transactional
    public PatientVisit addVisit(Long patientId, CreateVisitForm form, MultipartFile[] attachments) {
        LocalDateTime visitDateTime = LocalDateTime.now();
        if (form.getVisitDate() != null && !form.getVisitDate().isBlank()) {
            try {
                if (form.getVisitDate().contains("T")) {
                    visitDateTime = LocalDateTime.parse(form.getVisitDate(), DateTimeFormatter.ISO_DATE_TIME);
                } else {
                    visitDateTime = LocalDateTime.parse(form.getVisitDate() + "T00:00:00");
                }
            } catch (Exception ignored) { }
        }

        int followUpRequired = "true".equalsIgnoreCase(form.getFollowUpRequired()) ? 1 : 0;

        PatientVisit visit = PatientVisit.builder()
                .patientId(patientId)
                .visitDate(visitDateTime)
                .facility(form.getFacility())
                .chiefComplaint(form.getChiefComplaint())
                .vitals(form.getVitals())
                .diagnosis(form.getDiagnosis())
                .treatmentNotes(form.getTreatmentNotes())
                .followUpRequired(followUpRequired)
                .followUpDate(form.getFollowUpDate())
                .createdAt(LocalDateTime.now())
                .build();

        PatientVisit savedVisit = patientVisitRepository.save(visit);

        if (attachments != null && attachments.length > 0) {
            for (MultipartFile file : attachments) {
                if (!file.isEmpty()) {
                    String fileUrl = fileStorageService.storeFile(file);
                    VisitAttachment attachment = VisitAttachment.builder()
                            .visitId(savedVisit.getId())
                            .filename(file.getOriginalFilename())
                            .fileType(file.getContentType())
                            .fileUrl(fileUrl)
                            .fileSize(file.getSize())
                            .uploadedAt(LocalDateTime.now())
                            .build();
                    visitAttachmentRepository.save(attachment);
                }
            }
        }

        savedVisit.setAttachments(visitAttachmentRepository.findByVisitId(savedVisit.getId()));
        if (savedVisit.getVitals() != null && !savedVisit.getVitals().isBlank()) {
            try {
                savedVisit.setVitalsObj(objectMapper.readValue(savedVisit.getVitals(), Object.class));
            } catch (Exception ignored) { }
        }

        socketIOService.broadcastVisitAdded(patientId, savedVisit);
        return savedVisit;
    }
}
