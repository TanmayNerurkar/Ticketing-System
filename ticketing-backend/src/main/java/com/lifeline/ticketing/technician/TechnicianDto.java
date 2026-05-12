package com.lifeline.ticketing.technician;

import java.util.List;
import java.util.UUID;

public record TechnicianDto(
        UUID userId,
        String fullName,
        String email,
        List<String> skills,
        String shift,
        boolean available,
        int activeTicketCount,
        int maxConcurrent
) {
    public static TechnicianDto from(Technician t) {
        return new TechnicianDto(
                t.getUserId(),
                t.getUser().getFullName(),
                t.getUser().getEmail(),
                t.getSkills(),
                t.getShift().name(),
                t.isAvailable(),
                t.getActiveTicketCount(),
                t.getMaxConcurrent()
        );
    }
}