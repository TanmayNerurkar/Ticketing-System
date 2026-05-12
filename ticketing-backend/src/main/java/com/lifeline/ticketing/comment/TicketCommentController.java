package com.lifeline.ticketing.comment;

import com.lifeline.ticketing.common.exception.ResourceNotFoundException;
import com.lifeline.ticketing.common.security.AuthenticatedUser;
import com.lifeline.ticketing.ticket.Ticket;
import com.lifeline.ticketing.ticket.TicketRepository;
import com.lifeline.ticketing.user.User;
import com.lifeline.ticketing.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class TicketCommentController {

    private final TicketCommentRepository commentRepo;
    private final TicketRepository ticketRepo;
    private final UserRepository userRepo;

    @GetMapping
    @Transactional(readOnly = true)
    public List<CommentDto> list(
            @PathVariable UUID ticketId,
            @AuthenticationPrincipal AuthenticatedUser caller) {
        verifyTicketAccess(ticketId, caller);
        return commentRepo.findByTicketId(ticketId).stream()
                .filter(c -> !"CLIENT".equals(caller.role()) || !c.isInternal())
                .map(CommentDto::from)
                .toList();
    }

    @PostMapping
    @Transactional
    public CommentDto add(
            @PathVariable UUID ticketId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal AuthenticatedUser caller) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        verifyTicketAccess(ticket, caller);

        User author = userRepo.findById(caller.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TicketComment c = new TicketComment();
        c.setTicket(ticket);
        c.setAuthor(author);
        c.setBody(request.body());
        c.setInternal(!"CLIENT".equals(caller.role()) && request.internal());

        commentRepo.save(c);
        return CommentDto.from(c);
    }

    private void verifyTicketAccess(UUID ticketId, AuthenticatedUser caller) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        verifyTicketAccess(ticket, caller);
    }

    private void verifyTicketAccess(Ticket ticket, AuthenticatedUser caller) {
        if ("CLIENT".equals(caller.role())
                && !ticket.getOrganization().getId().equals(caller.organizationId())) {
            throw new AccessDeniedException("Cannot access this ticket");
        }
    }
}