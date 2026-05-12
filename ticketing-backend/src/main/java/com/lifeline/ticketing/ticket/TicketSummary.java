package com.lifeline.ticketing.ticket;

import com.lifeline.ticketing.user.UserSummary;

import java.time.Instant;
import java.util.UUID;

public record TicketSummary(
        UUID id,
        String ticketNumber,
        String title,
        String description,
        String status,
        String priority,
        String category,
        String subcategory,
        UserSummary reporter,
        UserSummary assignee,
        String organization,
        boolean blockingWork,
        boolean affectsOthers,
        Instant createdAt,
        Instant slaDueAt
) {
    public static TicketSummary from(Ticket t) {
        return new TicketSummary(
                t.getId(),
                t.getTicketNumber(),
                t.getTitle(),
                t.getDescription(),
                t.getStatus().name(),
                t.getPriority().name(),
                t.getCategory() != null ? t.getCategory().getName() : null,
                t.getSubcategory(),
                UserSummary.from(t.getReporter()),
                UserSummary.from(t.getAssignee()),
                t.getOrganization() != null ? t.getOrganization().getName() : null,
                t.isBlockingWork(),
                t.isAffectsOthers(),
                t.getCreatedAt(),
                t.getSlaDueAt()
        );
    }
}