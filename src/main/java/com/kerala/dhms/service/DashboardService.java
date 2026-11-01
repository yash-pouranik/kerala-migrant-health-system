package com.kerala.dhms.service;

import com.kerala.dhms.dto.DashboardDtos.ChartDataResponse;
import com.kerala.dhms.dto.DashboardDtos.MetricsResponse;
import com.kerala.dhms.repository.HealthConditionRepository;
import com.kerala.dhms.repository.PatientRepository;
import com.kerala.dhms.repository.VaccinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final VaccinationRepository vaccinationRepository;
    private final HealthConditionRepository healthConditionRepository;

    @Transactional(readOnly = true)
    public MetricsResponse getMetrics() {
        long totalMigrants = patientRepository.countByIsActive(1);
        long vaxCompleted = vaccinationRepository.countByStatus("Completed");
        long totalVaxExpected = totalMigrants * 3;
        long vaxCoverage = totalVaxExpected > 0 ? Math.round(((double) vaxCompleted / totalVaxExpected) * 100) : 0;
        long uniqueLocations = patientRepository.countDistinctCurrentLocation();
        long activeAlerts = healthConditionRepository.countByIsActive(1);

        return MetricsResponse.builder()
                .totalMigrants(totalMigrants)
                .vaccinationCoverage(vaxCoverage)
                .uniqueLocations(uniqueLocations)
                .activeAlerts(activeAlerts)
                .build();
    }

    @Transactional(readOnly = true)
    public ChartDataResponse getCharts() {
        List<Map<String, Object>> locationCounts = patientRepository.findDistrictWiseCounts();
        List<Map<String, Object>> locationData = new ArrayList<>();

        for (Map<String, Object> map : locationCounts) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", map.get("name"));
            item.put("count", map.get("count"));
            item.put("score", 85);
            locationData.add(item);
            if (locationData.size() >= 5) break;
        }

        if (locationData.isEmpty()) {
            locationData = Arrays.asList(
                    createLocationItem("Wayanad", 12, 85),
                    createLocationItem("Ernakulam", 8, 88),
                    createLocationItem("Kozhikode", 6, 82),
                    createLocationItem("Malappuram", 5, 80),
                    createLocationItem("Palakkad", 4, 84)
            );
        }

        List<Map<String, Object>> vaccinationData = Arrays.asList(
                createMap("name", "Fully Vaccinated", "value", 65),
                createMap("name", "Partial", "value", 25),
                createMap("name", "Pending", "value", 10)
        );

        List<Map<String, Object>> diseaseTrends = Arrays.asList(
                createMonthCase("Jun", 12),
                createMonthCase("Jul", 19),
                createMonthCase("Aug", 15),
                createMonthCase("Sep", 22),
                createMonthCase("Oct", 30),
                createMonthCase("Nov", 25),
                createMonthCase("Dec", 28)
        );

        return ChartDataResponse.builder()
                .locationData(locationData)
                .vaccinationData(vaccinationData)
                .diseaseTrends(diseaseTrends)
                .build();
    }

    private Map<String, Object> createLocationItem(String name, int count, int score) {
        Map<String, Object> m = new HashMap<>();
        m.put("name", name);
        m.put("count", count);
        m.put("score", score);
        return m;
    }

    private Map<String, Object> createMap(String k1, Object v1, String k2, Object v2) {
        Map<String, Object> m = new HashMap<>();
        m.put(k1, v1);
        m.put(k2, v2);
        return m;
    }

    private Map<String, Object> createMonthCase(String month, int cases) {
        Map<String, Object> m = new HashMap<>();
        m.put("name", month);
        m.put("month", month);
        m.put("cases", cases);
        return m;
    }
}
