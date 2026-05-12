package com.lifeline.ticketing.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ticket_history")
@Getter
@Setter
public class TicketHistory {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "ticket_id", nullable = false)
    private UUID ticketId;

    @Column(name = "actor_id")
    private UUID actorId;

    @Column(nullable = false)
    private String action;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "old_value", columnDefinition = "jsonb")
    private String oldValue;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_value", columnDefinition = "jsonb")
    private String newValue;

    @Column(name = "at", nullable = false)
    private Instant at = Instant.now();
}