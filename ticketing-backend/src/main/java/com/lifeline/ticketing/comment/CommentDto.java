package com.lifeline.ticketing.comment;

import com.lifeline.ticketing.user.UserSummary;

import java.time.Instant;
import java.util.UUID;

public record CommentDto(
        UUID id,
        UserSummary author,
        String body,
        boolean internal,
        Instant createdAt
) {
    public static CommentDto from(TicketComment c) {
        return new CommentDto(
                c.getId(),
                UserSummary.from(c.getAuthor()),
                c.getBody(),
                c.isInternal(),
                c.getCreatedAt()
        );
    }
}