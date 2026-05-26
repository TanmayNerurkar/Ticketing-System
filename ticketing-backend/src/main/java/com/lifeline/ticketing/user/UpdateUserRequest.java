package com.lifeline.ticketing.user;

import java.util.UUID;

public record UpdateUserRequest(
        String fullName,
        String role,
        UUID organizationId,
        Boolean active
) {}
