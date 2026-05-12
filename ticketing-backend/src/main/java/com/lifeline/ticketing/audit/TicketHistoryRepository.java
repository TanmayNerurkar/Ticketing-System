package com.lifeline.ticketing.audit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TicketHistoryRepository extends JpaRepository<TicketHistory, UUID> {
    List<TicketHistory> findByTicketIdOrderByAtDesc(UUID ticketId);
}