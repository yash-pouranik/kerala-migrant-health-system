package com.kerala.dhms.controller;

import com.kerala.dhms.dto.ApiResponse;
import com.kerala.dhms.dto.VisitDtos.CreateVisitForm;
import com.kerala.dhms.entity.PatientVisit;
import com.kerala.dhms.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients/{patientId}/visits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitController {

    private final VisitService visitService;

    @GetMapping
    public ResponseEntity<?> getVisits(@PathVariable Long patientId) {
        List<PatientVisit> visits = visitService.getVisits(patientId);
        Map<String, Object> data = new HashMap<>();
        data.put("visits", visits);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> addVisit(
            @PathVariable Long patientId,
            @ModelAttribute CreateVisitForm form,
            @RequestPart(value = "attachments", required = false) MultipartFile[] attachments
    ) {
        PatientVisit visit = visitService.addVisit(patientId, form, attachments);
        Map<String, Object> data = new HashMap<>();
        data.put("visit", visit);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
