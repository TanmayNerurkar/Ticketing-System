package com.lifeline.ticketing.ticket;

import java.util.UUID;

public record AssignTicketRequest(
    UUID technicianId  // null = unassign
) {}