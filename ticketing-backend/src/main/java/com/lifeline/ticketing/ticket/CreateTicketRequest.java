package com.lifeline.ticketing.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public record CreateTicketRequest(
        @NotNull UUID categoryId,
        String subcategory,
        @NotBlank @Size(min = 20, max = 5000) String description,
        Instant noticedAt,
        boolean blockingWork,
        boolean affectsOthers,
        Ticket.ContactTime bestContactTime
) {
}