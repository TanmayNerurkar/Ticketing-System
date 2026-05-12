package com.lifeline.ticketing.comment;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TicketCommentRepository extends JpaRepository<TicketComment, UUID> {

    @EntityGraph(attributePaths = "author")
    @Query("""
            SELECT c FROM TicketComment c
            WHERE c.ticket.id = :ticketId
              AND c.deletedAt IS NULL
            ORDER BY c.createdAt ASC
            """)
    List<TicketComment> findByTicketId(@Param("ticketId") UUID ticketId);
}