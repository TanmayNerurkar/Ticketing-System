package com.lifeline.ticketing.dashboard;

import java.util.List;

public record TechnicianDashboardDto(
        long activeCount,
        long resolvedToday,
        long slaAtRisk,
        String avgResolution,
        List<WeeklyChartPoint> weeklyChart
) {
    public record WeeklyChartPoint(String day, long opened, long resolved) {
    }
}