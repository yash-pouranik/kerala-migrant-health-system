package com.kerala.dhms.controller;

import com.kerala.dhms.dto.ApiResponse;
import com.kerala.dhms.dto.DashboardDtos.ChartDataResponse;
import com.kerala.dhms.dto.DashboardDtos.MetricsResponse;
import com.kerala.dhms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<?> getMetrics() {
        MetricsResponse metrics = dashboardService.getMetrics();
        return ResponseEntity.ok(ApiResponse.ok(metrics));
    }

    @GetMapping("/charts")
    public ResponseEntity<?> getCharts() {
        ChartDataResponse charts = dashboardService.getCharts();
        return ResponseEntity.ok(ApiResponse.ok(charts));
    }
}
