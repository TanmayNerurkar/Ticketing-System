package com.lifeline.ticketing.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifeline.ticketing.common.security.AuthenticatedUser;
import com.lifeline.ticketing.ticket.Ticket;
import com.lifeline.ticketing.ticket.TicketStatus;
import com.lifeline.ticketing.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketHistoryService {

    private final TicketHistoryRepository repository;
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public void recordCreated(Ticket ticket) {
        TicketHistory h = base(ticket.getId(), null, "Ticket created");
        h.setNewValue(toJson(Map.of(
                "title", ticket.getTitle(),
                "priority", ticket.getPriority().name(),
                "category", ticket.getCategory() != null ? ticket.getCategory().getName() : "none"
        )));
        repository.save(h);
    }

    public void recordAssignment(Ticket ticket, User assignee) {
        TicketHistory h = base(ticket.getId(), null, "Auto-assigned to " + assignee.getFullName());
        h.setNewValue(toJson(Map.of("assigneeId", assignee.getId().toString())));
        repository.save(h);
    }

    public void recordStatusChange(Ticket ticket, TicketStatus from, TicketStatus to, AuthenticatedUser actor) {
        TicketHistory h = base(ticket.getId(), actor.userId(),
                "Status changed: " + from + " -> " + to);
        h.setOldValue(toJson(Map.of("status", from.name())));
        h.setNewValue(toJson(Map.of("status", to.name())));
        repository.save(h);
    }

    private TicketHistory base(UUID ticketId, UUID actorId, String action) {
        TicketHistory h = new TicketHistory();
        h.setTicketId(ticketId);
        h.setActorId(actorId);
        h.setAction(action);
        return h;
    }

    private String toJson(Map<String, Object> map) {
        try {
            return MAPPER.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }
}