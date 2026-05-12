package com.lifeline.ticketing.user;

import java.util.UUID;

public record UserSummary(UUID id, String fullName, String email) {
    public static UserSummary from(User u) {
        return u == null ? null : new UserSummary(u.getId(), u.getFullName(), u.getEmail());
    }
}