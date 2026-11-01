package com.kerala.dhms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.Map;

public class DashboardDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MetricsResponse {
        private long totalMigrants;
        private long vaccinationCoverage;
        private long uniqueLocations;
        private long activeAlerts;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChartDataResponse {
        private List<Map<String, Object>> locationData;
        private List<Map<String, Object>> vaccinationData;
        private List<Map<String, Object>> diseaseTrends;
    }
}
