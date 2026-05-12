package com.lifeline.ticketing.ticket;

import com.lifeline.ticketing.common.security.AuthenticatedUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public Page<TicketSummary> list(
            @AuthenticationPrincipal AuthenticatedUser caller,
            @ModelAttribute TicketFilters filters,
            Pageable pageable) {
        return ticketService.list(caller, filters, pageable);
    }

    @GetMapping("/{id}")
    public TicketDto get(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser caller) {
        return ticketService.get(id, caller);
    }

    @PostMapping
    public TicketDto create(
            @Valid @RequestBody CreateTicketRequest request,
            @AuthenticationPrincipal AuthenticatedUser caller) {
        return ticketService.create(request, caller);
    }

    @PatchMapping("/{id}")
    public TicketDto update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTicketRequest request,
            @AuthenticationPrincipal AuthenticatedUser caller) {
        return ticketService.update(id, request, caller);
    }
}