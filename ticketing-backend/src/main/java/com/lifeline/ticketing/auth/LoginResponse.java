package com.lifeline.ticketing.auth;

public record LoginResponse(
        String token,
        long expiresInSeconds,
        MeResponse user
) {
}