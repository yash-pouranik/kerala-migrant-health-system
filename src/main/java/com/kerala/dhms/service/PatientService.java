package com.kerala.dhms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kerala.dhms.dto.PatientDtos.*;
import com.kerala.dhms.entity.*;
import com.kerala.dhms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientService {

    private final PatientRepository patientRepository;
    private final HealthConditionRepository healthConditionRepository;
    private final VaccinationRepository vaccinationRepository;
    private final PatientSchemeRepository patientSchemeRepository;
    private final PatientVisitRepository patientVisitRepository;
    private final VisitAttachmentRepository visitAttachmentRepository;
    private final LabReportRepository labReportRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final ReferralRepository referralRepository;
    private final AbdmConsentRequestRepository abdmConsentRequestRepository;
    private final QrCodeService qrCodeService;
    private final SocketIOService socketIOService;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public PatientListPage getPatients(String search, String location, String disease, String role, String userLocation, int page, int limit) {
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        String cleanLocation = (location != null && !location.equalsIgnoreCase("All Districts") && !location.equalsIgnoreCase("All Locations")) ? location.trim() : null;
        String cleanDisease = (disease != null && !disease.equalsIgnoreCase("All Diseases")) ? disease.trim() : null;
        String cleanUserLocation = null;

        if (("DISTRICT_ADMIN".equalsIgnoreCase(role) || "FIELD_WORKER".equalsIgnoreCase(role)) && userLocation != null && !"All".equalsIgnoreCase(userLocation)) {
            cleanUserLocation = userLocation.trim();
        }

        int pageIndex = Math.max(0, page - 1);
        int pageSize = Math.max(1, limit);
        Page<Patient> patientPage = patientRepository.findWithFilters(cleanSearch, cleanLocation, cleanDisease, cleanUserLocation, PageRequest.of(pageIndex, pageSize));

        List<Patient> patients = patientPage.getContent();
        for (Patient p : patients) {
            long conditionsCount = healthConditionRepository.countByPatientIdAndIsActive(p.getId(), 1);
            long vaccinesCompleted = vaccinationRepository.countByPatientIdAndStatus(p.getId(), "Completed");
            p.setConditionsCount(conditionsCount);
            p.setVaccinesCompleted(vaccinesCompleted);
        }

        long total = patientRepository.countByIsActive(1);
        int totalPages = (int) Math.ceil((double) total / pageSize);

        return PatientListPage.builder()
                .patients(patients)
                .total(total)
                .page(page)
                .totalPages(totalPages)
                .build();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPatientProfile(String idOrPatientId) {
        Patient patient = findPatientByIdOrPatientId(idOrPatientId);
        if (patient == null) {
            return null;
        }

        List<HealthCondition> conditions = healthConditionRepository.findByPatientId(patient.getId());
        List<Vaccination> vaccinations = vaccinationRepository.findByPatientIdCustomSorted(patient.getId());
        List<PatientScheme> schemes = patientSchemeRepository.findByPatientId(patient.getId());
        List<PatientVisit> visits = patientVisitRepository.findTop5ByPatientIdOrderByVisitDateDesc(patient.getId());

        for (PatientVisit v : visits) {
            v.setAttachments(visitAttachmentRepository.findByVisitId(v.getId()));
            if (v.getVitals() != null && !v.getVitals().isBlank()) {
                try {
                    v.setVitalsObj(objectMapper.readValue(v.getVitals(), Object.class));
                } catch (Exception ignored) { }
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", patient.getId());
        response.put("patient_id", patient.getPatientId());
        response.put("full_name", patient.getFullName());
        response.put("age", patient.getAge());
        response.put("gender", patient.getGender());
        response.put("blood_group", patient.getBloodGroup());
        response.put("date_of_birth", patient.getDateOfBirth());
        response.put("mobile", patient.getMobile());
        response.put("email", patient.getEmail());
        response.put("abha_id", patient.getAbhaId());
        response.put("abdm_linked", patient.getAbdmLinked());
        response.put("abdm_linked_at", patient.getAbdmLinkedAt());
        response.put("abdm_reference_id", patient.getAbdmReferenceId());
        response.put("origin_state", patient.getOriginState());
        response.put("origin_district", patient.getOriginDistrict());
        response.put("current_location", patient.getCurrentLocation());
        response.put("current_address", patient.getCurrentAddress());
        response.put("accommodation_type", patient.getAccommodationType());
        response.put("room_occupancy", patient.getRoomOccupancy());
        response.put("has_clean_water", patient.getHasCleanWater());
        response.put("toilet_access", patient.getToiletAccess());
        response.put("emergency_contact_name", patient.getEmergencyContactName());
        response.put("emergency_contact_phone", patient.getEmergencyContactPhone());
        response.put("emergency_contact_relation", patient.getEmergencyContactRelation());
        response.put("registered_by", patient.getRegisteredBy());
        response.put("registered_at", patient.getRegisteredAt());
        response.put("last_updated", patient.getLastUpdated());
        response.put("is_active", patient.getIsActive());

        response.put("health_conditions", conditions);
        response.put("vaccinations", vaccinations);
        response.put("schemes", schemes);
        response.put("visits", visits);

        return response;
    }

    public Patient findPatientByIdOrPatientId(String idOrPatientId) {
        try {
            Long numericId = Long.parseLong(idOrPatientId);
            Optional<Patient> p = patientRepository.findById(numericId);
            if (p.isPresent()) return p.get();
        } catch (NumberFormatException ignored) { }

        return patientRepository.findByPatientId(idOrPatientId).orElse(null);
    }

    @Transactional
    public Patient registerPatient(CreatePatientRequest req) {
        String patientId = (req.getId() != null && !req.getId().isBlank()) ? req.getId() : "KDH-2025-" + (int)(100000 + Math.random() * 900000);
        Patient patient = Patient.builder()
                .patientId(patientId)
                .fullName(req.getName())
                .age(req.getAge())
                .gender(req.getGender())
                .mobile(req.getMobile())
                .abhaId(req.getAbhaId())
                .originState(req.getOrigin())
                .currentLocation(req.getDistrict())
                .accommodationType(req.getHousing())
                .roomOccupancy(req.getOccupants())
                .registeredAt(LocalDateTime.now())
                .isActive(1)
                .build();

        Patient saved = patientRepository.save(patient);
        socketIOService.broadcastHealthDataUpdate();
        return saved;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> generateAbhaQr(String patientIdStr) {
        Patient patient = findPatientByIdOrPatientId(patientIdStr);
        if (patient == null) return null;

        Map<String, Object> qrData = new LinkedHashMap<>();
        qrData.put("abhaId", patient.getAbhaId());
        qrData.put("name", patient.getFullName());
        qrData.put("gender", patient.getGender());
        qrData.put("mobile", patient.getMobile());
        qrData.put("patientId", patient.getPatientId());

        try {
            String jsonStr = objectMapper.writeValueAsString(qrData);
            String qrCode = qrCodeService.generateQrCodeBase64(jsonStr, 250, 250);

            Map<String, Object> result = new HashMap<>();
            result.put("qrCode", qrCode);
            result.put("qrData", qrData);
            return result;
        } catch (Exception e) {
            log.error("Failed to generate ABHA QR", e);
            throw new RuntimeException("QR Gen Error", e);
        }
    }

    @Transactional
    public boolean linkAbha(String patientIdStr, String abhaId) {
        Patient patient = findPatientByIdOrPatientId(patientIdStr);
        if (patient == null) return false;

        patient.setAbhaId(abhaId);
        patient.setAbdmLinked(1);
        patient.setAbdmLinkedAt(LocalDateTime.now());
        patientRepository.save(patient);

        log.info("[SMS to {}]: Your record is linked to ABHA ID: {}", patient.getMobile(), abhaId);
        return true;
    }

    public List<LabReport> getLabReports(Long patientId) {
        return labReportRepository.findByPatientIdOrderByTestDateDesc(patientId);
    }

    public List<Prescription> getPrescriptions(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByPrescribedDateDesc(patientId);
    }

    public List<Referral> getReferrals(Long patientId) {
        return referralRepository.findByPatientIdOrderByReferralDateDesc(patientId);
    }

    public List<AbdmConsentRequest> getConsents(Long patientId) {
        return abdmConsentRequestRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }
}
