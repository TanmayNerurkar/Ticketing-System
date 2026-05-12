package com.lifeline.ticketing.auth;

import java.util.UUID;

public record MeResponse(
        UUID id,
        String email,
        String fullName,
        String role,
        OrganizationSummary organization
) {
    public record OrganizationSummary(UUID id, String name, String type) {
    }
}