package com.lifeline.ticketing.user;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String fullName,
        String role,
        UUID organizationId,
        String organizationName,
        boolean active
) {
    public static UserDto from(User u) {
        return new UserDto(
                u.getId(),
                u.getEmail(),
                u.getFullName(),
                u.getRole().name(),
                u.getOrganization() != null ? u.getOrganization().getId() : null,
                u.getOrganization() != null ? u.getOrganization().getName() : null,
                u.isActive()
        );
    }
}