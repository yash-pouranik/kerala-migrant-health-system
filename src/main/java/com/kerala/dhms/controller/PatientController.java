package com.kerala.dhms.controller;

import com.kerala.dhms.dto.ApiResponse;
import com.kerala.dhms.dto.PatientDtos.CreatePatientRequest;
import com.kerala.dhms.dto.PatientDtos.PatientListPage;
import com.kerala.dhms.entity.*;
import com.kerala.dhms.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<?> getPatients(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String disease,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String userLocation,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit
    ) {
        PatientListPage result = patientService.getPatients(search, location, disease, role, userLocation, page, limit);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable String id) {
        Map<String, Object> patientData = patientService.getPatientProfile(id);
        if (patientData == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
        return ResponseEntity.ok(ApiResponse.ok(patientData));
    }

    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody CreatePatientRequest request) {
        Patient patient = patientService.registerPatient(request);
        return ResponseEntity.ok(ApiResponse.ok(patient));
    }

    @GetMapping("/{patientId}/abha/qr")
    public ResponseEntity<?> getAbhaQr(@PathVariable String patientId) {
        Map<String, Object> qr = patientService.generateAbhaQr(patientId);
        if (qr == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Patient not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(qr));
    }

    @PostMapping("/{patientId}/abha/link")
    public ResponseEntity<?> linkAbha(@PathVariable String patientId, @RequestBody Map<String, String> body) {
        String abhaId = body.get("abhaId");
        boolean ok = patientService.linkAbha(patientId, abhaId);
        if (!ok) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Patient not found"));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("recordsSynced", 12);
        return ResponseEntity.ok(ApiResponse.ok("ABHA Linked Successfully", data));
    }

    @GetMapping("/{patientId}/labs")
    public ResponseEntity<?> getLabs(@PathVariable Long patientId) {
        List<LabReport> labs = patientService.getLabReports(patientId);
        Map<String, Object> data = new HashMap<>();
        data.put("labs", labs);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/{patientId}/prescriptions")
    public ResponseEntity<?> getPrescriptions(@PathVariable Long patientId) {
        List<Prescription> prescriptions = patientService.getPrescriptions(patientId);
        Map<String, Object> data = new HashMap<>();
        data.put("prescriptions", prescriptions);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/{patientId}/referrals")
    public ResponseEntity<?> getReferrals(@PathVariable Long patientId) {
        List<Referral> referrals = patientService.getReferrals(patientId);
        Map<String, Object> data = new HashMap<>();
        data.put("referrals", referrals);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/{patientId}/consents")
    public ResponseEntity<?> getConsents(@PathVariable Long patientId) {
        List<AbdmConsentRequest> consents = patientService.getConsents(patientId);
        Map<String, Object> data = new HashMap<>();
        data.put("consents", consents);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
