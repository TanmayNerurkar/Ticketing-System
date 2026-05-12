package com.lifeline.ticketing.ticket;

import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class TicketSpecifications {

    private TicketSpecifications() {}

    public static Specification<Ticket> notDeleted() {
        return (root, q, cb) -> cb.isNull(root.get("deletedAt"));
    }

    public static Specification<Ticket> belongsToOrg(UUID orgId) {
        return (root, q, cb) -> cb.equal(root.get("organization").get("id"), orgId);
    }

    public static Specification<Ticket> hasStatus(TicketStatus status) {
        return (root, q, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Ticket> hasPriority(TicketPriority priority) {
        return (root, q, cb) -> priority == null ? cb.conjunction() : cb.equal(root.get("priority"), priority);
    }

    public static Specification<Ticket> assignedTo(UUID assigneeId) {
        return (root, q, cb) -> assigneeId == null ? cb.conjunction()
                : cb.equal(root.get("assignee").get("id"), assigneeId);
    }

    public static Specification<Ticket> textSearch(String text) {
        if (text == null || text.isBlank()) return (r, q, cb) -> cb.conjunction();
        String pattern = "%" + text.toLowerCase() + "%";
        return (root, q, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), pattern),
                cb.like(cb.lower(root.get("ticketNumber")), pattern)
        );
    }
}