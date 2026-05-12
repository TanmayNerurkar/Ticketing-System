package com.lifeline.ticketing.comment;

import com.lifeline.ticketing.common.BaseEntity;
import com.lifeline.ticketing.ticket.Ticket;
import com.lifeline.ticketing.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ticket_comments")
@Getter
@Setter
public class TicketComment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "is_internal")
    private boolean internal = false;
}