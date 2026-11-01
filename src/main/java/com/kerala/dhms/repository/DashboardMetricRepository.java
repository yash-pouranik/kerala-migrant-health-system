package com.kerala.dhms.repository;

import com.kerala.dhms.entity.DashboardMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardMetricRepository extends JpaRepository<DashboardMetric, Long> {
    List<DashboardMetric> findByDistrict(String district);
}
