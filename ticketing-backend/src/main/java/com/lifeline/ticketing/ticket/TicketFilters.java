package com.lifeline.ticketing.ticket;

import java.util.UUID;

public record TicketFilters(
        String search,
        TicketStatus status,
        TicketPriority priority,
        UUID assigneeId
) {
}