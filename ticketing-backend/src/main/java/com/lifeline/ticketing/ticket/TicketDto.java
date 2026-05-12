package com.lifeline.ticketing.ticket;

import com.lifeline.ticketing.user.UserSummary;

import java.time.Instant;
import java.util.UUID;

public record TicketDto(
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
        OrganizationSummary organization,
        boolean blockingWork,
        boolean affectsOthers,
        Instant noticedAt,
        Instant createdAt,
        Instant slaDueAt,
        Instant resolvedAt,
        String resolutionNotes,
        String bestContactTime
) {
    public record OrganizationSummary(UUID id, String name) {
    }

    public static TicketDto from(Ticket t) {
        OrganizationSummary org = t.getOrganization() == null ? null
                : new OrganizationSummary(t.getOrganization().getId(), t.getOrganization().getName());
        return new TicketDto(
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
                org,
                t.isBlockingWork(),
                t.isAffectsOthers(),
                t.getNoticedAt(),
                t.getCreatedAt(),
                t.getSlaDueAt(),
                t.getResolvedAt(),
                t.getResolutionNotes(),
                t.getBestContactTime() != null ? t.getBestContactTime().name() : null
        );
    }
}