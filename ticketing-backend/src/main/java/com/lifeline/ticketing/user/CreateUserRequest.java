package com.lifeline.ticketing.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateUserRequest(
        @Email @NotBlank String email,
        @NotBlank String fullName,
        @NotBlank String role,
        UUID organizationId,
        @NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password
) {}
