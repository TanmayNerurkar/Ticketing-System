package com.lifeline.ticketing.dashboard;

import com.lifeline.ticketing.common.security.AuthenticatedUser;
import com.lifeline.ticketing.ticket.Ticket;
import com.lifeline.ticketing.ticket.TicketRepository;
import com.lifeline.ticketing.ticket.TicketStatus;
import com.lifeline.ticketing.ticket.TicketSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboards")
@RequiredArgsConstructor
public class DashboardController {

    private final TicketRepository ticketRepo;

    @GetMapping("/client")
    @PreAuthorize("hasAnyRole('CLIENT','ADMIN')")
    @Transactional(readOnly = true)
    public ClientDashboardDto client(@AuthenticationPrincipal AuthenticatedUser caller) {
        UUID orgId = caller.organizationId();

        long open = ticketRepo.countByOrganizationIdAndStatusIn(orgId,
                Set.of(TicketStatus.OPEN, TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS));
        long waiting = ticketRepo.countByOrganizationIdAndStatus(orgId, TicketStatus.WAITING_CLIENT);

        Instant weekStart = LocalDate.now().with(DayOfWeek.MONDAY)
                .atStartOfDay(ZoneOffset.UTC).toInstant();
        long resolvedThisWeek = ticketRepo.countResolvedSince(orgId, weekStart);

        List<Ticket> recent = ticketRepo.findTop5ByOrganizationIdAndDeletedAtIsNullOrderByCreatedAtDesc(orgId);

        return new ClientDashboardDto(open, waiting, resolvedThisWeek,
                recent.stream().map(TicketSummary::from).toList());
    }

    @GetMapping("/technician")
    @PreAuthorize("hasAnyRole('TECHNICIAN','MANAGER','ADMIN')")
    @Transactional(readOnly = true)
    public TechnicianDashboardDto technician(@AuthenticationPrincipal AuthenticatedUser caller) {
        long active = ticketRepo.countByAssigneeIdAndStatusIn(caller.userId(),
                Set.of(TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS, TicketStatus.WAITING_CLIENT));

        List<TechnicianDashboardDto.WeeklyChartPoint> weekly = List.of(
                new TechnicianDashboardDto.WeeklyChartPoint("Mon", 12, 9),
                new TechnicianDashboardDto.WeeklyChartPoint("Tue", 18, 14),
                new TechnicianDashboardDto.WeeklyChartPoint("Wed", 15, 17),
                new TechnicianDashboardDto.WeeklyChartPoint("Thu", 22, 19),
                new TechnicianDashboardDto.WeeklyChartPoint("Fri", 16, 18),
                new TechnicianDashboardDto.WeeklyChartPoint("Sat", 8, 10),
                new TechnicianDashboardDto.WeeklyChartPoint("Sun", 6, 7)
        );

        return new TechnicianDashboardDto(active, 0, 0, "—", weekly);
    }
}