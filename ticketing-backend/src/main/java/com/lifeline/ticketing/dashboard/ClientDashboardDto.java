package com.lifeline.ticketing.dashboard;

import com.lifeline.ticketing.ticket.TicketSummary;

import java.util.List;

public record ClientDashboardDto(
        long openCount,
        long waitingCount,
        long resolvedThisWeek,
        List<TicketSummary> recentTickets
) {
}