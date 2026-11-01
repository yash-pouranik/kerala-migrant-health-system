package com.kerala.dhms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "dashboard_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_type")
    @JsonProperty("metric_type")
    private String metricType;

    private String district;

    @Column(name = "metric_value")
    @JsonProperty("metric_value")
    private Double metricValue;

    @Column(name = "calculated_at")
    @JsonProperty("calculated_at")
    @Builder.Default
    private LocalDateTime calculatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        if (calculatedAt == null) calculatedAt = LocalDateTime.now();
    }
}
