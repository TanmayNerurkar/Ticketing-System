package com.lifeline.ticketing.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordWithTokenRequest(
        @NotBlank String token,
        @NotBlank @Size(min = 8, message = "New password must be at least 8 characters") String newPassword
) {}
