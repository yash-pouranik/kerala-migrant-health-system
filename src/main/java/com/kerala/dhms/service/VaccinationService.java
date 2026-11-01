package com.kerala.dhms.service;

import com.kerala.dhms.dto.VisitDtos.CompleteVaccinationForm;
import com.kerala.dhms.entity.Vaccination;
import com.kerala.dhms.repository.VaccinationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VaccinationService {

    private final VaccinationRepository vaccinationRepository;
    private final FileStorageService fileStorageService;
    private final SocketIOService socketIOService;

    @Transactional(readOnly = true)
    public List<Vaccination> getVaccinations(Long patientId) {
        return vaccinationRepository.findByPatientIdCustomSorted(patientId);
    }

    @Transactional
    public boolean completeVaccination(Long patientId, Long vaccineId, CompleteVaccinationForm form, MultipartFile certificate) {
        Vaccination vaccination = vaccinationRepository.findById(vaccineId).orElse(null);
        if (vaccination == null) return false;

        vaccination.setStatus("Completed");
        if (form.getAdministeredDate() != null && !form.getAdministeredDate().isBlank()) {
            try {
                vaccination.setAdministeredDate(LocalDate.parse(form.getAdministeredDate()));
            } catch (Exception ignored) { }
        } else {
            vaccination.setAdministeredDate(LocalDate.now());
        }

        if (form.getNextDueDate() != null && !form.getNextDueDate().isBlank()) {
            try {
                vaccination.setNextDueDate(LocalDate.parse(form.getNextDueDate()));
            } catch (Exception ignored) { }
        }

        if (form.getBatchNumber() != null) vaccination.setBatchNumber(form.getBatchNumber());
        if (form.getAdministratorName() != null) vaccination.setAdministratorName(form.getAdministratorName());

        if (certificate != null && !certificate.isEmpty()) {
            String certificateUrl = fileStorageService.storeFile(certificate);
            vaccination.setCertificateUrl(certificateUrl);
        }

        vaccinationRepository.save(vaccination);
        socketIOService.broadcastVaccinationUpdated(patientId, vaccineId);
        return true;
    }
}
