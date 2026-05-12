package com.lifeline.ticketing.ticket;

public record UpdateTicketRequest(
        TicketStatus status,
        TicketPriority priority,
        String resolutionNotes
) {
}