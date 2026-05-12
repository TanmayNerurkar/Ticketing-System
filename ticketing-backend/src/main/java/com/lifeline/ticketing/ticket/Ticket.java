package com.lifeline.ticketing.ticket;

import com.lifeline.ticketing.category.Category;
import com.lifeline.ticketing.common.BaseEntity;
import com.lifeline.ticketing.organization.Organization;
import com.lifeline.ticketing.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "tickets")
@Getter
@Setter
public class Ticket extends BaseEntity {

    @Column(name = "ticket_number", unique = true, nullable = false)
    private String ticketNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private String subcategory;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.OPEN;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority = TicketPriority.MEDIUM;

    @Column(name = "is_blocking_work")
    private boolean blockingWork;

    private boolean affectsOthers;

    private Instant noticedAt;

    @Enumerated(EnumType.STRING)
    private ContactTime bestContactTime = ContactTime.ANYTIME;

    private Instant slaDueAt;
    private Instant resolvedAt;
    private Instant closedAt;
    private Instant breachAlertedAt;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    public enum ContactTime { MORNING, AFTERNOON, ANYTIME }
}