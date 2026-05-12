package com.lifeline.ticketing.assignment;

import com.lifeline.ticketing.technician.Technician;
import com.lifeline.ticketing.technician.TechnicianRepository;
import com.lifeline.ticketing.ticket.Ticket;
import com.lifeline.ticketing.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentService {

    private final WorkloadTracker workloadTracker;
    private final TechnicianRepository technicianRepository;

    @Transactional
    public Optional<User> autoAssign(Ticket ticket) {
        String skillKey = deriveSkillKey(ticket);

        if (workloadTracker.countTechnicians(skillKey) == 0) {
            warmUpWorkload(skillKey);
        }

        Optional<UUID> technicianUserId = workloadTracker.findLeastLoaded(skillKey);
        if (technicianUserId.isEmpty()) {
            log.warn("No technicians available for skill={}", skillKey);
            return Optional.empty();
        }

        UUID techId = technicianUserId.get();
        workloadTracker.incrementLoad(skillKey, techId, 1);

        Optional<Technician> technician = technicianRepository.findById(techId);
        if (technician.isEmpty()) {
            log.error("Technician {} exists in Redis but not in DB", techId);
            workloadTracker.incrementLoad(skillKey, techId, -1);
            return Optional.empty();
        }

        log.info("Auto-assigned ticket {} to {}",
                ticket.getTicketNumber(), technician.get().getUser().getFullName());
        return Optional.of(technician.get().getUser());
    }

    @Transactional
    public void markResolved(UUID technicianUserId) {
        Optional<Technician> tech = technicianRepository.findById(technicianUserId);
        if (tech.isEmpty() || tech.get().getSkills() == null) return;

        for (String skill : tech.get().getSkills()) {
            workloadTracker.incrementLoad(skill, technicianUserId, -1);
        }
    }

    @Transactional(readOnly = true)
    public void warmUpAllSkills() {
        log.info("Warming up Redis from Postgres");
        for (Technician tech : technicianRepository.findAllAvailable()) {
            if (tech.getSkills() == null) continue;
            for (String skill : tech.getSkills()) {
                workloadTracker.register(skill, tech.getUserId(), tech.getActiveTicketCount());
            }
        }
    }

    @Transactional(readOnly = true)
    public void warmUpWorkload(String skill) {
        workloadTracker.clear(skill);
        technicianRepository.findAvailableBySkill(skill).forEach(tech ->
                workloadTracker.register(skill, tech.getUserId(), tech.getActiveTicketCount())
        );
    }

    private String deriveSkillKey(Ticket ticket) {
        if (ticket.getCategory() != null && ticket.getCategory().getRequiredSkill() != null) {
            return ticket.getCategory().getRequiredSkill();
        }
        return "general";
    }
}