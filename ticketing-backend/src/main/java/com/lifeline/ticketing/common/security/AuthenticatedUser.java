package com.lifeline.ticketing.common.security;

import java.util.UUID;

public record AuthenticatedUser(UUID userId, String email, String role, UUID organizationId) {
}