package com.lifeline.ticketing.ticket;

import com.lifeline.ticketing.assignment.AssignmentService;
import com.lifeline.ticketing.audit.TicketHistoryService;
import com.lifeline.ticketing.category.Category;
import com.lifeline.ticketing.category.CategoryRepository;
import com.lifeline.ticketing.common.exception.ResourceNotFoundException;
import com.lifeline.ticketing.common.security.AuthenticatedUser;
import com.lifeline.ticketing.user.User;
import com.lifeline.ticketing.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static com.lifeline.ticketing.ticket.TicketSpecifications.*;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final AssignmentService assignmentService;
    private final TicketHistoryService historyService;

    @Transactional(readOnly = true)
    public Page<TicketSummary> list(AuthenticatedUser caller, TicketFilters filters, Pageable pageable) {
        Specification<Ticket> spec = Specification.where(notDeleted())
                .and(hasStatus(filters.status()))
                .and(hasPriority(filters.priority()))
                .and(textSearch(filters.search()));

        if ("CLIENT".equals(caller.role())) {
            spec = spec.and(belongsToOrg(caller.organizationId()));
        }
        if (filters.assigneeId() != null) {
            spec = spec.and(assignedTo(filters.assigneeId()));
        }

        return ticketRepository.findAll(spec, pageable).map(TicketSummary::from);
    }

    @Transactional(readOnly = true)
    public TicketDto get(UUID id, AuthenticatedUser caller) {
        Ticket ticket = ticketRepository.findWithRelationsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        enforceCanView(ticket, caller);
        return TicketDto.from(ticket);
    }

    @Transactional
    public TicketDto create(CreateTicketRequest request, AuthenticatedUser caller) {
        User reporter = userRepository.findById(caller.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Reporter not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Ticket ticket = new Ticket();
        ticket.setTicketNumber(generateTicketNumber());
        ticket.setOrganization(reporter.getOrganization());
        ticket.setReporter(reporter);
        ticket.setCategory(category);
        ticket.setSubcategory(request.subcategory());
        ticket.setDescription(request.description());
        ticket.setTitle(buildTitle(request));
        ticket.setBlockingWork(request.blockingWork());
        ticket.setAffectsOthers(request.affectsOthers());
        ticket.setNoticedAt(request.noticedAt());
        ticket.setBestContactTime(request.bestContactTime() != null
                ? request.bestContactTime() : Ticket.ContactTime.ANYTIME);
        ticket.setPriority(computePriority(request));
        ticket.setSlaDueAt(computeSlaDueAt(ticket.getPriority()));

        ticket = ticketRepository.save(ticket);

        // Auto-assign
        Optional<User> assignee = assignmentService.autoAssign(ticket);
        if (assignee.isPresent()) {
            ticket.setAssignee(assignee.get());
            ticket.setStatus(TicketStatus.ASSIGNED);
            historyService.recordAssignment(ticket, assignee.get());
        }

        historyService.recordCreated(ticket);
        return TicketDto.from(ticket);
    }

    @CacheEvict(value = "tickets", key = "#id")
    @Transactional
    public TicketDto update(UUID id, UpdateTicketRequest request, AuthenticatedUser caller) {
        Ticket ticket = ticketRepository.findWithRelationsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        enforceCanEdit(ticket, caller);

        TicketStatus oldStatus = ticket.getStatus();

        if (request.status() != null && request.status() != oldStatus) {
            ticket.setStatus(request.status());
            if (request.status() == TicketStatus.RESOLVED) {
                ticket.setResolvedAt(Instant.now());
                ticket.setResolutionNotes(request.resolutionNotes());
                if (ticket.getAssignee() != null) {
                    assignmentService.markResolved(ticket.getAssignee().getId());
                }
            }
            historyService.recordStatusChange(ticket, oldStatus, request.status(), caller);
        }

        if (request.priority() != null) {
            ticket.setPriority(request.priority());
            ticket.setSlaDueAt(computeSlaDueAt(request.priority()));
        }

        return TicketDto.from(ticket);
    }

    // ---- helpers ----

    private String generateTicketNumber() {
        Long seq = ticketRepository.getNextSequence();
        return String.format("TKT-%d-%05d", java.time.Year.now().getValue(), seq);
    }

    private TicketPriority computePriority(CreateTicketRequest req) {
        if (req.blockingWork() && req.affectsOthers()) return TicketPriority.CRITICAL;
        if (req.blockingWork()) return TicketPriority.HIGH;
        if (req.affectsOthers()) return TicketPriority.MEDIUM;
        return TicketPriority.LOW;
    }

    private Instant computeSlaDueAt(TicketPriority p) {
        long hours = switch (p) {
            case CRITICAL -> 2;
            case HIGH -> 8;
            case MEDIUM -> 24;
            case LOW -> 72;
        };
        return Instant.now().plus(hours, ChronoUnit.HOURS);
    }

    private String buildTitle(CreateTicketRequest req) {
        String firstLine = req.description().split("\\.")[0].trim();
        return firstLine.length() > 100 ? firstLine.substring(0, 97) + "..." : firstLine;
    }

    private void enforceCanView(Ticket ticket, AuthenticatedUser caller) {
        if ("CLIENT".equals(caller.role())
                && !ticket.getOrganization().getId().equals(caller.organizationId())) {
            throw new AccessDeniedException("Cannot view this ticket");
        }
    }

    private void enforceCanEdit(Ticket ticket, AuthenticatedUser caller) {
        if ("CLIENT".equals(caller.role())
                && !ticket.getReporter().getId().equals(caller.userId())) {
            throw new AccessDeniedException("Cannot edit this ticket");
        }
    }
}