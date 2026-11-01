package com.kerala.dhms.controller;

import com.kerala.dhms.dto.ApiResponse;
import com.kerala.dhms.dto.VisitDtos.CompleteVaccinationForm;
import com.kerala.dhms.entity.Vaccination;
import com.kerala.dhms.service.VaccinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients/{patientId}/vaccinations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VaccinationController {

    private final VaccinationService vaccinationService;

    @GetMapping
    public ResponseEntity<?> getVaccinations(@PathVariable Long patientId) {
        List<Vaccination> vaccinations = vaccinationService.getVaccinations(patientId);
        Map<String, Object> data = new HashMap<>();
        data.put("vaccinations", vaccinations);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @PostMapping(value = "/{vaccineId}/complete", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> completeVaccination(
            @PathVariable Long patientId,
            @PathVariable Long vaccineId,
            @ModelAttribute CompleteVaccinationForm form,
            @RequestPart(value = "certificate", required = false) MultipartFile certificate
    ) {
        boolean success = vaccinationService.completeVaccination(patientId, vaccineId, form, certificate);
        if (!success) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Vaccination record not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Vaccination completed", null));
    }
}
