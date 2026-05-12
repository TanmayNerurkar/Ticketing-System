package com.lifeline.ticketing.ticket;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID>, JpaSpecificationExecutor<Ticket> {

    @EntityGraph(attributePaths = {"reporter", "assignee", "organization", "category"})
    Optional<Ticket> findWithRelationsById(UUID id);

    @Query("""
            SELECT t FROM Ticket t
            WHERE t.status NOT IN ('RESOLVED', 'CLOSED')
              AND t.slaDueAt < :now
              AND t.breachAlertedAt IS NULL
              AND t.deletedAt IS NULL
            """)
    List<Ticket> findBreachedTickets(@Param("now") Instant now);

    @Query(value = "SELECT nextval('ticket_number_seq')", nativeQuery = true)
    Long getNextSequence();

    long countByOrganizationIdAndStatusIn(UUID organizationId, Collection<TicketStatus> statuses);

    long countByOrganizationIdAndStatus(UUID organizationId, TicketStatus status);

    long countByAssigneeIdAndStatusIn(UUID assigneeId, Collection<TicketStatus> statuses);

    @Query("""
            SELECT COUNT(t) FROM Ticket t
            WHERE t.organization.id = :orgId
              AND t.resolvedAt >= :since
              AND t.deletedAt IS NULL
            """)
    long countResolvedSince(@Param("orgId") UUID orgId, @Param("since") Instant since);

    @EntityGraph(attributePaths = {"reporter", "assignee", "category", "organization"})
    List<Ticket> findTop5ByOrganizationIdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID orgId);
}